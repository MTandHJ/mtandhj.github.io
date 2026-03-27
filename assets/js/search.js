var pagefind = null;
var searchVisible = false;
var firstRun = true;
var list = document.getElementById('searchResults');
var maininput = document.getElementById('searchInput');
var resultsAvailable = false;

var MAX_RESULTS = 5;

// ==========================================
// Click handler
//
document.addEventListener("click", function(event) {
  var searchContainer = document.getElementById("fastSearch");
  var searchButton = document.getElementById('search-click');
  var target = event.target;

  if (searchButton === target || searchButton.contains(target)) {
    showSearchInput();
  } else if (searchContainer === target || searchContainer.contains(target)) {
    // noop
  } else if (searchVisible) {
    searchContainer.style.display = "none";
    searchVisible = false;
  }
});

// ==========================================
// Keyboard shortcuts
//
document.addEventListener('keydown', function(event) {
  // CMD-/ to show / hide Search
  if (event.metaKey && event.which === 191) {
    showSearchInput();
  }

  // ESC to close
  if (event.keyCode === 27 && searchVisible) {
    document.getElementById("fastSearch").style.display = "none";
    document.activeElement.blur();
    searchVisible = false;
  }

  // Arrow key navigation
  if (searchVisible && resultsAvailable) {
    var links = Array.from(document.querySelectorAll('#searchResults li a'));
    var currentIndex = links.indexOf(document.activeElement);

    if (event.keyCode === 40) { // DOWN
      event.preventDefault();
      if (currentIndex === -1) {
        if (links[0]) links[0].focus();
      } else if (currentIndex < links.length - 1) {
        links[currentIndex + 1].focus();
      }
    }

    if (event.keyCode === 38) { // UP
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
// Search on keyup
//
document.getElementById("searchInput").onkeyup = function(e) {
  executeSearch(this.value);
};

// ==========================================
// Show/hide search input
//
function showSearchInput() {
  if (firstRun) {
    loadSearch();
    firstRun = false;
  }

  if (!searchVisible) {
    document.getElementById("fastSearch").style.display = "block";
    document.getElementById("searchInput").focus();
    searchVisible = true;
  } else {
    document.getElementById("fastSearch").style.display = "none";
    document.activeElement.blur();
    searchVisible = false;
  }
}

// ==========================================
// Load Pagefind
//
function loadSearch() {
  import("/pagefind/pagefind.js").then(function(pf) {
    pagefind = pf;
  });
}

// ==========================================
// Execute search
//
function executeSearch(term) {
  if (!term || !pagefind) {
    document.getElementById("searchResults").setAttribute("style", "");
    return;
  }

  pagefind.debouncedSearch(term).then(function(search) {
    if (search === null) return; // superseded

    var searchItems = '';

    if (search.results.length === 0) {
      resultsAvailable = false;
      searchItems = '<li class="noSearchResult">无结果</li>';
    } else {
      resultsAvailable = true;

      Promise.all(
        search.results.slice(0, MAX_RESULTS).map(function(r) { return r.data(); })
      ).then(function(results) {
        var html = '';
        for (var i = 0; i < results.length; i++) {
          var data = results[i];
          var title = (data.meta && data.meta.title) || '无标题';
          var excerpt = data.excerpt || '';

          html += '<li><a href="' + data.url + '" tabindex="0" class="search-result-item">' +
            '<span class="title">' + title + '</span>' +
            (excerpt ? '<br /><span class="sc">' + excerpt + '</span>' : '') +
            '</a></li>';
        }

        document.getElementById("searchResults").setAttribute("style", "display: block;");
        document.getElementById("searchResults").innerHTML = html;
      });
    }

    if (search.results.length === 0) {
      document.getElementById("searchResults").setAttribute("style", "display: block;");
      document.getElementById("searchResults").innerHTML = searchItems;
    }
  });
}
