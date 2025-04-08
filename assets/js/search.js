var fuse; // holds our search engine
var searchVisible = false;
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// 常量定义
const CONSTANTS = {
  MAX_RESULTS: 5,
  CONTEXT_LENGTH: 50,
  SHORT_WORD_LENGTH: 2,
  SEARCH_THRESHOLD: 0.4
};

// ==========================================
// The main keyboard event listener running the show
//
document.addEventListener("click", event => {
  const searchContainer = document.getElementById("fastSearch");
  const searchButton = document.getElementById('search-click');
  const target = event.target;

  if (searchButton === target || searchButton.contains(target)) {
    showSearchInput();
  } else if (searchContainer === target || searchContainer.contains(target)) {
    // 点击搜索容器内部，不做处理
  } else if (searchVisible) {
    searchContainer.style.display = "none";
    searchVisible = false;
  }
});

document.addEventListener('keydown', function(event) {
  // CMD-/ to show / hide Search
  if (event.metaKey && event.which === 191) {
    showSearchInput();
  }

  // Allow ESC (27) to close search box
  if (event.keyCode === 27 && searchVisible) {
    document.getElementById("fastSearch").style.display = "none";
    document.activeElement.blur();
    searchVisible = false;
  }

  // DOWN (40) arrow
  if (searchVisible && resultsAvailable) {
    const links = Array.from(document.querySelectorAll('#searchResults li a'));
    const currentIndex = links.indexOf(document.activeElement);
    
    if (event.keyCode === 40) {
      event.preventDefault();
      if (currentIndex === -1) {
        links[0]?.focus();
      } else if (currentIndex < links.length - 1) {
        links[currentIndex + 1].focus();
      }
    }
  }

  // UP (38) arrow
  if (searchVisible && resultsAvailable) {
    const links = Array.from(document.querySelectorAll('#searchResults li a'));
    const currentIndex = links.indexOf(document.activeElement);

    if (event.keyCode === 38) {
      event.preventDefault();
      if (currentIndex === 0) {
        maininput.focus();
      } else if (currentIndex > 0) {
        links[currentIndex - 1].focus();
      }
    }
  }
});

// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function(e) {
  executeSearch(this.value);
}

function showSearchInput() {
  // Load json search index if first time invoking search
  // Means we don't load json unless searches are going to happen; keep user payload small unless needed
  if(firstRun) {
    loadSearch(); // loads our json data and builds fuse.js search index
    firstRun = false; // let's never do this again
  }
 
  // Toggle visibility of search box
  if (!searchVisible) {
    document.getElementById("fastSearch").style.display = "block"; // show search box
    document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
    searchVisible = true; // search visible
  }
  else {
    document.getElementById("fastSearch").style.display = "none"; // hide search box
    document.activeElement.blur(); // remove focus from search box
    searchVisible = false; // search not visible
  }
}

// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      try {
        const data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() {
  fetchJSONFile('/index.json', function(data) {
    const options = {
      includeMatches: true,
      shouldSort: true,
      ignoreLocation: true,
      threshold: CONSTANTS.SEARCH_THRESHOLD,
      minMatchCharLength: 1,
      keys: [
        {
          name: 'title',
          weight: 1
        },
        {
          name: 'content',
          weight: 0.6
        }
      ],
      useExtendedSearch: true,  // 启用扩展搜索
      findAllMatches: true,     // 查找所有匹配
      distance: 200,            // 增加距离参数
    };
    fuse = new Fuse(data, options);
  });
}

// ==========================================
// 检查字符串是否包含中文
function containsChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

// ==========================================
// 转义正则表达式中的特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==========================================
// 清理文本内容，移除数学公式和特殊字符
function cleanText(text) {
  if (!text) return '';
  
  return text
    // 移除数学公式
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$.*?\$/g, '')
    .replace(/\\\[[\s\S]*?\\\]/g, '')
    .replace(/\\\(.*?\\\)/g, '')
    // 移除HTML标签和Markdown格式
    .replace(/<img[^>]*>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    // 移除LaTeX命令和特殊字符
    .replace(/\\[a-zA-Z]+\{.*?\}/g, '')
    .replace(/[_^\\{}]/g, '')
    // 清理空白字符
    .replace(/\s+/g, ' ')
    .trim();
}

// ==========================================
// 处理搜索结果高亮
function highlightText(text, term) {
  if (!text || !term) return text;
  
  const searchTerm = term.toLowerCase();
  
  // 对于中文和短词采用简单匹配
  if (searchTerm.length <= CONSTANTS.SHORT_WORD_LENGTH || containsChinese(searchTerm)) {
    const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
    return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
  }
  
  // 对于其他情况，处理连字符匹配
  const searchTerms = [
    escapeRegExp(searchTerm),
    escapeRegExp(searchTerm) + '-\\w+',
    '\\w+-' + escapeRegExp(searchTerm)
  ];
  
  const regex = new RegExp(searchTerms.join('|'), 'gi');
  return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

// ==========================================
// 截取搜索结果上下文
function extractContext(text, term) {
  if (!text || !term) return '';
  
  const searchTerm = term.toLowerCase();
  const textLower = text.toLowerCase();
  const termIndex = textLower.indexOf(searchTerm);
  
  if (termIndex === -1) {
    return text.slice(0, 100) + ' ...';
  }
  
  const startPos = Math.max(0, termIndex - CONSTANTS.CONTEXT_LENGTH);
  const endPos = Math.min(text.length, termIndex + searchTerm.length + CONSTANTS.CONTEXT_LENGTH);
  
  return (startPos > 0 ? '... ' : '') +
         text.slice(startPos, endPos).trim() +
         (endPos < text.length ? ' ...' : '');
}

// ==========================================
// using the index we loaded on CMD-/, run
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  if (!term) {
    document.getElementById("searchResults").setAttribute("style", "");
    return;
  }

  const searchTerm = term.toLowerCase();
  const results = fuse.search(searchTerm);
  let searchItems = '';

  if (results.length === 0) {
    resultsAvailable = false;
    searchItems = '<li class="noSearchResult">无结果</li>';
  } else {
    resultsAvailable = true;
    const processedLinks = new Set();
    let itemCount = 0;

    // 过滤和排序结果
    const filteredResults = results.filter(result => {
      // 检查是否包含搜索词
      const title = cleanText(result.item.title).toLowerCase();
      const content = result.item.content ? cleanText(result.item.content).toLowerCase() : '';
      
      // 对于中文和短词采用更宽松的匹配策略
      if (searchTerm.length <= CONSTANTS.SHORT_WORD_LENGTH || containsChinese(searchTerm)) {
        // 对于中文和短词，只要包含就算匹配
        return title.includes(searchTerm) || content.includes(searchTerm);
      } else {
        // 对于其他情况，检查完全匹配或带连字符的匹配
        return title.includes(searchTerm) || 
               content.includes(searchTerm) ||
               title.includes(searchTerm + '-') ||
               content.includes(searchTerm + '-') ||
               title.includes('-' + searchTerm) ||
               content.includes('-' + searchTerm);
      }
    });

    // 对过滤后的结果进行排序
    const sortedResults = filteredResults.sort((a, b) => {
      const aTitle = cleanText(a.item.title).toLowerCase();
      const bTitle = cleanText(b.item.title).toLowerCase();
      
      // 对于中文和短词采用简单的包含判断
      if (searchTerm.length <= CONSTANTS.SHORT_WORD_LENGTH || containsChinese(searchTerm)) {
        const aTitleMatch = aTitle.includes(searchTerm);
        const bTitleMatch = bTitle.includes(searchTerm);
        
        if (aTitleMatch !== bTitleMatch) {
          return aTitleMatch ? -1 : 1;
        }
      } else {
        // 标题中的完全匹配优先
        const aTitleExact = aTitle.includes(searchTerm);
        const bTitleExact = bTitle.includes(searchTerm);
        
        if (aTitleExact !== bTitleExact) {
          return aTitleExact ? -1 : 1;
        }
        
        // 其次是标题中的连字符匹配
        const aTitleHyphen = aTitle.includes(searchTerm + '-') || aTitle.includes('-' + searchTerm);
        const bTitleHyphen = bTitle.includes(searchTerm + '-') || bTitle.includes('-' + searchTerm);
        
        if (aTitleHyphen !== bTitleHyphen) {
          return aTitleHyphen ? -1 : 1;
        }
      }
      
      return 0;
    });

    // 构建搜索结果
    for (const result of sortedResults) {
      if (itemCount >= CONSTANTS.MAX_RESULTS) break;
      
      const permalink = result.item.permalink;
      if (processedLinks.has(permalink)) continue;
      
      processedLinks.add(permalink);
      itemCount++;

      let title = cleanText(result.item.title);
      let content = '';

      // 处理匹配项
      for (const match of result.matches) {
        if (match.key === 'title') {
          title = highlightText(title, term);
        } else if (match.key === 'content') {
          const cleanContent = cleanText(match.value);
          content = extractContext(cleanContent, term);
          content = highlightText(content, term);
        }
      }

      searchItems += `<li><a href="${permalink}" tabindex="0" class="search-result-item">` +
                    `<span class="title">${title}</span>` +
                    (content ? `<br /><span class="sc">${content}</span>` : '') +
                    `</a></li>`;
    }
  }

  document.getElementById("searchResults").setAttribute("style", "display: block;");
  document.getElementById("searchResults").innerHTML = searchItems;

  if (results.length > 0) {
    first = list.firstChild.firstElementChild;
    last = list.lastChild.firstElementChild;
  }
}