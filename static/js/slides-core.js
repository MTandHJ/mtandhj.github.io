// --- 自定义标签转换（Reveal.js ready 后执行） ---

function convertCustomTags() {
  document.querySelectorAll('.reveal .slides slide-img').forEach(function (el) {
    var src = el.getAttribute('src') || '';
    var size = el.getAttribute('size') || '80%';
    var div = document.createElement('div');
    div.className = 'slide-img';
    div.innerHTML = '<img src="' + src + '" alt="Image" style="max-width: ' + size + '; height: auto; margin: 0 auto;">';
    el.replaceWith(div);
  });

  document.querySelectorAll('.reveal .slides slide-cols').forEach(function (el) {
    var div = document.createElement('div');
    div.className = 'slide-cols';
    el.querySelectorAll('slide-col').forEach(function (col) {
      var ratio = col.getAttribute('ratio') || '1';
      var colDiv = document.createElement('div');
      colDiv.style.flex = ratio;
      colDiv.innerHTML = col.innerHTML;
      col.replaceWith(colDiv);
    });
    div.innerHTML = el.innerHTML;
    el.replaceWith(div);
  });

  document.querySelectorAll('.reveal .slides slide-ref').forEach(function (el) {
    var lines = el.textContent.split('\n').filter(function (l) { return l.trim(); });
    var div = document.createElement('div');
    div.className = 'slide-ref';
    var html = '<div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>';
    lines.forEach(function (line) {
      html += '<p style="margin: 2px 0;">' + line.trim() + '</p>';
    });
    div.innerHTML = html;
    el.replaceWith(div);
  });

  document.querySelectorAll('.reveal .slides slide-highlight').forEach(function (el) {
    var div = document.createElement('div');
    div.className = 'slide-highlight';
    div.innerHTML = el.innerHTML;
    el.replaceWith(div);
  });
}

// --- slide-section 转换（Reveal.js 初始化前执行） ---

document.querySelectorAll('.reveal .slides slide-section').forEach(function (el) {
  var section = document.createElement('section');
  section.setAttribute('data-markdown', '');
  var textarea = document.createElement('textarea');
  textarea.setAttribute('data-template', '');
  textarea.textContent = el.innerHTML;
  section.appendChild(textarea);
  el.replaceWith(section);
});

// --- Reveal.js 初始化 ---

Reveal.initialize({
  embedded: true,
  hash: true,
  slideNumber: true,
  navigationMode: 'linear',
  transition: 'slide',
  controls: true,
  progress: true,
  margin: 0.1,
  width: 1100,
  minScale: 0.2,
  maxScale: 2.0,
  viewDistance: 3,
  overview: false,
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
  markdown: { smartypants: true, gfm: true },
  mouseWheel: true,
  click: false,
});

var layoutRaf = null;
function scheduleRevealLayout() {
  if (typeof Reveal === 'undefined' || !Reveal.layout) return;
  if (layoutRaf) cancelAnimationFrame(layoutRaf);
  layoutRaf = requestAnimationFrame(function () {
    layoutRaf = null;
    Reveal.layout();
  });
}

var slideMathOpt = {
  delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false},
    {left: '\\[', right: '\\]', display: true},
    {left: '\\(', right: '\\)', display: false}
  ]
};
function renderSlideMath() {
  if (typeof renderMathInElement !== 'function') return;
  var el = document.querySelector('.reveal .slides');
  if (!el) return;
  renderMathInElement(el, slideMathOpt);
  scheduleRevealLayout();
}
Reveal.on('ready', function () {
  convertCustomTags();
  scheduleRevealLayout();
  setTimeout(renderSlideMath, 80);
});
Reveal.on('slidechanged', function () { requestAnimationFrame(renderSlideMath); });
