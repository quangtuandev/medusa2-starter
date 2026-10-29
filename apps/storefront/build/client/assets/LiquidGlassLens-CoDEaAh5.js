import{r as te,j as we}from"./chunk-62JRHF6Z-VVcf33bZ.js";const xe=`#version 300 es
layout(location = 0) in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,Ee=`#version 300 es
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
}`,Y={lensRadius:150,magnification:1.25,refraction:1,frost:.35},Le="#FFFFFF",de='-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif',j=(t,l,o)=>Math.min(Math.max(t,l),o);function be(t){const l=(n,a)=>{const i=t.createShader(n);return i?(t.shaderSource(i,a),t.compileShader(i),t.getShaderParameter(i,t.COMPILE_STATUS)?i:(console.warn("LiquidGlassLens shader error:",t.getShaderInfoLog(i)),t.deleteShader(i),null)):null},o=l(t.VERTEX_SHADER,xe),e=l(t.FRAGMENT_SHADER,Ee);if(!o||!e)return o&&t.deleteShader(o),e&&t.deleteShader(e),null;const r=t.createProgram();return r?(t.attachShader(r,o),t.attachShader(r,e),t.linkProgram(r),t.deleteShader(o),t.deleteShader(e),t.getProgramParameter(r,t.LINK_STATUS)?r:(console.warn("LiquidGlassLens link error:",t.getProgramInfoLog(r)),t.deleteProgram(r),null)):(t.deleteShader(o),t.deleteShader(e),null)}function Ae(t,l,o){const e=[];for(const r of l.split(`
`)){let n="";for(const a of r.split(/\s+/).filter(Boolean)){const i=n?`${n} ${a}`:a;n&&t.measureText(i).width>o?(e.push(n),n=a):n=i}n&&e.push(n)}return e.length>0?e:[l]}function me(t,l,o){if(!t)return null;const e=Array.from(t.querySelectorAll(l)),r=o==null?void 0:o.trim().toLowerCase();if(r){const n=e.find(a=>{var i;return((i=a.textContent)==null?void 0:i.trim().toLowerCase())===r});if(n)return n}return e[0]??null}function pe(t,l,o,e){if(!o||!e)return null;const r=o.getBoundingClientRect();if(r.width<1||r.height<1)return null;const n=window.getComputedStyle(o),a=Number.parseFloat(n.fontSize),i=n.lineHeight==="normal"?a*1.2:Number.parseFloat(n.lineHeight);if(!Number.isFinite(a)||a<=0||!Number.isFinite(i)||r.height>i*1.6)return null;t.save(),t.font=`${n.fontStyle} ${n.fontWeight} ${n.fontSize} ${n.fontFamily}`,t.letterSpacing=n.letterSpacing==="normal"?"0px":n.letterSpacing;const L=t.font,b=t.letterSpacing,m=t.measureText(e);t.restore();const p=Number.isFinite(m.fontBoundingBoxAscent)?m.fontBoundingBoxAscent:a*.8,h=Number.isFinite(m.fontBoundingBoxDescent)?m.fontBoundingBoxDescent:a*.2,u=l.getBoundingClientRect(),c=n.textAlign==="center";return{x:c?r.left-u.left+r.width/2:r.left-u.left,baseline:r.top-u.top+(i-(p+h))/2+p,align:c?"center":"left",font:L,letterSpacing:b,color:n.color}}function he(t,l,o){t.save(),t.font=l.font,t.letterSpacing=l.letterSpacing,t.fillStyle=l.color,t.textAlign=l.align,t.textBaseline="alphabetic",t.fillText(o,l.x,l.baseline),t.restore()}function Me(t,l,o,e,r,n,a){var z,C,U,N;t.setTransform(n,0,0,n,0,0),t.clearRect(0,0,e,r);const i=Math.max(e/o.naturalWidth,r/o.naturalHeight),L=o.naturalWidth*i,b=o.naturalHeight*i;t.drawImage(o,(e-L)/2,(r-b)/2,L,b);const m=l.parentElement,p=me(m,"h1",a.title),h=me(m,"p",a.subtitle),u=(((z=a.title)==null?void 0:z.trim())||((C=p==null?void 0:p.textContent)==null?void 0:C.trim())||"").toUpperCase(),c=((U=a.subtitle)==null?void 0:U.trim())||((N=h==null?void 0:h.textContent)==null?void 0:N.trim())||"",M=u?pe(t,l,p,u):null,v=c?pe(t,l,h,c):null,w=a.textAlign==="center",d=j(e*.06,24,96),g=j(r*.09,24,96),S=j(r*.021,14,30),x=j(r*.085,40,130),D=w?e/2:d;if(u)if(M)he(t,M,u);else{t.save(),t.fillStyle=a.textColor,t.textAlign=w?"center":"left",t.textBaseline="alphabetic",t.font=`700 ${x}px ${de}`,t.letterSpacing="-0.03em";const y=Ae(t,u,Math.max(e-d*2,1)),P=r-g-(c?S*1.85:0);y.forEach((F,_)=>{t.fillText(F,D,P-(y.length-1-_)*x)}),t.restore()}c&&(v?he(t,v,c):(t.save(),t.fillStyle=a.textColor,t.textAlign=w?"center":"left",t.textBaseline="alphabetic",t.font=`300 ${S}px ${de}`,t.letterSpacing="0.02em",t.fillText(c,D,r-g),t.restore()))}function Se(t,l,o){const e=t.getContext("webgl2",{alpha:!0,premultipliedAlpha:!1,antialias:!0});if(!e)return()=>{};const r=be(e);if(!r)return()=>{};const n=e.createBuffer(),a=e.createVertexArray(),i=e.createTexture();if(!n||!a||!i)return e.deleteBuffer(n),e.deleteVertexArray(a),e.deleteTexture(i),e.deleteProgram(r),()=>{};e.useProgram(r),e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const L=e.getUniformLocation(r,"uTex"),b=e.getUniformLocation(r,"uRes"),m=e.getUniformLocation(r,"uTime"),p=e.getUniformLocation(r,"uDpr"),h=e.getUniformLocation(r,"uLens"),u=e.getUniformLocation(r,"uMotion"),c=e.getUniformLocation(r,"uMag"),M=e.getUniformLocation(r,"uRefract"),v=e.getUniformLocation(r,"uFrost"),w=e.getUniformLocation(r,"uRippleCount"),d=e.getUniformLocation(r,"uRipples[0]");e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.uniform1i(L,0),e.uniform1f(c,o.magnification),e.uniform1f(M,o.refraction),e.uniform1f(v,o.frost);const g=document.createElement("canvas"),S=e.getParameter(e.MAX_TEXTURE_SIZE);let x=1;const D=()=>{const s=t.getBoundingClientRect();if(s.width<1||s.height<1)return;x=Math.min(window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(s.width*x)),t.height=Math.max(1,Math.round(s.height*x)),e.viewport(0,0,t.width,t.height);const f=Math.min(x,S/Math.max(s.width,s.height));g.width=Math.max(1,Math.round(s.width*f)),g.height=Math.max(1,Math.round(s.height*f));const R=g.getContext("2d");R&&(Me(R,t,l,s.width,s.height,f,o),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,g),e.generateMipmap(e.TEXTURE_2D))};D();let z=!1;const C=()=>{z||D()};document.fonts.ready.then(C).catch(()=>{}),document.fonts.addEventListener("loadingdone",C);let U=0;const N=new ResizeObserver(()=>{window.clearTimeout(U),U=window.setTimeout(D,150)});N.observe(t.parentElement??t);let y=t.width/2,P=t.height/2,F=0,_=0,O=y,$=P,re=0,ne=1,K=0,I=0,Z=0,oe=-10,X=-10,H=!1,J=Math.random()*100;const A=[],q=new Float32Array(8*4),ae=s=>{const f=t.getBoundingClientRect(),R=t.width/Math.max(f.width,1),W=t.height/Math.max(f.height,1);return[(s.clientX-f.left)*R,(f.bottom-s.clientY)*W]},k=()=>performance.now()/1e3,ie=s=>{const[f,R]=ae(s);O=f,$=R,H=!0,X=k()},se=s=>{const[f,R]=ae(s);O=f,$=R,H=!0,X=k(),oe=X,A.push({x:f,y:R,t0:X,amp:1}),A.length>8&&A.shift()},le=()=>{H=!1},B=t.parentElement??document.body;B.addEventListener("pointermove",ie,{passive:!0}),B.addEventListener("pointerdown",se,{passive:!0}),B.addEventListener("pointerleave",le,{passive:!0});let Q=0,ce=!0,T=k();const ge=T;let fe=T;const ue=()=>{T=k();const s=Math.min(Math.max(T-fe,.001),.05);fe=T;const f=T-ge;(!H||T-X>2.6)&&(J+=s,O=t.width*(.5+.24*Math.sin(J*.43)),$=t.height*(.52+.16*Math.sin(J*.61+1.3))),F+=(O-y)*130*s,_+=($-P)*130*s;const W=Math.exp(-14*s);F*=W,_*=W,y+=F*s,P+=_*s;const G=Math.hypot(F,_);G>1&&(re=F/G,ne=_/G);const ve=Math.min(G/4500,.42);K+=(ve-K)*(1-Math.exp(-12*s));const Te=Math.min(G/2200,1);Z+=(Te-I)*40*s,Z*=Math.exp(-4.2*s),I+=Z*s,I=Math.max(0,Math.min(I,1.2));const ee=T-oe,Re=ee<1.2?1-.16*Math.exp(-ee*9)*Math.cos(ee*16):1;for(let E=A.length-1;E>=0;E--)T-A[E].t0>3&&A.splice(E,1);A.forEach((E,V)=>{q[V*4]=E.x,q[V*4+1]=E.y,q[V*4+2]=T-E.t0,q[V*4+3]=E.amp}),e.uniform2f(b,t.width,t.height),e.uniform1f(m,f),e.uniform1f(p,x),e.uniform4f(h,y,P,o.lensRadius*x,Re),e.uniform4f(u,re,ne,K,I),e.uniform1i(w,A.length),e.uniform4fv(d,q),e.drawArrays(e.TRIANGLES,0,3),ce&&(ce=!1,o.onFirstFrame()),Q=requestAnimationFrame(ue)};return Q=requestAnimationFrame(ue),()=>{z=!0,cancelAnimationFrame(Q),window.clearTimeout(U),N.disconnect(),document.fonts.removeEventListener("loadingdone",C),B.removeEventListener("pointermove",ie),B.removeEventListener("pointerdown",se),B.removeEventListener("pointerleave",le),e.deleteTexture(i),e.deleteProgram(r),e.deleteBuffer(n),e.deleteVertexArray(a)}}function Fe({imageSrc:t,title:l,subtitle:o,textColor:e=Le,textAlign:r="left",config:n,className:a}){const i=te.useRef(null),[L,b]=te.useState(!1),m=(n==null?void 0:n.lensRadius)??Y.lensRadius,p=(n==null?void 0:n.magnification)??Y.magnification,h=(n==null?void 0:n.refraction)??Y.refraction,u=(n==null?void 0:n.frost)??Y.frost;return te.useEffect(()=>{var S;const c=i.current;if(!c||!window.matchMedia("(hover: hover) and (pointer: fine)").matches||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let M=!1,v=null;const w=(S=c.parentElement)==null?void 0:S.querySelector("img"),d=new window.Image;d.decoding="async";const g=()=>{M||v||!d.complete||d.naturalWidth===0||(v=Se(c,d,{title:l,subtitle:o,textColor:e,textAlign:r,lensRadius:m,magnification:p,refraction:h,frost:u,onFirstFrame:()=>b(!0)}))};return d.addEventListener("load",g),d.src=(w==null?void 0:w.currentSrc)||t,d.complete&&g(),()=>{M=!0,d.removeEventListener("load",g),v==null||v()}},[t,l,o,e,r,m,p,h,u]),we.jsx("canvas",{ref:i,"aria-hidden":"true",className:`absolute inset-0 h-full w-full pointer-events-none${a?` ${a}`:""}`,style:{zIndex:10,opacity:L?1:0,transition:"opacity 700ms ease-out"}})}export{Fe as LiquidGlassLens,Fe as default};
