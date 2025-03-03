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
      showSearchInput()
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
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
      else if ( document.activeElement == last ) { last.focus(); } // if we're at the bottom, stay there
      else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); } // otherwise select the next search result
    }
  }
 
  // UP (38) arrow
  if (event.keyCode == 38) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
      else if ( document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
      else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
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
  let results = fuse.search(term); // the actual query being run using fuse.js
  let searchItems = ''; // our results bucket
 
  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchItems = '<li class="noSearchResult">无结果</li>';
  } else { // build our html
    permalinkList = []
    searchItemCount = 0
    for (let item in results) {
      if (permalinkList.includes(results[item].item.permalink)) {
        continue;
      }
      // 去重
      permalinkList.push(results[item].item.permalink);
      searchItemCount += 1;
 
      title = results[item].item.title;
      content = results[item].item.content.slice(0, 50);
      for (const match of results[item].matches) {
        if (match.key == 'title') {
          startIndex = match.indices[0][0];
          endIndex = match.indices[0][1] + 1;
          highText = '<span class="search-highlight">' + match.value.slice(startIndex, endIndex) + '</span>';
          title = match.value.slice(0, startIndex) + highText + match.value.slice(endIndex);
        } else if (match.key == 'content') {
          startIndex = match.indices[0][0];
          endIndex = match.indices[0][1] + 1;
          highText = '<span class="search-highlight">' + match.value.slice(startIndex, endIndex) + '</span>';
          content = match.value.slice(Math.max(0, startIndex - 30), startIndex) + highText + match.value.slice(endIndex, endIndex + 30);
        }
      }
      searchItems = searchItems + '<li><a href="' + results[item].item.permalink + '">' + '<span class="title">' + title + '</span><br /> <span class="sc">'+ content +'</span></a></li>';
      // only show first 5 results
      if (searchItemCount >= 5) {
        break;
      }
    }
    resultsAvailable = true;
  }
 
  document.getElementById("searchResults").setAttribute("style", "display: block;");
  document.getElementById("searchResults").innerHTML = searchItems;
  if (results.length > 0) {
    first = list.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }
}