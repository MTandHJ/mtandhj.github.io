// --- 评论区 reflow ---

function setupCommentReflow() {
  scheduleRevealLayout();
  var pc = document.querySelector('.post-comment');
  if (pc && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(scheduleRevealLayout).observe(pc);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCommentReflow);
} else {
  setupCommentReflow();
}
window.addEventListener('load', function () {
  scheduleRevealLayout();
  setTimeout(scheduleRevealLayout, 400);
});

// --- 全屏与激光笔 ---

var revealElement = document.querySelector('.reveal');
var fullscreenBtn = document.getElementById('fullscreen-btn');
var laserBtn = document.getElementById('laser-btn');
var laserPointer = document.querySelector('.laser-pointer');

var isFullscreen = false;
var isLaserActive = false;

function isInPresenterView() {
  return window.location.search.includes('receiver');
}

function isInPresentationView() {
  return !isInPresenterView() && window.opener;
}

function isInMainView() {
  return !isInPresenterView() && !window.opener;
}

var LASER_KEY = 'reveal_laser_pointer_position';
var LASER_ACTIVE_KEY = 'reveal_laser_active_state';

function updateLaserPosition(x, y, isVisible) {
  var positionData = {
    x: x,
    y: y,
    isVisible: isVisible,
    timestamp: Date.now()
  };

  localStorage.setItem(LASER_KEY, JSON.stringify(positionData));

  if (isInPresenterView()) {
    var event = new Event('storage');
    event.key = LASER_KEY;
    event.newValue = JSON.stringify(positionData);
    window.dispatchEvent(event);
  }
}

function syncLaserActiveState(active) {
  localStorage.setItem(LASER_ACTIVE_KEY, active ? 'true' : 'false');

  if (isInPresenterView()) {
    var event = new Event('storage');
    event.key = LASER_ACTIVE_KEY;
    event.newValue = active ? 'true' : 'false';
    window.dispatchEvent(event);
  }
}

function hideLaser() {
  requestAnimationFrame(function () {
    laserPointer.style.display = 'none';
    laserPointer.style.left = '-9999px';
    laserPointer.style.top = '-9999px';
  });

  if (isInPresenterView()) {
    updateLaserPosition(0, 0, false);
  }
}

function toggleLaser(activate) {
  isLaserActive = activate;

  if (isLaserActive) {
    document.body.classList.add('cursor-hidden');
    laserBtn.classList.add('active');
  } else {
    document.body.classList.remove('cursor-hidden');
    hideLaser();
    laserBtn.classList.remove('active');
  }

  syncLaserActiveState(isLaserActive);
}

function cleanupLaserPointer() {
  toggleLaser(false);
  isFullscreen = false;
  document.body.classList.remove('is-fullscreen');
  revealElement.classList.remove('fullscreen');
  laserBtn.style.display = 'none';
  hideLaser();
}

fullscreenBtn.addEventListener('click', function() {
  isFullscreen = !isFullscreen;
  document.body.classList.toggle('is-fullscreen', isFullscreen);
  revealElement.classList.toggle('fullscreen', isFullscreen);

  if (isFullscreen) {
    document.documentElement.requestFullscreen();
    laserBtn.style.display = 'flex';
    scheduleRevealLayout();
  } else {
    cleanupLaserPointer();
  }
});

document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    cleanupLaserPointer();
    scheduleRevealLayout();
  }
});

laserBtn.addEventListener('click', function() {
  toggleLaser(!isLaserActive);
});

window.addEventListener('storage', function(e) {
  if (e.key === LASER_KEY && (isInMainView() || isInPresentationView())) {
    try {
      var data = JSON.parse(e.newValue);
      var revealRect = revealElement.getBoundingClientRect();

      if (data.isVisible && isLaserActive) {
        var absX = data.x * revealRect.width + revealRect.left;
        var absY = data.y * revealRect.height + revealRect.top;

        requestAnimationFrame(function () {
          laserPointer.style.display = 'block';
          laserPointer.style.left = (absX - 4) + 'px';
          laserPointer.style.top = (absY - 4) + 'px';
        });
      } else {
        requestAnimationFrame(function () {
          laserPointer.style.display = 'none';
          laserPointer.style.left = '-9999px';
          laserPointer.style.top = '-9999px';
        });
      }
    } catch (err) {
      console.error('解析激光笔数据失败', err);
      requestAnimationFrame(function () {
        laserPointer.style.display = 'none';
        laserPointer.style.left = '-9999px';
        laserPointer.style.top = '-9999px';
      });
    }
  }

  if (e.key === LASER_ACTIVE_KEY && (isInMainView() || isInPresentationView())) {
    var active = e.newValue === 'true';
    isLaserActive = active;

    if (active) {
      laserBtn.classList.add('active');
      document.body.classList.add('cursor-hidden');
    } else {
      laserBtn.classList.remove('active');
      document.body.classList.remove('cursor-hidden');
      hideLaser();
    }
  }
});

document.addEventListener('mousemove', function(e) {
  if (isLaserActive) {
    var revealRect = revealElement.getBoundingClientRect();
    var isInsideReveal = (
      e.clientX >= revealRect.left &&
      e.clientX <= revealRect.right &&
      e.clientY >= revealRect.top &&
      e.clientY <= revealRect.bottom
    );

    if (isInsideReveal) {
      var relX = (e.clientX - revealRect.left) / revealRect.width;
      var relY = (e.clientY - revealRect.top) / revealRect.height;

      requestAnimationFrame(function () {
        laserPointer.style.display = 'block';
        laserPointer.style.left = (e.clientX - 4) + 'px';
        laserPointer.style.top = (e.clientY - 4) + 'px';
      });

      if (isInPresenterView()) {
        updateLaserPosition(relX, relY, true);
      }
    } else {
      requestAnimationFrame(function () {
        laserPointer.style.display = 'none';
        laserPointer.style.left = '-9999px';
        laserPointer.style.top = '-9999px';
      });

      if (isInPresenterView()) {
        updateLaserPosition(0, 0, false);
      }
    }
  } else {
    requestAnimationFrame(function () {
      laserPointer.style.display = 'none';
      laserPointer.style.left = '-9999px';
      laserPointer.style.top = '-9999px';
    });
  }
});

document.addEventListener('mouseleave', function() {
  if (isLaserActive) {
    hideLaser();
  }
});

document.addEventListener('mouseenter', function(e) {
  if (isLaserActive) {
    var revealRect = revealElement.getBoundingClientRect();
    var isInsideReveal = (
      e.clientX >= revealRect.left &&
      e.clientX <= revealRect.right &&
      e.clientY >= revealRect.top &&
      e.clientY <= revealRect.bottom
    );

    if (isInsideReveal && isInPresenterView()) {
      var relX = (e.clientX - revealRect.left) / revealRect.width;
      var relY = (e.clientY - revealRect.top) / revealRect.height;
      updateLaserPosition(relX, relY, true);
    }
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (isInPresenterView()) {
      if (isFullscreen || document.fullscreenElement) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        isFullscreen = false;
        document.body.classList.remove('is-fullscreen');
        revealElement.classList.remove('fullscreen');
        laserBtn.style.display = 'none';
        scheduleRevealLayout();
      }
    } else {
      cleanupLaserPointer();
    }
  }

  if (
    e.key.toLowerCase() === 'o' &&
    (e.altKey || e.ctrlKey || e.metaKey)
  ) {
    e.preventDefault();
    toggleLaser(!isLaserActive);
  }
});

window.addEventListener('load', function() {
  if (isInPresenterView()) {
    laserBtn.style.display = 'none';
    fullscreenBtn.style.display = 'none';
  }

  if (isInPresentationView() || isInMainView()) {
    var laserActiveState = localStorage.getItem(LASER_ACTIVE_KEY);
    if (laserActiveState === 'true') {
      isLaserActive = true;
      laserBtn.classList.add('active');
      document.body.classList.add('cursor-hidden');
    } else {
      requestAnimationFrame(function () {
        laserPointer.style.display = 'none';
        laserPointer.style.left = '-9999px';
        laserPointer.style.top = '-9999px';
      });
    }

    var storedPosition = localStorage.getItem(LASER_KEY);
    if (storedPosition) {
      try {
        var data = JSON.parse(storedPosition);
        if (Date.now() - data.timestamp < 10000 && data.isVisible && isLaserActive) {
          var revealRect = revealElement.getBoundingClientRect();
          var absX = data.x * revealRect.width + revealRect.left;
          var absY = data.y * revealRect.height + revealRect.top;

          requestAnimationFrame(function () {
            laserPointer.style.display = 'block';
            laserPointer.style.left = (absX - 4) + 'px';
            laserPointer.style.top = (absY - 4) + 'px';
          });
        } else {
          requestAnimationFrame(function () {
            laserPointer.style.display = 'none';
            laserPointer.style.left = '-9999px';
            laserPointer.style.top = '-9999px';
          });
        }
      } catch (err) {
        console.error('解析存储的激光笔位置失败', err);
        requestAnimationFrame(function () {
          laserPointer.style.display = 'none';
          laserPointer.style.left = '-9999px';
          laserPointer.style.top = '-9999px';
        });
      }
    }
  }
});

window.addEventListener('beforeunload', function() {
  if (isInPresenterView()) {
    localStorage.removeItem('reveal_auto_fullscreen');
    localStorage.removeItem('reveal_auto_fullscreen_timestamp');
  }
});

var resizeT;
window.addEventListener('resize', function () {
  clearTimeout(resizeT);
  resizeT = setTimeout(function () {
    if (!isFullscreen) cleanupLaserPointer();
    scheduleRevealLayout();
  }, 100);
});

window.addEventListener('blur', function() {
  if (isLaserActive) {
    hideLaser();
  }
});

document.addEventListener('visibilitychange', function() {
  if (document.hidden && isLaserActive) {
    hideLaser();
  }
});
