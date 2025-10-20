// Hàm này co giãn (scale) một phần tử sao cho vừa chiều rộng phần tử cha
// - el: phần tử cần co giãn
// - padding: phần đệm (nếu có) để trừ ra khi tính toán tỉ lệ
// Ghi chú: sử dụng anime.set(...) từ thư viện anime.js (phải được nạp toàn cục)
function fitElementToParent(el, padding) {
    var timeout = null;
    function resize() {
      if (timeout) clearTimeout(timeout);
      anime.set(el, {scale: 1});
      var pad = padding || 0;
      var parentEl = el.parentNode;
      var elOffsetWidth = el.offsetWidth - pad;
      var parentOffsetWidth = parentEl.offsetWidth;
      var ratio = parentOffsetWidth / elOffsetWidth;
      timeout = setTimeout(anime.set(el, {scale: ratio}), 10);
    }
    resize();
    window.addEventListener('resize', resize);
  }
  
  var layeredAnimation = (function() {
  // Khối IIFE cho hoạt ảnh nhiều lớp (layered)
  // Tìm các phần tử dùng để hiển thị tiến trình biến đổi và container chính
    var transformEls = document.querySelectorAll('.transform-progress');
    var layeredAnimationEl = document.querySelector('.layered-animations');
    // Mỗi ".shape" là một nhóm SVG có thể chứa circle/rect/polygon
    var shapeEls = layeredAnimationEl.querySelectorAll('.shape');
    var triangleEl = layeredAnimationEl.querySelector('polygon');
    // Lấy danh sách toạ độ điểm của polygon ban đầu để dùng làm mẫu khi scale
    var trianglePoints = triangleEl.getAttribute('points').split(' ');
    // Danh sách easing để random cho mỗi lần hoạt ảnh
    var easings = ['easeInOutQuad', 'easeInOutCirc', 'easeInOutSine', 'spring'];
  
    // Đảm bảo container SVG được scale vừa với phần tử cha
    fitElementToParent(layeredAnimationEl);
  
    // Tạo mảng keyframes gồm 30 khung, giá trị lấy từ hàm hoặc giá trị cố định
    function createKeyframes(value) {
      var keyframes = [];
      for (var i = 0; i < 30; i++) keyframes.push({ value: value });
      return keyframes;
    }
  
    // Hàm hoạt ảnh cho từng shape: tịnh tiến, xoay, và thay đổi hình dạng con (circle/rect/polygon)
    function animateShape(el) {
  
      var circleEl = el.querySelector('circle');
      var rectEl = el.querySelector('rect');
      var polyEl = el.querySelector('polygon');
  
      // Tạo timeline và tự gọi lại sau khi hoàn tất để loop vô hạn
      var animation = anime.timeline({
        targets: el,
        duration: function() { return anime.random(600, 2200); },
        easing: function() { return easings[anime.random(0, easings.length - 1)]; },
        complete: function(anim) { animateShape(anim.animatables[0].target); },
      })
      .add({
        // Di chuyển theo X/Y ngẫu nhiên, biên độ phụ thuộc việc shape có class 'large' hay không
        translateX: createKeyframes(function(el) { 
          return el.classList.contains('large') ? anime.random(-300, 300) : anime.random(-520, 520);
        }),
        translateY: createKeyframes(function(el) { 
          return el.classList.contains('large') ? anime.random(-110, 110) : anime.random(-280, 280);
        }),
        // Xoay ngẫu nhiên từ -180 đến 180 độ
        rotate: createKeyframes(function() { return anime.random(-180, 180); }),
      }, 0);
      if (circleEl) {
        animation.add({
          targets: circleEl,
          // Thay đổi bán kính hình tròn ngẫu nhiên
          r: createKeyframes(function() { return anime.random(32, 72); }),
        }, 0);
      }
      if (rectEl) {
        animation.add({
          targets: rectEl,
          // Thay đổi kích thước hình chữ nhật ngẫu nhiên
          width: createKeyframes(function() { return anime.random(64, 120); }),
          height: createKeyframes(function() { return anime.random(64, 120); }),
        }, 0);
      }
      if (polyEl) {
        animation.add({
          targets: polyEl,
          // Scale các điểm của polygon dựa trên điểm mẫu ban đầu
          points: createKeyframes(function() { 
            var scale = anime.random(72, 180) / 100;
            return trianglePoints.map(function(p) { return p * scale; }).join(' ');
          }),
        }, 0);
      }
  
    }
  
    // Khởi tạo hoạt ảnh cho tất cả các shape
    for (var i = 0; i < shapeEls.length; i++) {
      animateShape(shapeEls[i]);
    }
  
  })();