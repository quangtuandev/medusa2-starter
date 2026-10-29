import { jsx } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const FRAG = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uTex;     // hero image + type, painted offscreen
uniform vec2  uRes;         // drawing buffer size in device px
uniform float uTime;        // seconds
uniform float uDpr;
uniform vec4  uLens;        // xy: lens center (device px), z: radius, w: press scale
uniform vec4  uMotion;      // xy: velocity direction, z: stretch, w: wobble amplitude
uniform float uMag;         // magnification inside the lens
uniform float uRefract;     // refraction strength 0..1
uniform float uFrost;       // frosted blur 0..1
uniform int   uRippleCount;
uniform vec4  uRipples[8];  // xy: origin (device px), z: age s, w: amplitude

out vec4 outColor;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Click ripples: a travelling wave packet that displaces the sampling position.
vec2 rippleOffset(vec2 frag) {
  vec2 off = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= uRippleCount) break;
    vec4 rp = uRipples[i];
    vec2 d = frag - rp.xy;
    float dist = max(length(d), 1.0);
    float front = rp.z * 520.0 * uDpr;            // wavefront distance
    float x = (dist - front) / (90.0 * uDpr);     // position inside the packet
    float wave = sin(x * 6.2831) * exp(-x * x * 3.0);
    float atten = exp(-rp.z * 2.2) * exp(-dist / (900.0 * uDpr));
    off += (d / dist) * wave * atten * rp.w * 14.0 * uDpr;
  }
  return off;
}

vec3 pageAt(vec2 frag, vec2 roff) {
  vec2 uv = clamp((frag + roff) / uRes, 0.0, 1.0);
  return texture(uTex, uv).rgb;
}

void main() {
  vec2 frag = gl_FragCoord.xy;

  vec2 lensC = uLens.xy;
  float R = uLens.z * uLens.w;

  // Lens-local coordinates, squashed along the motion direction so the
  // droplet elongates when dragged fast.
  vec2 q = frag - lensC;
  vec2 dir = uMotion.xy;
  float stretch = uMotion.z;
  if (stretch > 0.001) {
    vec2 tangent = vec2(dir.y, -dir.x);
    float a = dot(q, dir) / (1.0 + stretch);
    float b = dot(q, tangent) * (1.0 + stretch * 0.5);
    q = dir * a + tangent * b;
  }

  // Organic wobble: low-order sines around the rim, amplitude driven by motion.
  float ang = atan(q.y, q.x);
  float wob = uMotion.w * (
      0.030 * sin(ang * 3.0 + uTime * 2.1)
    + 0.022 * sin(ang * 5.0 - uTime * 3.3)
    + 0.014 * sin(ang * 7.0 + uTime * 4.7)
  ) + 0.006 * sin(ang * 2.0 + uTime * 0.8);

  float r = length(q);
  float Rw = R * (1.0 + wob);
  float d = r - Rw;
  float aa = 1.5 * uDpr;
  float inside = 1.0 - smoothstep(-aa, aa, d);

  // Transparent outside the disc: the real DOM image and type stay untouched.
  if (inside <= 0.0) {
    outColor = vec4(0.0);
    return;
  }

  vec2 roff = rippleOffset(frag);

  // Treat the lens as a glass dome; derive a 3D normal from the SDF.
  float r01 = clamp(r / Rw, 0.0, 1.0);
  float h = sqrt(max(1.0 - r01 * r01, 0.0));
  vec3 N = normalize(vec3(q / Rw, h * 1.15));

  // Magnify toward the center, then bend rays outward near the rim.
  vec2 mfrag = lensC + (frag - lensC) / uMag;
  float bend = 1.0 - h;
  vec2 refr = -N.xy * bend * uRefract * R * 0.14;
  float ca = 0.015 * uRefract; // chromatic aberration spread (subtle)

  float frostR = uFrost * (0.25 + 0.75 * bend) * 4.0 * uDpr;
  vec2 taps[5] = vec2[5](
    vec2(0.0, 0.0), vec2(1.0, 0.3), vec2(-0.6, 0.9),
    vec2(-0.9, -0.5), vec2(0.5, -0.9)
  );

  vec3 acc = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    vec2 o = taps[i] * frostR;
    acc.r += pageAt(mfrag + refr * (1.0 + ca) + o, roff).r;
    acc.g += pageAt(mfrag + refr + o, roff).g;
    acc.b += pageAt(mfrag + refr * (1.0 - ca) + o, roff).b;
  }
  vec3 glass = acc / 5.0;

  // Glass makes colors pop slightly.
  float lum = dot(glass, vec3(0.299, 0.587, 0.114));
  glass = mix(vec3(lum), glass, 1.06);

  // Lighting: a key light from the top-left.
  vec3 L = normalize(vec3(-0.35, 0.55, 0.75));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float ndh = max(dot(N, H), 0.0);
  float spec = pow(ndh, 90.0) * 0.9 + pow(ndh, 18.0) * 0.18;
  float fres = pow(1.0 - max(N.z, 0.0), 2.5);
  float innerShade = smoothstep(0.2, 1.0, dot(normalize(N.xy + 1e-5), normalize(vec2(0.4, -0.8)))) * fres * 0.10;

  glass *= 1.0 - innerShade * 0.35;
  glass += spec * 0.55 + fres * 0.10;
  glass += (1.0 - smoothstep(0.0, aa * 2.5, abs(d))) * 0.16;    // bright rim line
  glass += (hash21(frag + uTime) - 0.5) * uFrost * 0.05;        // frost grain

  outColor = vec4(glass, inside);
}`;
const DEFAULT_CONFIG = {
  lensRadius: 150,
  magnification: 1.25,
  refraction: 1,
  frost: 0.35
};
const DEFAULT_TEXT_COLOR = "#FFFFFF";
const FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function compileProgram(gl) {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("LiquidGlassLens shader error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERT);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("LiquidGlassLens link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
  }
  return lines.length > 0 ? lines : [text];
}
function findTextElement(root, selector, text) {
  if (!root) return null;
  const candidates = Array.from(root.querySelectorAll(selector));
  const wanted = text == null ? void 0 : text.trim().toLowerCase();
  if (wanted) {
    const match = candidates.find((element) => {
      var _a;
      return ((_a = element.textContent) == null ? void 0 : _a.trim().toLowerCase()) === wanted;
    });
    if (match) return match;
  }
  return candidates[0] ?? null;
}
function measureTextLayout(ctx, canvas, element, text) {
  if (!element || !text) return null;
  const rect = element.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  const style = window.getComputedStyle(element);
  const fontSize = Number.parseFloat(style.fontSize);
  const lineHeight = style.lineHeight === "normal" ? fontSize * 1.2 : Number.parseFloat(style.lineHeight);
  if (!Number.isFinite(fontSize) || fontSize <= 0 || !Number.isFinite(lineHeight)) return null;
  if (rect.height > lineHeight * 1.6) return null;
  ctx.save();
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  const font = ctx.font;
  const letterSpacing = ctx.letterSpacing;
  const metrics = ctx.measureText(text);
  ctx.restore();
  const ascent = Number.isFinite(metrics.fontBoundingBoxAscent) ? metrics.fontBoundingBoxAscent : fontSize * 0.8;
  const descent = Number.isFinite(metrics.fontBoundingBoxDescent) ? metrics.fontBoundingBoxDescent : fontSize * 0.2;
  const canvasRect = canvas.getBoundingClientRect();
  const centered = style.textAlign === "center";
  return {
    x: centered ? rect.left - canvasRect.left + rect.width / 2 : rect.left - canvasRect.left,
    // Centre the font's ascent/descent box inside the CSS line box, then sit on its baseline.
    baseline: rect.top - canvasRect.top + (lineHeight - (ascent + descent)) / 2 + ascent,
    align: centered ? "center" : "left",
    font,
    letterSpacing,
    color: style.color
  };
}
function paintTextLayout(ctx, layout, text) {
  ctx.save();
  ctx.font = layout.font;
  ctx.letterSpacing = layout.letterSpacing;
  ctx.fillStyle = layout.color;
  ctx.textAlign = layout.align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, layout.x, layout.baseline);
  ctx.restore();
}
function paintScene(ctx, canvas, image, width, height, scale, options) {
  var _a, _b, _c, _d;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * cover;
  const drawHeight = image.naturalHeight * cover;
  ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  const parent = canvas.parentElement;
  const titleElement = findTextElement(parent, "h1", options.title);
  const subtitleElement = findTextElement(parent, "p", options.subtitle);
  const title = (((_a = options.title) == null ? void 0 : _a.trim()) || ((_b = titleElement == null ? void 0 : titleElement.textContent) == null ? void 0 : _b.trim()) || "").toUpperCase();
  const subtitle = ((_c = options.subtitle) == null ? void 0 : _c.trim()) || ((_d = subtitleElement == null ? void 0 : subtitleElement.textContent) == null ? void 0 : _d.trim()) || "";
  const titleLayout = title ? measureTextLayout(ctx, canvas, titleElement, title) : null;
  const subtitleLayout = subtitle ? measureTextLayout(ctx, canvas, subtitleElement, subtitle) : null;
  const centered = options.textAlign === "center";
  const padX = clamp(width * 0.06, 24, 96);
  const padBottom = clamp(height * 0.09, 24, 96);
  const subtitleSize = clamp(height * 0.021, 14, 30);
  const titleSize = clamp(height * 0.085, 40, 130);
  const fallbackX = centered ? width / 2 : padX;
  if (title) {
    if (titleLayout) {
      paintTextLayout(ctx, titleLayout, title);
    } else {
      ctx.save();
      ctx.fillStyle = options.textColor;
      ctx.textAlign = centered ? "center" : "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = `700 ${titleSize}px ${FONT_STACK}`;
      ctx.letterSpacing = "-0.03em";
      const lines = wrapText(ctx, title, Math.max(width - padX * 2, 1));
      const baseline = height - padBottom - (subtitle ? subtitleSize * 1.85 : 0);
      lines.forEach((line, index) => {
        ctx.fillText(line, fallbackX, baseline - (lines.length - 1 - index) * titleSize);
      });
      ctx.restore();
    }
  }
  if (subtitle) {
    if (subtitleLayout) {
      paintTextLayout(ctx, subtitleLayout, subtitle);
    } else {
      ctx.save();
      ctx.fillStyle = options.textColor;
      ctx.textAlign = centered ? "center" : "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = `300 ${subtitleSize}px ${FONT_STACK}`;
      ctx.letterSpacing = "0.02em";
      ctx.fillText(subtitle, fallbackX, height - padBottom);
      ctx.restore();
    }
  }
}
function initLens(canvas, image, options) {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false, antialias: true });
  if (!gl) return () => {
  };
  const program = compileProgram(gl);
  if (!program) return () => {
  };
  const buffer = gl.createBuffer();
  const vao = gl.createVertexArray();
  const texture = gl.createTexture();
  if (!buffer || !vao || !texture) {
    gl.deleteBuffer(buffer);
    gl.deleteVertexArray(vao);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    return () => {
    };
  }
  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const uTex = gl.getUniformLocation(program, "uTex");
  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uDpr = gl.getUniformLocation(program, "uDpr");
  const uLens = gl.getUniformLocation(program, "uLens");
  const uMotion = gl.getUniformLocation(program, "uMotion");
  const uMag = gl.getUniformLocation(program, "uMag");
  const uRefract = gl.getUniformLocation(program, "uRefract");
  const uFrost = gl.getUniformLocation(program, "uFrost");
  const uRippleCount = gl.getUniformLocation(program, "uRippleCount");
  const uRipples = gl.getUniformLocation(program, "uRipples[0]");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(uTex, 0);
  gl.uniform1f(uMag, options.magnification);
  gl.uniform1f(uRefract, options.refraction);
  gl.uniform1f(uFrost, options.frost);
  const scene = document.createElement("canvas");
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  let dpr = 1;
  const paint = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const textureScale = Math.min(dpr, maxTextureSize / Math.max(rect.width, rect.height));
    scene.width = Math.max(1, Math.round(rect.width * textureScale));
    scene.height = Math.max(1, Math.round(rect.height * textureScale));
    const ctx = scene.getContext("2d");
    if (!ctx) return;
    paintScene(ctx, canvas, image, rect.width, rect.height, textureScale, options);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scene);
    gl.generateMipmap(gl.TEXTURE_2D);
  };
  paint();
  let stopped = false;
  const repaint = () => {
    if (!stopped) paint();
  };
  void document.fonts.ready.then(repaint).catch(() => {
  });
  document.fonts.addEventListener("loadingdone", repaint);
  let resizeTimer = 0;
  const resizeObserver = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(paint, 150);
  });
  resizeObserver.observe(canvas.parentElement ?? canvas);
  let px = canvas.width / 2;
  let py = canvas.height / 2;
  let vx = 0;
  let vy = 0;
  let tx = px;
  let ty = py;
  let dirX = 0;
  let dirY = 1;
  let stretch = 0;
  let wobble = 0;
  let wobbleVel = 0;
  let pressT0 = -10;
  let lastMove = -10;
  let pointerActive = false;
  let idleT = Math.random() * 100;
  const ripples = [];
  const rippleData = new Float32Array(8 * 4);
  const toGl = (event) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / Math.max(rect.width, 1);
    const sy = canvas.height / Math.max(rect.height, 1);
    return [(event.clientX - rect.left) * sx, (rect.bottom - event.clientY) * sy];
  };
  const nowSeconds = () => performance.now() / 1e3;
  const onMove = (event) => {
    const [x, y] = toGl(event);
    tx = x;
    ty = y;
    pointerActive = true;
    lastMove = nowSeconds();
  };
  const onDown = (event) => {
    const [x, y] = toGl(event);
    tx = x;
    ty = y;
    pointerActive = true;
    lastMove = nowSeconds();
    pressT0 = lastMove;
    ripples.push({ x, y, t0: lastMove, amp: 1 });
    if (ripples.length > 8) ripples.shift();
  };
  const onLeave = () => {
    pointerActive = false;
  };
  const surface = canvas.parentElement ?? document.body;
  surface.addEventListener("pointermove", onMove, { passive: true });
  surface.addEventListener("pointerdown", onDown, { passive: true });
  surface.addEventListener("pointerleave", onLeave, { passive: true });
  let raf = 0;
  let firstFrame = true;
  let now = nowSeconds();
  const startedAt = now;
  let prev = now;
  const frame = () => {
    now = nowSeconds();
    const dt = Math.min(Math.max(now - prev, 1e-3), 0.05);
    prev = now;
    const time = now - startedAt;
    const idle = !pointerActive || now - lastMove > 2.6;
    if (idle) {
      idleT += dt;
      tx = canvas.width * (0.5 + 0.24 * Math.sin(idleT * 0.43));
      ty = canvas.height * (0.52 + 0.16 * Math.sin(idleT * 0.61 + 1.3));
    }
    vx += (tx - px) * 130 * dt;
    vy += (ty - py) * 130 * dt;
    const damp = Math.exp(-14 * dt);
    vx *= damp;
    vy *= damp;
    px += vx * dt;
    py += vy * dt;
    const speed = Math.hypot(vx, vy);
    if (speed > 1) {
      dirX = vx / speed;
      dirY = vy / speed;
    }
    const stretchTarget = Math.min(speed / 4500, 0.42);
    stretch += (stretchTarget - stretch) * (1 - Math.exp(-12 * dt));
    const wobbleTarget = Math.min(speed / 2200, 1);
    wobbleVel += (wobbleTarget - wobble) * 40 * dt;
    wobbleVel *= Math.exp(-4.2 * dt);
    wobble += wobbleVel * dt;
    wobble = Math.max(0, Math.min(wobble, 1.2));
    const pressAge = now - pressT0;
    const press = pressAge < 1.2 ? 1 - 0.16 * Math.exp(-pressAge * 9) * Math.cos(pressAge * 16) : 1;
    for (let i = ripples.length - 1; i >= 0; i--) {
      if (now - ripples[i].t0 > 3) ripples.splice(i, 1);
    }
    ripples.forEach((ripple, i) => {
      rippleData[i * 4] = ripple.x;
      rippleData[i * 4 + 1] = ripple.y;
      rippleData[i * 4 + 2] = now - ripple.t0;
      rippleData[i * 4 + 3] = ripple.amp;
    });
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uDpr, dpr);
    gl.uniform4f(uLens, px, py, options.lensRadius * dpr, press);
    gl.uniform4f(uMotion, dirX, dirY, stretch, wobble);
    gl.uniform1i(uRippleCount, ripples.length);
    gl.uniform4fv(uRipples, rippleData);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (firstFrame) {
      firstFrame = false;
      options.onFirstFrame();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    window.clearTimeout(resizeTimer);
    resizeObserver.disconnect();
    document.fonts.removeEventListener("loadingdone", repaint);
    surface.removeEventListener("pointermove", onMove);
    surface.removeEventListener("pointerdown", onDown);
    surface.removeEventListener("pointerleave", onLeave);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    gl.deleteVertexArray(vao);
  };
}
function LiquidGlassLens({
  imageSrc,
  title,
  subtitle,
  textColor = DEFAULT_TEXT_COLOR,
  textAlign = "left",
  config,
  className
}) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const lensRadius = (config == null ? void 0 : config.lensRadius) ?? DEFAULT_CONFIG.lensRadius;
  const magnification = (config == null ? void 0 : config.magnification) ?? DEFAULT_CONFIG.magnification;
  const refraction = (config == null ? void 0 : config.refraction) ?? DEFAULT_CONFIG.refraction;
  const frost = (config == null ? void 0 : config.frost) ?? DEFAULT_CONFIG.frost;
  useEffect(() => {
    var _a;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let stop = null;
    const heroImage = (_a = canvas.parentElement) == null ? void 0 : _a.querySelector("img");
    const image = new window.Image();
    image.decoding = "async";
    const start = () => {
      if (disposed || stop) return;
      if (!image.complete || image.naturalWidth === 0) return;
      stop = initLens(canvas, image, {
        title,
        subtitle,
        textColor,
        textAlign,
        lensRadius,
        magnification,
        refraction,
        frost,
        onFirstFrame: () => setReady(true)
      });
    };
    image.addEventListener("load", start);
    image.src = (heroImage == null ? void 0 : heroImage.currentSrc) || imageSrc;
    if (image.complete) start();
    return () => {
      disposed = true;
      image.removeEventListener("load", start);
      stop == null ? void 0 : stop();
    };
  }, [imageSrc, title, subtitle, textColor, textAlign, lensRadius, magnification, refraction, frost]);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      "aria-hidden": "true",
      className: `absolute inset-0 h-full w-full pointer-events-none${className ? ` ${className}` : ""}`,
      style: { zIndex: 10, opacity: ready ? 1 : 0, transition: "opacity 700ms ease-out" }
    }
  );
}
export {
  LiquidGlassLens,
  LiquidGlassLens as default
};
