document.addEventListener('DOMContentLoaded', function() {
  // 预加载CSS样式，避免等到DOM构建完成后才加载样式
  loadTimelineStyles();
  
  // 获取时间线数据并验证
  const timelineData = window.timelineData || [];
  const timelineContainer = document.getElementById('timeline');
  
  // 早期返回，避免不必要的处理
  if (!timelineData.length || !timelineContainer) return;

  try {
    // 使用Date对象缓存减少重复创建
    const dateCache = new Map();
    const defaultDate = new Date('1970-01-01');
    
    // 预处理和验证数据
    const processedData = timelineData.map(item => {
      // 确保所有必要项目都存在
      if (!item) return null;
      
      // 深拷贝以避免修改原始数据，但只复制需要的属性以提高性能
      const processedItem = {
        title: item.title || '',
        description: item.description || '',
        paperUrl: item.paperUrl || '#',
        importance: item.importance || '',
        date: item.date || '1970-01-01',
        imageUrl: item.imageUrl || ''
      };
      
      // 验证日期格式并解析
      if (!processedItem.date || !/^\d{4}-\d{2}-\d{2}/.test(processedItem.date)) {
        console.warn(`Timeline item has invalid date format: ${processedItem.title || 'Unnamed paper'}`);
        processedItem.date = '1970-01-01';
      }
      
      // 使用日期缓存
      if (!dateCache.has(processedItem.date)) {
        const dateObj = new Date(processedItem.date);
        if (isNaN(dateObj.getTime())) {
          console.warn(`Invalid date for timeline item: ${processedItem.title || 'Unnamed paper'}`);
          dateCache.set(processedItem.date, defaultDate);
        } else {
          dateCache.set(processedItem.date, dateObj);
        }
      }
      
      // 直接从缓存获取年份
      processedItem.year = dateCache.get(processedItem.date).getFullYear();
      return processedItem;
    }).filter(Boolean);
    
    // 如果处理后没有有效数据，提前返回
    if (!processedData.length) {
      timelineContainer.innerHTML = '<p>没有找到有效的时间线数据</p>';
      return;
    }

    // 预计算所有年份并排序，减少后续计算
    const years = [...new Set(processedData.map(item => item.year))];
    years.sort((a, b) => b - a); // 降序排列
    
    // 优化分组算法，一次遍历完成分组
    const itemsByYear = {};
    for (const item of processedData) {
      const year = item.year;
      if (!itemsByYear[year]) {
        itemsByYear[year] = [];
      }
      itemsByYear[year].push(item);
    }
    
    // 提前排序每个年份的条目，避免在createYearSection中重复排序
    for (const year of years) {
      if (itemsByYear[year] && itemsByYear[year].length > 1) {
        itemsByYear[year].sort((a, b) => {
          const dateA = dateCache.get(a.date);
          const dateB = dateCache.get(b.date);
          return dateB - dateA;
        });
      }
    }
    
    // 使用文档片段减少重排和重绘
    const fragmentContainer = document.createDocumentFragment();
    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'timeline-wrapper';
    
    // 一次性构建所有年份的HTML
    const yearSectionsHTML = [];
    for (const year of years) {
      if (itemsByYear[year] && itemsByYear[year].length > 0) {
        yearSectionsHTML.push(createYearSectionHTML(year, itemsByYear[year]));
      }
    }
    
    // 一次性设置HTML，减少DOM操作
    if (yearSectionsHTML.length > 0) {
      timelineWrapper.innerHTML = yearSectionsHTML.join('');
      fragmentContainer.appendChild(timelineWrapper);
      
      // 一次性更新DOM
      timelineContainer.appendChild(fragmentContainer);
      
      // 添加悬停事件监听器
      addHoverEventListeners();
    } else {
      timelineContainer.innerHTML = '<p>没有找到有效的时间线数据</p>';
    }
  } catch (error) {
    console.error('Error rendering timeline:', error);
    timelineContainer.innerHTML = '<p>加载时间线时出错。请刷新页面重试。</p>';
  }
  
  // 创建年份部分的HTML字符串
  function createYearSectionHTML(year, items) {
    if (!items || items.length === 0) return '';
    
    // 创建左侧年份标记HTML
    const timelineLeftHTML = `
      <div class="timeline-left">
        <div class="year-marker">
          <div class="year-point"></div>
          <h3 class="year-label">${sanitizeHTML(year.toString())}</h3>
        </div>
      </div>
    `;
    
    // 创建中间线HTML
    const timelineCenterHTML = '<div class="timeline-center"></div>';
    
    // 创建右侧内容区域HTML
    let paperItemsHTML = '';
    
    // 构建所有论文项目的HTML
    for (let i = 0; i < items.length; i++) {
      const itemHTML = createPaperItemHTML(items[i]);
      if (itemHTML) {
        paperItemsHTML += itemHTML;
      }
    }
    
    // 如果没有有效的论文项目，返回空字符串
    if (!paperItemsHTML) return '';
    
    const timelineRightHTML = `
      <div class="timeline-right">
        <div class="paper-items">
          ${paperItemsHTML}
        </div>
      </div>
    `;
    
    // 组合完整的年份区域HTML
    return `
      <div class="year-section">
        ${timelineLeftHTML}
        ${timelineCenterHTML}
        ${timelineRightHTML}
      </div>
    `;
  }
  
  // 创建论文项目的HTML字符串
  function createPaperItemHTML(item) {
    if (!item) return '';
    
    // 数据清理与防御性编程
    const paperTitle = (item.title || '').trim() || '未命名论文';
    const paperDesc = (item.description || '').trim() || '';
    const paperUrl = (item.paperUrl || '').trim() || '#';
    const imageUrl = (item.imageUrl || '').trim() || '';
    
    // 根据重要性级别添加不同的类名
    const importanceClass = getImportanceClass(item.importance);
    
    // 构建HTML字符串，添加data属性用于悬停事件
    return `
      <div class="paper-item">
        <div class="paper-title">
          <a href="${escapeHTML(paperUrl)}" target="_blank" rel="noopener" class="paper-link ${importanceClass}" ${imageUrl ? `data-image-url="${escapeHTML(imageUrl)}"` : ''}>${escapeHTML(paperTitle)}</a>
        </div>
        <div class="paper-description">${escapeHTML(paperDesc)}</div>
      </div>
    `;
  }
  
  // 添加悬停事件监听器
  function addHoverEventListeners() {
    const paperLinks = document.querySelectorAll('.paper-link[data-image-url]');
    
    paperLinks.forEach(link => {
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
      tooltip.innerHTML = `<img src="${escapeHTML(imageUrl)}" alt="缩略图" loading="lazy">`;
      document.body.appendChild(tooltip);
      
      let hideTimeout;
      let currentEvent = null;
      
      // 图片加载完成后重新计算缩放
      const img = tooltip.querySelector('img');
      img.addEventListener('load', function() {
        if (currentEvent) {
          positionTooltip(tooltip, currentEvent, preloadedSize);
        }
      });
      
      // 鼠标进入事件
      link.addEventListener('mouseenter', function(e) {
        clearTimeout(hideTimeout);
        currentEvent = e;
        tooltip.style.display = 'block';
        requestAnimationFrame(() => {
          tooltip.classList.add('show');
        });
        positionTooltip(tooltip, e, preloadedSize);
      });
      
      // 鼠标移动事件（更新位置）
      link.addEventListener('mousemove', function(e) {
        currentEvent = e;
        positionTooltip(tooltip, e, preloadedSize);
      });
      
      // 鼠标离开事件
      link.addEventListener('mouseleave', function() {
        currentEvent = null;
        tooltip.classList.remove('show');
        hideTimeout = setTimeout(() => {
          tooltip.style.display = 'none';
        }, 200);
      });
    });
  }
  
  // 定位工具提示
  function positionTooltip(tooltip, event, preloadedSize = null) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 先设置图片尺寸
    const img = tooltip.querySelector('img');
    if (img) {
      resizeImageToFit(img, windowWidth, event.clientX, preloadedSize);
    }
    
    // 获取工具提示尺寸
    const rect = tooltip.getBoundingClientRect();
    
    // 始终显示在鼠标右侧
    let left = event.clientX + 10;
    let top = event.clientY - rect.height / 2;
    
    // 确保不超出右边界
    if (left + rect.width > windowWidth - 20) {
      left = windowWidth - rect.width - 20;
    }
    
    // 确保不超出上下边界
    if (top < 20) {
      top = 20;
    }
    if (top + rect.height > windowHeight - 20) {
      top = windowHeight - rect.height - 20;
    }
    
    // 确保最终位置在鼠标右侧
    if (left < event.clientX + 10) {
      left = event.clientX + 10;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
  
  // 简化的图片缩放逻辑
  function resizeImageToFit(img, windowWidth, mouseX, preloadedSize = null) {
    // 计算鼠标右侧可用空间
    const availableWidth = windowWidth - mouseX - 30;
    const maxWidth = Math.min(availableWidth, windowWidth * 0.4);
    
    // 获取图片尺寸
    let originalWidth = img.naturalWidth;
    let originalHeight = img.naturalHeight;
    
    // 如果图片还未加载完成，使用预加载的尺寸
    if ((!originalWidth || !originalHeight) && preloadedSize) {
      originalWidth = preloadedSize.width;
      originalHeight = preloadedSize.height;
    } else if (!originalWidth || !originalHeight) {
      // 使用默认尺寸
      originalWidth = 400;
      originalHeight = 300;
    }
    
    // 如果图片宽度超出可用空间，进行缩放
    if (originalWidth > maxWidth) {
      const scale = maxWidth / originalWidth;
      img.style.width = maxWidth + 'px';
      img.style.height = (originalHeight * scale) + 'px';
    } else {
      img.style.width = 'auto';
      img.style.height = 'auto';
    }
  }
  
  // 获取重要性类名
  function getImportanceClass(importance) {
    switch (importance) {
      case 'seminal': return 'seminal-paper';
      case 'novel': return 'novel-paper';
      case 'emmm': return 'emmm-paper';
      default: return '';
    }
  }
  
  // 加载样式表
  function loadTimelineStyles() {
    if (!document.getElementById('timeline-styles')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'timeline-styles';
      linkElement.rel = 'stylesheet';
      linkElement.href = '/css/timeline.css';
      document.head.appendChild(linkElement);
    }
  }
  
  // 用于转义HTML字符，防止XSS攻击
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  // 用于年份等已知安全内容的简单消毒
  function sanitizeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[^\d\s]/g, '');
  }
}); 