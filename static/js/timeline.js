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
      
      const dateObj = new Date(processedItem.date);
      // 检查日期是否有效
      if (isNaN(dateObj.getTime())) {
        console.warn(`Invalid date for timeline item: ${processedItem.title || 'Unnamed paper'}`);
        dateObj = new Date('1970-01-01');
      }
      
      // 添加年份属性（仅用于分组）
      processedItem.year = dateObj.getFullYear();
      return processedItem;
    });

    // 按日期排序（从旧到新）- 使用稳定的排序算法
    processedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    // 按年份分组 - 使用 Map 对象更高效
    const yearGroups = processedData.reduce((acc, item) => {
      if (!acc.has(item.year)) {
        acc.set(item.year, []);
      }
      acc.get(item.year).push(item);
      return acc;
    }, new Map());

    // 使用文档片段减少重排和重绘
    const fragmentContainer = document.createDocumentFragment();
    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'timeline-wrapper';
    fragmentContainer.appendChild(timelineWrapper);
    
    // 获取年份数组并排序（降序）
    const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => b - a);
    
    // 遍历每个年份（按降序排列，最新的年份在前面）
    sortedYears.forEach(year => {
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
      const yearItems = yearGroups.get(year);
      yearItems.sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(item => {
          // 数据清理与防御性编程
          const paperTitle = item.title?.trim() || '未命名论文';
          const paperDesc = item.description?.trim() || '';
          const paperUrl = item.paperUrl?.trim() || '#';
          
          // 根据重要性级别添加不同的类名
          let importanceClass = '';
          switch (item.importance) {
            case 'seminal':
              importanceClass = 'seminal-paper';
              break;
            case 'novel':
              importanceClass = 'novel-paper';
              break;
            case 'emmm':
              importanceClass = 'emmm-paper';
              break;
            default:
              importanceClass = '';
          }
          
          // 创建论文项目元素
          const paperItem = document.createElement('div');
          paperItem.className = 'paper-item';
          
          // 使用 innerHTML 构建复杂内容
          paperItem.innerHTML = `
            <div class="paper-title">
              <a href="${escapeHTML(paperUrl)}" target="_blank" rel="noopener" class="paper-link ${importanceClass}">${escapeHTML(paperTitle)}</a>
            </div>
            <div class="paper-description">${escapeHTML(paperDesc)}</div>
          `;
          
          paperItems.appendChild(paperItem);
        });
      
      // 组装结构
      timelineRight.appendChild(paperItems);
      yearSection.appendChild(timelineLeft);
      yearSection.appendChild(timelineCenter);
      yearSection.appendChild(timelineRight);
      timelineWrapper.appendChild(yearSection);
    });
    
    // 一次性更新 DOM
    timelineContainer.appendChild(fragmentContainer);
    
    // 添加样式
    if (!document.getElementById('timeline-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'timeline-styles';
      styleElement.textContent = `
        /* 时间线整体样式 */
        #timeline {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .timeline-wrapper {
          position: relative;
        }
        
        /* 年份区域样式 */
        .year-section {
          position: relative;
          display: flex;
          margin-bottom: 40px;
        }
        
        /* 左侧区域 */
        .timeline-left {
          width: 130px;
          flex-shrink: 0;
          position: relative;
        }
        
        /* 中间时间线 */
        .timeline-center {
          width: 2px;
          background: #e0e0e0;
          flex-shrink: 0;
          position: relative;
          z-index: 0;
        }
        
        /* 右侧内容区域 */
        .timeline-right {
          flex-grow: 1;
          padding-left: 30px;
          position: relative;
        }
        
        /* 年份标记和标签 */
        .year-marker {
          position: relative;
          text-align: right;
          padding-right: 15px;
        }
        
        .year-point {
          position: absolute;
          top: 8px;
          right: -7px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #333;
          z-index: 1;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
        
        .year-label {
          font-size: 1.8em;
          font-weight: 600;
          color: #333;
          margin: 0;
          line-height: 1.2;
        }
        
        /* 论文项目容器 */
        .paper-items {
          position: relative;
        }
        
        /* 论文项目样式 */
        .paper-item {
          padding: 0 0 18px 0;
          margin-bottom: 18px;
          border-bottom: 1px dashed #eaeaea;
        }
        
        .paper-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        /* 论文标题样式 */
        .paper-title {
          margin-bottom: 8px;
        }
        
        .paper-link {
          font-size: 1.1em;
          color: #1a73e8;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .paper-link:hover {
          color: #174ea6;
          text-decoration: underline;
        }
        
        /* 三级重要性样式 */
        /* 开创性论文 */
        .seminal-paper {
          color: #d23669;
          font-weight: 700;
          font-size: 1.25em;
        }
        
        .seminal-paper:hover {
          color: #b32057;
        }
        
        /* 创新性论文 */
        .novel-paper {
          color: #3498db;
          font-weight: 600;
          font-size: 1.05em;
        }
        
        .novel-paper:hover {
          color: #2980b9;
        }
        
        /* 一般重要论文 */
        .emmm-paper {
          color: #777777;
          font-weight: 500;
          font-size: 1.05em;
        }
        
        .emmm-paper:hover {
          color: #555555;
        }
        
        /* 论文描述样式 */
        .paper-description {
          color: #666;
          font-size: 0.85em;
          line-height: 1.5;
        }
        
        /* 暗色模式适配 */
        .dark .timeline-center {
          background: #444;
        }
        
        .dark .year-point {
          background: #ddd;
          border: 2px solid #333;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
        
        .dark .year-label {
          color: #eee;
        }
        
        .dark .paper-item {
          border-bottom: 1px dashed #444;
        }
        
        .dark .paper-link {
          color: #8ab4f8;
        }
        
        .dark .paper-link:hover {
          color: #aecbfa;
        }
        
        /* 暗色模式下的三级重要性样式 */
        .dark .seminal-paper {
          color: #ff7eb6;
        }
        
        .dark .seminal-paper:hover {
          color: #ff9ec9;
        }
        
        .dark .novel-paper {
          color: #6fc6ff;
        }
        
        .dark .novel-paper:hover {
          color: #8bd3ff;
        }
        
        .dark .emmm-paper {
          color: #aaaaaa;
        }
        
        .dark .emmm-paper:hover {
          color: #cccccc;
        }
        
        .dark .paper-description {
          color: #aaa;
        }
        
        /* 响应式设计 */
        @media (max-width: 700px) {
          .timeline-left {
            width: 100px;
          }
          
          .timeline-right {
            padding-left: 20px;
          }
          
          .year-label {
            font-size: 1.5em;
          }
          
          .seminal-paper {
            font-size: 1.2em;
          }
          
          .novel-paper {
            font-size: 1.1em;
          }
          
          .emmm-paper {
            font-size: 1.03em;
          }
        }
        
        @media (max-width: 500px) {
          .timeline-left {
            width: 80px;
          }
          
          .timeline-right {
            padding-left: 15px;
          }
          
          .year-label {
            font-size: 1.3em;
          }
          
          .seminal-paper {
            font-size: 1.15em;
          }
          
          .novel-paper {
            font-size: 1.08em;
          }
          
          .emmm-paper {
            font-size: 1.02em;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  } catch (error) {
    console.error('Error rendering timeline:', error);
    timelineContainer.innerHTML = '<p>加载时间线时出错。请刷新页面重试。</p>';
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