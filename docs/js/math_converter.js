document.addEventListener("DOMContentLoaded", function () {
// 获取所有页面的文本节点
const elements = document.body.querySelectorAll("*:not(script):not(style)");

elements.forEach((element) => {
    // 替换块级公式 $$...$$
    element.innerHTML = element.innerHTML.replace(
    /\$\$(.+?)\$\$/gs, // 正则匹配 $$...$$ 中的内容
    '<div class="math-block">$$$1$$</div>'
    );

    // 替换行内公式 $...$
    element.innerHTML = element.innerHTML.replace(
    /\$(.+?)\$/g, // 正则匹配 $...$ 中的内容
    '<span class="math-inline">$$$1$$</span>'
    );
});
});