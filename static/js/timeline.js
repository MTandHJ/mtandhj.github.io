document.addEventListener('DOMContentLoaded', function() {
  var paperLinks = document.querySelectorAll('.paper-link[data-image-url]');
  if (!paperLinks.length) return;

  paperLinks.forEach(function(link) {
    var imageUrl = link.getAttribute('data-image-url');
    if (!imageUrl) return;

    // 预加载图片以获取尺寸信息
    var preloadImg = new Image();
    var preloadedSize = null;

    preloadImg.onload = function() {
      preloadedSize = {
        width: this.naturalWidth,
        height: this.naturalHeight
      };
    };
    preloadImg.src = imageUrl;

    // 创建工具提示元素
    var tooltip = document.createElement('div');
    tooltip.className = 'timeline-tooltip';
    tooltip.innerHTML = '<img src="' + imageUrl + '" alt="缩略图" loading="lazy">';
    document.body.appendChild(tooltip);

    var hideTimeout;
    var currentEvent = null;

    // 图片加载完成后重新计算缩放
    var img = tooltip.querySelector('img');
    img.addEventListener('load', function() {
      if (currentEvent) {
        positionTooltip(tooltip, currentEvent, preloadedSize);
      }
    });

    link.addEventListener('mouseenter', function(e) {
      clearTimeout(hideTimeout);
      currentEvent = e;
      tooltip.style.display = 'block';
      requestAnimationFrame(function() {
        tooltip.classList.add('show');
      });
      positionTooltip(tooltip, e, preloadedSize);
    });

    link.addEventListener('mousemove', function(e) {
      currentEvent = e;
      positionTooltip(tooltip, e, preloadedSize);
    });

    link.addEventListener('mouseleave', function() {
      currentEvent = null;
      tooltip.classList.remove('show');
      hideTimeout = setTimeout(function() {
        tooltip.style.display = 'none';
      }, 200);
    });
  });

  function positionTooltip(tooltip, event, preloadedSize) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var img = tooltip.querySelector('img');
    if (img) {
      resizeImageToFit(img, windowWidth, event.clientX, preloadedSize);
    }

    var rect = tooltip.getBoundingClientRect();

    var left = event.clientX + 10;
    var top = event.clientY - rect.height / 2;

    if (left + rect.width > windowWidth - 20) {
      left = windowWidth - rect.width - 20;
    }
    if (top < 20) {
      top = 20;
    }
    if (top + rect.height > windowHeight - 20) {
      top = windowHeight - rect.height - 20;
    }
    if (left < event.clientX + 10) {
      left = event.clientX + 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  function resizeImageToFit(img, windowWidth, mouseX, preloadedSize) {
    var availableWidth = windowWidth - mouseX - 30;
    var maxWidth = Math.min(availableWidth, windowWidth * 0.4);

    var originalWidth = img.naturalWidth;
    var originalHeight = img.naturalHeight;

    if ((!originalWidth || !originalHeight) && preloadedSize) {
      originalWidth = preloadedSize.width;
      originalHeight = preloadedSize.height;
    } else if (!originalWidth || !originalHeight) {
      originalWidth = 400;
      originalHeight = 300;
    }

    if (originalWidth > maxWidth) {
      var scale = maxWidth / originalWidth;
      img.style.width = maxWidth + 'px';
      img.style.height = (originalHeight * scale) + 'px';
    } else {
      img.style.width = 'auto';
      img.style.height = 'auto';
    }
  }
});
