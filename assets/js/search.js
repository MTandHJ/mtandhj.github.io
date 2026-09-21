class SearchManager {
  constructor() {
    this.pagefind = null;
    this.visible = false;
    this.loadPromise = null;
    this.filterPromise = null;
    this.loadAttempt = 0;
    this.resultsAvailable = false;
    this.tagFilters = null;
    this.activeMode = null;
    this.selectedTags = [];
    this.generation = 0;

    const cfg = window.__searchConfig || {};
    this.MAX_RESULTS = cfg.maxResults || 15;
    this.cacheTag = cfg.cacheTag || '';
    this.isLocalServer = cfg.isLocalServer || false;
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
      trigger: document.getElementById('search-click'),
      status: document.getElementById('searchStatus'),
      retry: document.getElementById('searchRetry')
    };

    this._bindEvents();
    const warmup = () => {
      if (navigator.connection?.saveData) return;
      const load = () => this._loadSearch().catch(() => {});
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(load, { timeout: 3000 });
      } else {
        window.setTimeout(load, 1500);
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', warmup, { once: true });
    } else {
      warmup();
    }
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
    if (!this.visible) {
      this.els.search.style.display = 'block';
      this.els.input.focus();
      this.visible = true;
      this._triggerSearch();
    } else {
      this.close();
    }
  }

  close() {
    this.generation++;
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

  async _triggerSearch() {
    const query = this.els.input.value;
    const gen = ++this.generation;
    this._hideResults();
    this._showStatus(this.pagefind ? '正在搜索...' : '正在加载搜索索引...');

    try {
      await this._loadSearch();
      if (gen !== this.generation) return;
      if (!query.trim() && !this.activeMode) {
        this._showStatus('');
        return;
      }
      let search;
      switch (this.activeMode) {
        case 'tag':
          search = this._searchByTag(query, gen);
          break;
        case 'post':
          search = this._searchByType(query, 'post', gen);
          break;
        case 'slide':
          search = this._searchByType(query, 'slide', gen);
          break;
        default:
          search = this._searchGlobal(query, gen);
      }
      await this._withTimeout(search);
      if (gen === this.generation) this._showStatus('');
    } catch (error) {
      if (gen !== this.generation) return;
      this.generation++;
      const message = this.isLocalServer && !this.pagefind
        ? '本地搜索索引不可用, 请生成索引后重试.'
        : '搜索加载失败或网络超时, 请重试.';
      this.pagefind?.destroy().catch(() => {});
      this.pagefind = null;
      this.loadPromise = null;
      this.filterPromise = null;
      this.tagFilters = null;
      this._showStatus(message, true);
      console.warn('Search failed:', error);
    }
  }

  // ======================
  // Load Pagefind
  // ======================

  _loadSearch() {
    if (!this.loadPromise) {
      const attempt = this.loadAttempt++;
      const suffix = attempt ? `?retry=${attempt}` : '';
      let pf;
      let expired = false;
      this.loadPromise = this._withTimeout((async () => {
        const module = await import(`/pagefind/pagefind.js${suffix}`);
        if (expired) throw new Error('Search initialization expired');
        pf = module.createInstance({
          language: document.documentElement.lang,
          metaCacheTag: this.cacheTag,
          primary: true
        });
        await pf.init();
        if (expired) throw new Error('Search initialization expired');
        await pf.preload('');
        return pf;
      })()).then(pf => {
        this.pagefind = pf;
        return pf;
      }).catch(error => {
        expired = true;
        if (pf) pf.init().then(() => pf.destroy()).catch(() => {});
        this.loadPromise = null;
        throw error;
      });
    }
    return this.loadPromise;
  }

  async _withTimeout(promise) {
    let timer;
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = window.setTimeout(() => reject(new Error('Search timed out')), 15000);
        })
      ]);
    } finally {
      window.clearTimeout(timer);
    }
  }

  _showStatus(message, retry = false) {
    this.els.status.textContent = message;
    this.els.retry.hidden = !retry;
  }

  // ======================
  // Results display
  // ======================

  _showResults(html) {
    const active = this.els.results.contains(document.activeElement)
      ? document.activeElement.getAttribute('href') : null;
    this.els.results.style.display = 'block';
    this.els.results.innerHTML = html;
    this.resultsAvailable = true;
    if (active) {
      Array.from(this.els.results.querySelectorAll('a')).find(
        link => link.getAttribute('href') === active
      )?.focus();
    }
  }

  _hideResults() {
    this.els.results.style.display = 'none';
    this.resultsAvailable = false;
  }

  _showNoResults() {
    this._showResults(`<li class="noSearchResult">${this.NO_RESULTS}</li>`);
    this.resultsAvailable = false;
  }

  // ======================
  // Tag mode search
  // ======================

  async _searchByTag(query, gen) {
    if (!this.tagFilters) {
      if (!this.filterPromise) {
        this.filterPromise = this.pagefind.filters().then(filters => {
          this.tagFilters = filters.tag || {};
        }).catch(error => {
          this.filterPromise = null;
          throw error;
        });
      }
      await this.filterPromise;
      if (gen !== this.generation) return;
    }
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

    const search = await this.pagefind.search(null, { filters: { tag: allTags } });
    if (gen !== this.generation || !search) return;
    const tagBar = this._renderCoTagBar(search.filters?.tag || {}, typing);
    if (tagBar) html += `<li class="co-tag-bar">${tagBar}</li>`;
    if (search.results.length) {
      html += `<li class="result-group-label">文章 (${search.results.length})</li>`;
      await this._loadResultData(search.results, gen, html);
    } else if (html) {
      this._showResults(html);
    } else {
      this._showNoResults();
    }
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

  async _searchByType(query, type, gen) {
    const search = await this.pagefind.debouncedSearch(
      query.trim() || null, { filters: { type: [type] } }, 150
    );
    if (gen !== this.generation || !search) return;
    await this._loadResultData(search.results, gen);
  }

  async _searchGlobal(query, gen) {
    const search = await this.pagefind.debouncedSearch(query, {}, 150);
    if (gen !== this.generation || !search) return;
    await this._loadResultData(search.results, gen);
  }

  async _loadResultData(results, gen, prefix = '') {
    if (!results.length) {
      this._showNoResults();
      return;
    }
    const items = results.slice(0, this.MAX_RESULTS);
    const loaded = new Array(items.length);
    const outcomes = await Promise.allSettled(items.map(async (result, index) => {
      const data = await result.data();
      if (gen !== this.generation) return;
      loaded[index] = data;
      this._showResults(prefix + this._renderResultItems(loaded.filter(Boolean)));
    }));
    const failure = outcomes.find(result => result.status === 'rejected');
    if (failure) throw failure.reason;
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
    self.els.retry.addEventListener('click', () => self._triggerSearch());

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
