class SearchManager {
  constructor() {
    this.pagefind = null;
    this.visible = false;
    this.firstRun = true;
    this.resultsAvailable = false;
    this.tagFilters = null;
    this.activeMode = null;
    this.selectedTags = [];
    this.generation = 0;

    const cfg = window.__searchConfig || {};
    this.MAX_RESULTS = cfg.maxResults || 15;
    this.PREFIXES = ['tag', 'post', 'slide'];
    this.DEFAULT_PLACEHOLDER = cfg.defaultPlaceholder || '搜索... (tag / post / slide + 空格)';
    this.NO_RESULTS = cfg.noResults || '无结果';
    this.MODE_PLACEHOLDERS = {
      tag: cfg.tagPlaceholder || '输入标签名...',
      post: cfg.postPlaceholder || '搜索博文...',
      slide: cfg.slidePlaceholder || '搜索 Slides...'
    };

    // DOM references
    this.els = {
      search: document.getElementById('fastSearch'),
      input: document.getElementById('searchInput'),
      badge: document.getElementById('searchBadge'),
      wrapper: document.getElementById('search-wrapper'),
      chips: document.getElementById('searchChips'),
      results: document.getElementById('searchResults'),
      trigger: document.getElementById('search-click')
    };

    this._bindEvents();
  }

  // ======================
  // Mode management
  // ======================

  enterMode(mode) {
    this.activeMode = mode;
    this.els.badge.textContent = mode;
    this.els.badge.style.display = 'inline-block';
    this.els.wrapper.classList.add('has-badge');
    this.els.input.placeholder = this.MODE_PLACEHOLDERS[mode] || '';
  }

  exitMode() {
    this.activeMode = null;
    this.selectedTags = [];
    this._renderChips();
    this.els.badge.style.display = 'none';
    this.els.wrapper.classList.remove('has-badge');
    this.els.input.placeholder = this.DEFAULT_PLACEHOLDER;
  }

  // ======================
  // Tag chips
  // ======================

  addChip(tag) {
    if (this.selectedTags.indexOf(tag) !== -1) return;
    this.selectedTags.push(tag);
    this._renderChips();
    this.els.input.value = '';
    this._triggerSearch();
  }

  removeChip(tag) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this._renderChips();
    this._triggerSearch();
  }

  _removeLastChip() {
    if (this.selectedTags.length > 0) {
      this.selectedTags.pop();
      this._renderChips();
      this._triggerSearch();
    } else {
      this.exitMode();
      this._triggerSearch();
    }
  }

  _renderChips() {
    let html = '';
    for (const tag of this.selectedTags) {
      html += `<span class="search-chip" data-tag="${this._escapeHtml(tag)}">` +
        `${this._escapeHtml(tag)}` +
        `<span class="chip-remove" data-remove-tag="${this._escapeHtml(tag)}">\u00d7</span>` +
        `</span>`;
    }
    this.els.chips.innerHTML = html;
    this.els.wrapper.scrollTop = this.els.wrapper.scrollHeight;
  }

  // ======================
  // UI show/hide
  // ======================

  show() {
    if (this.firstRun) {
      this._loadSearch();
      this.firstRun = false;
    }

    if (!this.visible) {
      this.els.search.style.display = 'block';
      this.els.input.focus();
      this.visible = true;
      if (!this.els.input.value.trim() && !this.activeMode) {
        this._showHints();
      }
    } else {
      this.close();
    }
  }

  close() {
    this.els.search.style.display = 'none';
    document.activeElement.blur();
    this.visible = false;
  }

  fillTag(tag) {
    if (!this.activeMode) {
      this.enterMode('tag');
    }
    this.addChip(tag);
    this.els.input.focus();
  }

  // ======================
  // Search dispatch
  // ======================

  _triggerSearch() {
    const query = this.els.input.value;
    this.generation++;

    if (!query.trim() && !this.activeMode) {
      this._hideResults();
      return;
    }
    if (!this.pagefind) return;

    const gen = this.generation;

    switch (this.activeMode) {
      case 'tag':
        this._searchByTag(query, gen);
        break;
      case 'post':
        this._searchByType(query, 'post', gen);
        break;
      case 'slide':
        this._searchByType(query, 'slide', gen);
        break;
      default:
        this._searchGlobal(query, gen);
    }
  }

  // ======================
  // Load Pagefind
  // ======================

  _loadSearch() {
    import('/pagefind/pagefind.js').then(pf => {
      this.pagefind = pf;
      pf.filters().then(filters => {
        this.tagFilters = filters.tag || {};
      });
    });
  }

  // ======================
  // Results display
  // ======================

  _showResults(html) {
    this.els.results.style.display = 'block';
    this.els.results.innerHTML = html;
    this.resultsAvailable = true;
  }

  _hideResults() {
    this.els.results.style.display = 'none';
    this.resultsAvailable = false;
  }

  _showHints() {
    // Empty state: just hide results (hints handled by CSS/HTML if needed)
    this._hideResults();
  }

  _showNoResults() {
    this._showResults(`<li class="noSearchResult">${this.NO_RESULTS}</li>`);
    this.resultsAvailable = false;
  }

  // ======================
  // Tag mode search
  // ======================

  _searchByTag(query, gen) {
    const allTags = this.selectedTags.slice();
    const typing = query.trim();

    if (allTags.length === 0 && !typing) {
      this._showAllTags(this.tagFilters);
      return;
    }

    let html = '';

    // Show tag suggestions while typing (only when no chips selected)
    if (typing && this.tagFilters && allTags.length === 0) {
      const matchingTags = Object.entries(this.tagFilters)
        .filter(([name]) =>
          this._matchesWordPrefix(name, typing) &&
          this.selectedTags.indexOf(name) === -1
        )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (matchingTags.length > 0) {
        let chipHtml = '';
        for (const [tag, count] of matchingTags) {
          chipHtml += `<span class="co-tag-chip" data-tag="${this._escapeHtml(tag)}">` +
            `${this._escapeHtml(tag)} <span class="co-tag-count">${count}</span></span>`;
        }
        html += `<li class="co-tag-bar">${chipHtml}</li>`;
      }
    }

    // No chips yet, just show suggestions
    if (allTags.length === 0 && typing) {
      if (html) {
        this._showResults(html);
      } else {
        this._showNoResults();
      }
      return;
    }

    // Search with all selected chips (AND filter)
    this.pagefind.search(null, { filters: { tag: allTags } }).then(search => {
      if (gen !== this.generation) return;

      const coTags = search.filters && search.filters.tag ? search.filters.tag : {};

      if (search.results.length > 0) {
        Promise.all(
          search.results.slice(0, this.MAX_RESULTS).map(r => r.data())
        ).then(dataList => {
          if (gen !== this.generation) return;

          const tagBarHtml = this._renderCoTagBar(coTags, typing);
          if (tagBarHtml) {
            html += `<li class="co-tag-bar">${tagBarHtml}</li>`;
          }

          html += `<li class="result-group-label">文章 (${search.results.length})</li>`;
          html += this._renderResultItems(dataList);
          this._showResults(html);
        });
      } else if (html) {
        this._showResults(html);
      } else {
        this._showNoResults();
      }
    });
  }

  _renderCoTagBar(coTags, typing) {
    const entries = Object.entries(coTags)
      .filter(([name, count]) => {
        if (count <= 0) return false;
        if (this.selectedTags.indexOf(name) !== -1) return false;
        if (typing) return this._matchesWordPrefix(name, typing);
        return true;
      })
      .sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) return '';

    let html = '';
    for (const [tag, count] of entries) {
      html += `<span class="co-tag-chip" data-tag="${this._escapeHtml(tag)}">` +
        `${this._escapeHtml(tag)} <span class="co-tag-count">${count}</span></span>`;
    }
    return html;
  }

  _showAllTags(filters) {
    if (!filters) {
      this._showNoResults();
      return;
    }
    const sorted = Object.entries(filters)
      .filter(([name, count]) => this.selectedTags.indexOf(name) === -1 && count > 0)
      .sort((a, b) => b[1] - a[1]);

    let html = '';
    for (const [tag, count] of sorted) {
      html += `<span class="co-tag-chip" data-tag="${this._escapeHtml(tag)}">` +
        `${this._escapeHtml(tag)} <span class="co-tag-count">${count}</span></span>`;
    }
    if (html) {
      this._showResults(`<li class="co-tag-bar">${html}</li>`);
    } else {
      this._showNoResults();
    }
  }

  // ======================
  // Type mode search
  // ======================

  _searchByType(query, type, gen) {
    const searchTerm = query.trim() || null;
    this.pagefind.search(searchTerm, { filters: { type: [type] } }).then(search => {
      if (gen !== this.generation) return;
      if (search === null) return;
      if (search.results.length === 0) {
        this._showNoResults();
        return;
      }
      Promise.all(
        search.results.slice(0, this.MAX_RESULTS).map(r => r.data())
      ).then(dataList => {
        if (gen !== this.generation) return;
        this._showResults(this._renderResultItems(dataList));
      });
    });
  }

  // ======================
  // Global search
  // ======================

  _searchGlobal(query, gen) {
    this.pagefind.debouncedSearch(query).then(search => {
      if (gen !== this.generation) return;
      if (search === null) return;
      if (search.results.length === 0) {
        this._showNoResults();
        return;
      }
      Promise.all(
        search.results.slice(0, this.MAX_RESULTS).map(r => r.data())
      ).then(dataList => {
        if (gen !== this.generation) return;
        this._showResults(this._renderResultItems(dataList));
      });
    });
  }

  // ======================
  // Render result items
  // ======================

  _renderResultItems(dataList) {
    let html = '';
    for (const data of dataList) {
      const title = (data.meta && data.meta.title) || '无标题';
      const excerpt = data.excerpt || '';
      const icon = this._getTypeIcon(data.filters);

      html += `<li><a href="${data.url}" tabindex="0" class="search-result-item">` +
        `<span class="result-icon">${icon}</span>` +
        `<span class="title">${title}</span>` +
        (excerpt ? `<br /><span class="sc">${excerpt}</span>` : '') +
        `</a></li>`;
    }
    return html;
  }

  _getTypeIcon(filters) {
    if (filters && filters.type) {
      const types = Object.keys(filters.type);
      if (types.indexOf('slide') !== -1) return '𝄞';
    }
    return '𝄢';
  }

  // ======================
  // Utility
  // ======================

  _matchesWordPrefix(tagName, typing) {
    const t = typing.toLowerCase();
    const words = tagName.toLowerCase().split(/[\s\-_]+/);
    return words.some(w => w.startsWith(t));
  }

  _escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ======================
  // Event binding
  // ======================

  _bindEvents() {
    const self = this;

    // Click handler (delegation on document)
    document.addEventListener('click', e => {
      const target = e.target;
      if (self.els.trigger === target || self.els.trigger.contains(target)) {
        self.show();
      } else if (self.els.search === target || self.els.search.contains(target)) {
        if (!target.closest('a') && !target.closest('.chip-remove')) {
          self.els.input.focus();
        }
      } else if (self.visible) {
        self.close();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      // CMD-/ to show/hide
      if (e.metaKey && e.which === 191) {
        self.show();
      }

      // ESC to close
      if (e.keyCode === 27 && self.visible) {
        self.close();
      }

      // Enter on result item
      if (e.keyCode === 13 && self.visible) {
        const focused = document.activeElement;
        if (focused && focused.closest && focused.closest('#searchResults')) {
          e.preventDefault();
          focused.click();
        }
      }

      // Arrow key navigation
      if (self.visible && self.resultsAvailable) {
        const links = Array.from(document.querySelectorAll('#searchResults li a'));
        const currentIndex = links.indexOf(document.activeElement);

        if (e.keyCode === 40) { // DOWN
          e.preventDefault();
          if (currentIndex === -1) {
            if (links[0]) links[0].focus();
          } else if (currentIndex < links.length - 1) {
            links[currentIndex + 1].focus();
          }
        }

        if (e.keyCode === 38) { // UP
          e.preventDefault();
          if (currentIndex === 0) {
            self.els.input.focus();
          } else if (currentIndex > 0) {
            links[currentIndex - 1].focus();
          }
        }
      }
    });

    // Input keydown (backspace to remove chips)
    self.els.input.addEventListener('keydown', e => {
      if (e.keyCode === 8 && self.els.input.value === '' && self.activeMode) {
        e.preventDefault();
        self._removeLastChip();
      }
    });

    // Input event (prefix detection, auto-add tag)
    self.els.input.addEventListener('input', () => {
      const val = self.els.input.value;

      // Detect prefix typed
      if (!self.activeMode) {
        for (const prefix of self.PREFIXES) {
          if (val === prefix + ' ') {
            self.enterMode(prefix);
            self.els.input.value = '';
            break;
          }
        }
      }

      // In tag mode: space triggers auto-add
      if (self.activeMode === 'tag' && val.endsWith(' ') && self.tagFilters) {
        const typed = val.slice(0, -1).trim();
        if (typed) {
          const match = Object.keys(self.tagFilters).find(
            t => t.toLowerCase() === typed.toLowerCase()
          );
          if (match) {
            self.addChip(match);
            self.els.input.value = '';
            return;
          }
        }
      }

      self._triggerSearch();
    });

    // Event delegation for search results (tag chips + tag list items)
    self.els.results.addEventListener('click', e => {
      const chip = e.target.closest('.co-tag-chip');
      if (chip) {
        e.stopPropagation();
        e.preventDefault();
        self.addChip(chip.getAttribute('data-tag'));
        self.els.input.focus();
        return;
      }
      const item = e.target.closest('.tag-select-item');
      if (item) {
        e.stopPropagation();
        e.preventDefault();
        self.addChip(item.getAttribute('data-tag'));
        self.els.input.focus();
      }
    });

    // Event delegation for chip removal (replaces inline onclick)
    self.els.chips.addEventListener('click', e => {
      const removeBtn = e.target.closest('.chip-remove');
      if (removeBtn) {
        const tag = removeBtn.getAttribute('data-remove-tag');
        if (tag) self.removeChip(tag);
      }
    });
  }
}

// Instantiate and expose global interface for external callers
const searchManager = new SearchManager();
window.showSearchInput = () => searchManager.show();
window.fillTag = (tag) => searchManager.fillTag(tag);
