document.addEventListener('DOMContentLoaded', function() {
  // 获取时间线数据并验证
  const timelineData = window.timelineData || [];
  const timelineContainer = document.getElementById('timeline');
  
  // 早期返回，避免不必要的处理
  if (!timelineData.length || !timelineContainer) return;

  try {
    // 预处理和验证数据
    const processedData = timelineData.map(item => {
      // 深拷贝以避免修改原始数据
      const processedItem = { ...item };
      
      // 验证日期格式并解析
      if (!processedItem.date || !/^\d{4}-\d{2}-\d{2}/.test(processedItem.date)) {
        console.warn(`Timeline item has invalid date format: ${processedItem.title || 'Unnamed paper'}`);
        processedItem.date = '1970-01-01'; // 使用默认日期以确保脚本继续运行
      }
      
      let dateObj = new Date(processedItem.date);
      // 检查日期是否有效
      if (isNaN(dateObj.getTime())) {
        console.warn(`Invalid date for timeline item: ${processedItem.title || 'Unnamed paper'}`);
        dateObj = new Date('1970-01-01');
      }
      
      // 添加年份属性（仅用于分组）
      processedItem.year = dateObj.getFullYear();
      return processedItem;
    });

    // 按日期排序（从旧到新）
    processedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 按年份分组
    const yearGroups = new Map();
    for (const item of processedData) {
      if (!yearGroups.has(item.year)) {
        yearGroups.set(item.year, []);
      }
      yearGroups.get(item.year).push(item);
    }

    // 获取年份数组并排序（降序）
    const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => b - a);
    
    // 使用文档片段减少重排和重绘
    const fragmentContainer = document.createDocumentFragment();
    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'timeline-wrapper';
    
    // 生成时间线HTML
    for (const year of sortedYears) {
      const yearSection = createYearSection(year, yearGroups.get(year));
      timelineWrapper.appendChild(yearSection);
    }
    
    fragmentContainer.appendChild(timelineWrapper);
    
    // 一次性更新DOM
    timelineContainer.appendChild(fragmentContainer);
    
    // 加载CSS样式
    loadTimelineStyles();
  } catch (error) {
    console.error('Error rendering timeline:', error);
    timelineContainer.innerHTML = '<p>加载时间线时出错。请刷新页面重试。</p>';
  }
  
  // 创建年份部分
  function createYearSection(year, items) {
    const yearSection = document.createElement('div');
    yearSection.className = 'year-section';
    
    // 创建年份左侧部分
    const timelineLeft = document.createElement('div');
    timelineLeft.className = 'timeline-left';
    timelineLeft.innerHTML = `
      <div class="year-marker">
        <div class="year-point"></div>
        <h3 class="year-label">${year}</h3>
      </div>
    `;
    
    // 创建中间线
    const timelineCenter = document.createElement('div');
    timelineCenter.className = 'timeline-center';
    
    // 创建右侧内容区域
    const timelineRight = document.createElement('div');
    timelineRight.className = 'timeline-right';
    
    const paperItems = document.createElement('div');
    paperItems.className = 'paper-items';
    
    // 对该年份的数据按日期排序
    items.sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(item => createPaperItem(item, paperItems));
    
    // 组装结构
    timelineRight.appendChild(paperItems);
    yearSection.appendChild(timelineLeft);
    yearSection.appendChild(timelineCenter);
    yearSection.appendChild(timelineRight);
    
    return yearSection;
  }
  
  // 创建论文项目
  function createPaperItem(item, container) {
    // 数据清理与防御性编程
    const paperTitle = item.title?.trim() || '未命名论文';
    const paperDesc = item.description?.trim() || '';
    const paperUrl = item.paperUrl?.trim() || '#';
    
    // 根据重要性级别添加不同的类名
    const importanceClass = getImportanceClass(item.importance);
    
    // 创建论文项目元素
    const paperItem = document.createElement('div');
    paperItem.className = 'paper-item';
    
    // 构建内容
    paperItem.innerHTML = `
      <div class="paper-title">
        <a href="${escapeHTML(paperUrl)}" target="_blank" rel="noopener" class="paper-link ${importanceClass}">${escapeHTML(paperTitle)}</a>
      </div>
      <div class="paper-description">${escapeHTML(paperDesc)}</div>
    `;
    
    container.appendChild(paperItem);
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
  
  // 用于转义 HTML 字符，防止 XSS 攻击
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}); 