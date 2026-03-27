document.addEventListener('DOMContentLoaded', function() {
  const todoLinks = document.querySelectorAll('.todo-link[data-image-url]');

  todoLinks.forEach(link => {
    const imageUrl = link.getAttribute('data-image-url');
    if (!imageUrl) return;

    // 预加载图片以获取尺寸信息
    const preloadImg = new Image();
    let preloadedSize = null;

    preloadImg.onload = function() {
      preloadedSize = {
        width: this.naturalWidth,
        height: this.naturalHeight
      };
    };
    preloadImg.src = imageUrl;

    // 创建工具提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'timeline-tooltip';
    tooltip.innerHTML = '<img src="' + imageUrl.replace(/"/g, '&quot;') + '" alt="缩略图" loading="lazy">';
    document.body.appendChild(tooltip);

    let hideTimeout;
    let currentEvent = null;

    // 图片加载完成后重新计算位置
    const img = tooltip.querySelector('img');
    img.addEventListener('load', function() {
      if (currentEvent) {
        positionTooltip(tooltip, currentEvent, preloadedSize);
      }
    });

    link.addEventListener('mouseenter', function(e) {
      clearTimeout(hideTimeout);
      currentEvent = e;
      tooltip.style.display = 'block';
      requestAnimationFrame(() => { tooltip.classList.add('show'); });
      positionTooltip(tooltip, e, preloadedSize);
    });

    link.addEventListener('mousemove', function(e) {
      currentEvent = e;
      positionTooltip(tooltip, e, preloadedSize);
    });

    link.addEventListener('mouseleave', function() {
      currentEvent = null;
      tooltip.classList.remove('show');
      hideTimeout = setTimeout(() => { tooltip.style.display = 'none'; }, 200);
    });
  });

  function positionTooltip(tooltip, event, preloadedSize) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const img = tooltip.querySelector('img');
    if (img) {
      const availableWidth = windowWidth - event.clientX - 30;
      const maxWidth = Math.min(availableWidth, windowWidth * 0.4);
      let originalWidth = img.naturalWidth || (preloadedSize && preloadedSize.width) || 400;
      let originalHeight = img.naturalHeight || (preloadedSize && preloadedSize.height) || 300;

      if (originalWidth > maxWidth) {
        const scale = maxWidth / originalWidth;
        img.style.width = maxWidth + 'px';
        img.style.height = (originalHeight * scale) + 'px';
      } else {
        img.style.width = 'auto';
        img.style.height = 'auto';
      }
    }

    const rect = tooltip.getBoundingClientRect();
    let left = event.clientX + 10;
    let top = event.clientY - rect.height / 2;

    if (left + rect.width > windowWidth - 20) {
      left = windowWidth - rect.width - 20;
    }
    if (top < 20) top = 20;
    if (top + rect.height > windowHeight - 20) {
      top = windowHeight - rect.height - 20;
    }
    if (left < event.clientX + 10) left = event.clientX + 10;

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
});
