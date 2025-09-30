document.addEventListener('DOMContentLoaded', function() {
  // 预加载CSS样式，避免等到DOM构建完成后才加载样式
  loadTodoStyles();
  
  // 获取时间线数据并验证
  const timelineData = window.timelineData || [];
  const timelineContainer = document.getElementById('timeline');
  
  // 早期返回，避免不必要的处理
  if (!timelineData.length || !timelineContainer) return;

  try {
    // 使用Date对象缓存减少重复创建
    const dateCache = new Map();
    const defaultDate = new Date('1970-01-01');
    
    // 获取当前时间
    const currentDate = new Date();
    
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
        imageUrl: item.imageUrl || '',
        status: item.status || 'pending'
      };
      
      // 验证日期格式并解析
      if (!processedItem.date || !/^\d{4}-\d{2}-\d{2}/.test(processedItem.date)) {
        console.warn(`TODO item has invalid date format: ${processedItem.title || 'Unnamed todo'}`);
        processedItem.date = '1970-01-01';
      }
      
      // 使用日期缓存
      if (!dateCache.has(processedItem.date)) {
        const dateObj = new Date(processedItem.date);
        if (isNaN(dateObj.getTime())) {
          console.warn(`Invalid date for TODO item: ${processedItem.title || 'Unnamed todo'}`);
          dateCache.set(processedItem.date, defaultDate);
        } else {
          dateCache.set(processedItem.date, dateObj);
        }
      }
      
      // 直接从缓存获取年份和月份信息
      const dateObj = dateCache.get(processedItem.date);
      processedItem.year = dateObj.getFullYear();
      processedItem.month = dateObj.getMonth() + 1;
      
      // 判断是否延期：如果日期早于当前时间且状态不是completed，则自动标记为延期
      processedItem.isOverdue = isOverdue(dateObj, currentDate, processedItem.status);
      
      return processedItem;
    }).filter(Boolean);
    
    // 如果处理后没有有效数据，提前返回
    if (!processedData.length) {
      timelineContainer.innerHTML = '<p>没有找到有效的TODO数据</p>';
      return;
    }

    // 预计算所有时间分组并排序
    const timeGroups = new Map();
    
    // 为每个项目创建时间分组键
    for (const item of processedData) {
      const dateObj = dateCache.get(item.date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      
      // 创建分组键：年-月
      const groupKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!timeGroups.has(groupKey)) {
        timeGroups.set(groupKey, {
          year: year,
          month: month,
          items: []
        });
      }
      timeGroups.get(groupKey).items.push(item);
    }
    
    // 按时间排序分组
    const sortedGroups = Array.from(timeGroups.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
    
    // 对每个分组内的项目按日期排序
    for (const group of sortedGroups) {
      if (group.items.length > 1) {
        group.items.sort((a, b) => {
          const dateA = dateCache.get(a.date);
          const dateB = dateCache.get(b.date);
          return dateB - dateA;
        });
      }
    }
    
    // 添加年份标记
    const finalSections = [];
    let lastYear = null;
    
    for (const group of sortedGroups) {
      // 如果年份变化，添加年份标记
      if (lastYear !== group.year) {
        finalSections.push({
          type: 'year',
          year: group.year,
          isCurrentYear: group.year === currentDate.getFullYear()
        });
        lastYear = group.year;
      }
      
      // 添加月份分组
      finalSections.push({
        type: 'month',
        year: group.year,
        month: group.month,
        items: group.items,
        isCurrentTimeGroup: group.year === currentDate.getFullYear() && group.month === currentDate.getMonth() + 1
      });
    }
    
    // 使用文档片段减少重排和重绘
    const fragmentContainer = document.createDocumentFragment();
    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'timeline-wrapper';
    
    // 一次性构建所有时间分组的HTML
    const timeSectionsHTML = [];
    for (const section of finalSections) {
      if (section.type === 'year') {
        timeSectionsHTML.push(createYearSectionHTML(section));
      } else if (section.type === 'month' && section.items && section.items.length > 0) {
        timeSectionsHTML.push(createMonthSectionHTML(section));
      }
    }
    
    // 一次性设置HTML，减少DOM操作
    if (timeSectionsHTML.length > 0) {
      timelineWrapper.innerHTML = timeSectionsHTML.join('');
      fragmentContainer.appendChild(timelineWrapper);
      
      // 一次性更新DOM
      timelineContainer.appendChild(fragmentContainer);
      
      // 添加悬停事件监听器
      addHoverEventListeners();
    } else {
      timelineContainer.innerHTML = '<p>没有找到有效的TODO数据</p>';
    }
  } catch (error) {
    console.error('Error rendering TODO timeline:', error);
    timelineContainer.innerHTML = '<p>加载TODO时间线时出错。请刷新页面重试。</p>';
  }
  
  
  // 判断TODO是否延期：如果日期早于当前时间且状态不是completed，则自动标记为延期
  function isOverdue(todoDate, currentDate, status) {
    // 如果已完成，不算延期
    if (status === 'completed') return false;
    
    // 比较日期：如果截止日期早于当前日期，则自动标记为延期
    return todoDate < currentDate;
  }
  
  // 创建年份部分的HTML字符串
  function createYearSectionHTML(section) {
    const { year, isCurrentYear } = section;
    
    // 创建左侧年份标记HTML
    const timelineLeftHTML = `
      <div class="timeline-left">
        <div class="year-marker">
          ${isCurrentYear ? '<div class="current-time-marker"></div>' : '<div class="year-point"></div>'}
          <h3 class="${isCurrentYear ? 'current-time-label' : 'year-label'}">${sanitizeHTML(year.toString())}</h3>
        </div>
      </div>
    `;
    
    // 创建中间线HTML
    const timelineCenterHTML = '<div class="timeline-center"></div>';
    
    // 年份没有内容，只显示年份标记
    const timelineRightHTML = '<div class="timeline-right"></div>';
    
    // 组合完整的年份区域HTML
    return `
      <div class="year-section">
        ${timelineLeftHTML}
        ${timelineCenterHTML}
        ${timelineRightHTML}
      </div>
    `;
  }
  
  // 创建月份部分的HTML字符串
  function createMonthSectionHTML(section) {
    const { year, month, items, isCurrentTimeGroup } = section;
    
    // 创建时间标签
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeLabel = monthNames[month];
    
    // 创建左侧时间标记HTML
    const timelineLeftHTML = `
      <div class="timeline-left">
        <div class="time-marker">
          ${isCurrentTimeGroup ? '<div class="current-time-marker"></div>' : '<div class="time-point"></div>'}
          <h3 class="${isCurrentTimeGroup ? 'current-time-label' : 'time-label'}">${escapeHTML(timeLabel)}</h3>
        </div>
      </div>
    `;
    
    // 创建中间线HTML
    const timelineCenterHTML = '<div class="timeline-center"></div>';
    
    // 创建右侧内容区域HTML
    let todoItemsHTML = '';
    
    // 构建所有TODO项目的HTML
    for (let i = 0; i < items.length; i++) {
      const itemHTML = createTodoItemHTML(items[i]);
      if (itemHTML) {
        todoItemsHTML += itemHTML;
      }
    }
    
    // 如果没有有效的TODO项目，返回空字符串
    if (!todoItemsHTML) return '';
    
    const timelineRightHTML = `
      <div class="timeline-right">
        <div class="todo-items">
          ${todoItemsHTML}
        </div>
      </div>
    `;
    
    // 组合完整的月份区域HTML
    return `
      <div class="time-section">
        ${timelineLeftHTML}
        ${timelineCenterHTML}
        ${timelineRightHTML}
      </div>
    `;
  }
  
  // 创建TODO项目的HTML字符串
  function createTodoItemHTML(item) {
    if (!item) return '';
    
    // 数据清理与防御性编程
    const todoTitle = (item.title || '').trim() || '未命名TODO';
    const todoDesc = (item.description || '').trim() || '';
    const todoUrl = (item.paperUrl || '').trim() || '#';
    const imageUrl = (item.imageUrl || '').trim() || '';
    const status = item.status || 'pending';
    
    // 根据重要性级别添加不同的类名
    const importanceClass = getImportanceClass(item.importance);
    
    // 根据延期状态添加类名
    const overdueClass = item.isOverdue ? 'overdue' : '';
    
    // 构建状态指示器
    const statusIndicator = getStatusIndicator(status, item.isOverdue);
    
    // 构建HTML字符串，添加data属性用于悬停事件
    return `
      <div class="todo-item ${overdueClass}">
        <div class="todo-title">
          <a href="${escapeHTML(todoUrl)}" target="_blank" rel="noopener" class="todo-link ${importanceClass}" ${imageUrl ? `data-image-url="${escapeHTML(imageUrl)}"` : ''}>${escapeHTML(todoTitle)}</a>
          ${statusIndicator}
        </div>
        <div class="todo-description">${escapeHTML(todoDesc)}</div>
      </div>
    `;
  }
  
  // 获取状态指示器HTML
  function getStatusIndicator(status, isOverdue) {
    // 如果自动判断为延期，显示延期状态
    if (isOverdue) {
      return '<span class="todo-status overdue">已延期</span>';
    }
    
    // 否则显示原始状态
    const statusMap = {
      'pending': '进行中',
      'completed': '已完成'
    };
    
    const statusText = statusMap[status] || '待办';
    return `<span class="todo-status ${status}">${statusText}</span>`;
  }
  
  // 添加悬停事件监听器
  function addHoverEventListeners() {
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
      case 'seminal': return 'seminal-todo';
      case 'novel': return 'novel-todo';
      case 'emmm': return 'emmm-todo';
      default: return '';
    }
  }
  
  // 加载样式表
  function loadTodoStyles() {
    if (!document.getElementById('todo-styles')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'todo-styles';
      linkElement.rel = 'stylesheet';
      linkElement.href = '/css/todo.css';
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
