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
      
      // 创建工具提示元素
      const tooltip = document.createElement('div');
      tooltip.className = 'timeline-tooltip';
      tooltip.innerHTML = `<img src="${escapeHTML(imageUrl)}" alt="缩略图" loading="lazy">`;
      document.body.appendChild(tooltip);
      
      let hideTimeout;
      
      // 鼠标进入事件
      link.addEventListener('mouseenter', function(e) {
        clearTimeout(hideTimeout);
        tooltip.style.display = 'block';
        // 使用requestAnimationFrame确保display:block生效后再添加show类
        requestAnimationFrame(() => {
          tooltip.classList.add('show');
        });
        positionTooltip(tooltip, e);
      });
      
      // 鼠标移动事件（更新位置）
      link.addEventListener('mousemove', function(e) {
        positionTooltip(tooltip, e);
      });
      
      // 鼠标离开事件
      link.addEventListener('mouseleave', function() {
        tooltip.classList.remove('show');
        // 等待过渡动画完成后再隐藏
        hideTimeout = setTimeout(() => {
          tooltip.style.display = 'none';
        }, 200);
      });
    });
  }
  
  // 定位工具提示
  function positionTooltip(tooltip, event) {
    const rect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 默认位置（鼠标右侧）
    let left = event.clientX + 10;
    let top = event.clientY - rect.height / 2;
    
    // 如果工具提示超出右边界，显示在左侧
    if (left + rect.width > windowWidth - 20) {
      left = event.clientX - rect.width - 10;
    }
    
    // 如果工具提示超出上边界，调整垂直位置
    if (top < 20) {
      top = 20;
    }
    
    // 如果工具提示超出下边界，调整垂直位置
    if (top + rect.height > windowHeight - 20) {
      top = windowHeight - rect.height - 20;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
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