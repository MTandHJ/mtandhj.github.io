var fuse; // holds our search engine
var searchVisible = false;
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?
 
// ==========================================
// The main keyboard event listener running the show
//
document.addEventListener("click", event => {
  var cDom = document.getElementById("fastSearch");
  var sDom = document.getElementById('search-click');
  var tDom = event.target;
  if (sDom == tDom || sDom.contains(tDom)) {
    showSearchInput();
  } else if (cDom == tDom || cDom.contains(tDom)) {
    // ...
  } else if (searchVisible) {
    cDom.style.display = "none"
    searchVisible = false;
  }
});
 
document.addEventListener('keydown', function(event) {
  // CMD-/ to show / hide Search
  if (event.metaKey && event.which === 191) {
    showSearchInput();
  }

  // Allow ESC (27) to close search box
  if (event.keyCode == 27) {
    if (searchVisible) {
      document.getElementById("fastSearch").style.display = "none";
      document.activeElement.blur();
      searchVisible = false;
    }
  }

  // DOWN (40) arrow
  if (event.keyCode == 40) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault();
      // 获取所有搜索结果链接
      const links = Array.from(document.querySelectorAll('#searchResults li a'));
      const currentIndex = links.indexOf(document.activeElement);
      
      if (currentIndex === -1) {
        // 如果当前不在任何结果上（比如在搜索框），选择第一个
        links[0]?.focus();
      } else if (currentIndex < links.length - 1) {
        // 移动到下一个结果
        links[currentIndex + 1].focus();
      }
    }
  }

  // UP (38) arrow
  if (event.keyCode == 38) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault();
      const links = Array.from(document.querySelectorAll('#searchResults li a'));
      const currentIndex = links.indexOf(document.activeElement);

      if (currentIndex === 0) {
        // 如果在第一个结果，返回搜索框
        maininput.focus();
      } else if (currentIndex > 0) {
        // 移动到上一个结果
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
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
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
  fetchJSONFile('/index.json', function(data){
 
    var options = { // fuse.js options; check fuse.js website for details
      includeMatches: true,
      shouldSort: true,
      ignoreLocation: true,
      keys: [
        {
          name: 'title',
          weight: 1,
        },
        {
          name: 'content',
          weight: 0.6,
        },
      ],
    };
    fuse = new Fuse(data, options); // build the index from the json file
  });
}
 
 
// ==========================================
// using the index we loaded on CMD-/, run
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  if (term.length == 0) {
    document.getElementById("searchResults").setAttribute("style", "");
    return;
  }
  let results = fuse.search(term);
  let searchItems = '';

  if (results.length === 0) {
    resultsAvailable = false;
    searchItems = '<li class="noSearchResult">无结果</li>';
  } else {
    permalinkList = []
    searchItemCount = 0
    for (let item in results) {
      if (permalinkList.includes(results[item].item.permalink)) {
        continue;
      }
      permalinkList.push(results[item].item.permalink);
      searchItemCount += 1;

      title = results[item].item.title;
      const isSlide = results[item].item.permalink.includes('/slides/');
      content = '';

      for (const match of results[item].matches) {
        if (match.key == 'title') {
          // 先尝试查找完全匹配
          const exactMatches = [...match.value.matchAll(new RegExp(term, 'gi'))];
          if (exactMatches.length > 0) {
            // 找到完全匹配，使用完全匹配的部分
            let lastIndex = 0;
            let newTitle = '';
            for (const exactMatch of exactMatches) {
              newTitle += match.value.slice(lastIndex, exactMatch.index) +
                         '<span class="search-highlight">' + exactMatch[0] + '</span>';
              lastIndex = exactMatch.index + exactMatch[0].length;
            }
            newTitle += match.value.slice(lastIndex);
            title = newTitle;
          } else {
            // 没有完全匹配，使用 Fuse.js 的匹配结果
            startIndex = match.indices[0][0];
            endIndex = match.indices[0][1] + 1;
            highText = '<span class="search-highlight">' + match.value.slice(startIndex, endIndex) + '</span>';
            title = match.value.slice(0, startIndex) + highText + match.value.slice(endIndex);
          }
        } else if (match.key == 'content') {
          // 对内容也应用相同的逻辑
          const exactMatches = [...match.value.matchAll(new RegExp(term, 'gi'))];
          if (exactMatches.length > 0) {
            // 使用第一个完全匹配的结果及其上下文
            const exactMatch = exactMatches[0];
            const start = Math.max(0, exactMatch.index - 30);
            const end = Math.min(match.value.length, exactMatch.index + exactMatch[0].length + 30);
            content = (start > 0 ? '...' : '') +
                     match.value.slice(start, exactMatch.index) +
                     '<span class="search-highlight">' + exactMatch[0] + '</span>' +
                     match.value.slice(exactMatch.index + exactMatch[0].length, end) +
                     (end < match.value.length ? '...' : '');
          } else {
            // 没有完全匹配，使用 Fuse.js 的匹配结果
            startIndex = match.indices[0][0];
            endIndex = match.indices[0][1] + 1;
            if (isSlide) {
              content = '<span class="search-highlight">' + match.value.slice(startIndex, endIndex) + '</span>';
            } else {
              content = match.value.slice(Math.max(0, startIndex - 30), startIndex) + 
                       '<span class="search-highlight">' + match.value.slice(startIndex, endIndex) + '</span>' + 
                       match.value.slice(endIndex, endIndex + 30);
            }
          }
        }
      }

      const resultItem = '<li><a href="' + results[item].item.permalink + '" tabindex="0" class="search-result-item">' + 
                        '<span class="title">' + title + '</span>' +
                        (content ? '<br /> <span class="sc">'+ content +'</span>' : '') +
                        '</a></li>';
      
      searchItems += resultItem;
      if (searchItemCount >= 5) {
        break;
      }
    }
    resultsAvailable = true;
  }

  document.getElementById("searchResults").setAttribute("style", "display: block;");
  document.getElementById("searchResults").innerHTML = searchItems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild;
    last = list.lastChild.firstElementChild;
  }
}