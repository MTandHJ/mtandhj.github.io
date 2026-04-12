document.addEventListener('DOMContentLoaded', function () {
  var blocks = document.querySelectorAll('.pyodide-block');
  if (!blocks.length) return;

  var pyodidePromise = null;
  var hljsPromise = null;

  /**
   * Lazy-load highlight.js (singleton).
   *
   * Returns
   * -------
   * Promise<hljs>
   */
  function getHljs() {
    if (!hljsPromise) {
      hljsPromise = new Promise(function (resolve, reject) {
        var isDark = document.documentElement.classList.contains('dark');
        var theme = isDark
          ? 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/monokai.min.css'
          : 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css';

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'hljs-theme';
        link.href = theme;
        document.head.appendChild(link);

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js';
        script.onload = function () { resolve(window.hljs); };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    return hljsPromise;
  }

  /**
   * Apply syntax highlighting to a code element.
   *
   * Parameters
   * ----------
   * codeEl : HTMLElement
   *     The <code> element to highlight.
   */
  function highlightCode(codeEl) {
    getHljs().then(function (hljs) {
      codeEl.className = 'language-python';
      codeEl.removeAttribute('data-highlighted');
      hljs.highlightElement(codeEl);
    });
  }

  // Highlight all pyodide code blocks on page load
  blocks.forEach(function (block) {
    highlightCode(block.querySelector('code'));
  });

  /**
   * Lazy-load Pyodide (singleton). Called on first Run click.
   *
   * Returns
   * -------
   * Promise<PyodideInterface>
   */
  function getPyodide() {
    if (!pyodidePromise) {
      pyodidePromise = (async function () {
        await new Promise(function (resolve, reject) {
          var script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        return await loadPyodide();
      })();
    }
    return pyodidePromise;
  }

  blocks.forEach(function (block) {
    var runBtn = block.querySelector('.pyodide-run-btn');
    var resetBtn = block.querySelector('.pyodide-reset-btn');
    var copyBtn = block.querySelector('.pyodide-copy-btn');
    var codeEl = block.querySelector('code');
    var originalEl = block.querySelector('.pyodide-original');
    var outputEl = block.querySelector('.pyodide-output');

    // --- Run ---
    runBtn.addEventListener('click', async function () {
      runBtn.textContent = '⏳ Loading…';
      runBtn.disabled = true;

      try {
        var py = await getPyodide();
        runBtn.textContent = '⏳ Running…';

        var code = codeEl.textContent;

        await py.loadPackagesFromImports(code);

        // Capture stdout/stderr
        await py.runPythonAsync(
          'import sys, io\n' +
          '_capture_out = io.StringIO()\n' +
          '_capture_err = io.StringIO()\n' +
          'sys.stdout = _capture_out\n' +
          'sys.stderr = _capture_err'
        );

        // Configure matplotlib if used
        var usesMpl = /\bmatplotlib\b/.test(code);
        if (usesMpl) {
          await py.loadPackage('matplotlib');
          await py.runPythonAsync(
            'import matplotlib\n' +
            'matplotlib.use("AGG")\n' +
            'import matplotlib.pyplot as plt\n' +
            'import base64\n' +
            '_mpl_images = []\n' +
            'def _patched_show(*a, **kw):\n' +
            '    buf = io.BytesIO()\n' +
            '    plt.savefig(buf, format="png", bbox_inches="tight", dpi=100)\n' +
            '    buf.seek(0)\n' +
            '    _mpl_images.append(base64.b64encode(buf.read()).decode())\n' +
            '    plt.close("all")\n' +
            'plt.show = _patched_show'
          );
        }

        await py.runPythonAsync(code);

        var stdout = py.runPython('_capture_out.getvalue()');
        var stderr = py.runPython('_capture_err.getvalue()');

        // Restore streams
        py.runPython('sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__');

        // Render output
        outputEl.innerHTML = '';
        outputEl.classList.remove('has-error');

        if (stdout) {
          var pre = document.createElement('pre');
          pre.className = 'pyodide-stdout';
          pre.textContent = stdout;
          outputEl.appendChild(pre);
        }
        if (stderr) {
          var pre = document.createElement('pre');
          pre.className = 'pyodide-stderr';
          pre.textContent = stderr;
          outputEl.appendChild(pre);
        }

        if (usesMpl) {
          var images = py.runPython('_mpl_images').toJs();
          images.forEach(function (b64) {
            var img = document.createElement('img');
            img.src = 'data:image/png;base64,' + b64;
            img.className = 'pyodide-plot';
            outputEl.appendChild(img);
          });
          py.runPython('_mpl_images.clear()');
        }

        outputEl.style.display = outputEl.children.length > 0 ? 'block' : 'none';

      } catch (err) {
        outputEl.innerHTML = '';
        outputEl.classList.add('has-error');
        var pre = document.createElement('pre');
        pre.className = 'pyodide-stderr';
        pre.textContent = err.message || String(err);
        outputEl.appendChild(pre);
        outputEl.style.display = 'block';
      } finally {
        runBtn.textContent = '▶ Run';
        runBtn.disabled = false;
      }
    });

    // --- Copy ---
    var copySvgDefault = copyBtn.innerHTML;
    copyBtn.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';
        setTimeout(function () { copyBtn.innerHTML = copySvgDefault; }, 2000);
      } catch (e) {}
    });

    // --- Reset ---
    resetBtn.addEventListener('click', function () {
      codeEl.textContent = originalEl.textContent;
      highlightCode(codeEl);
      outputEl.innerHTML = '';
      outputEl.style.display = 'none';
      outputEl.classList.remove('has-error');
    });
  });
});
