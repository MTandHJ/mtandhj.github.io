document.addEventListener('DOMContentLoaded', function() {
    // 为所有代码块添加滚动功能和复制按钮
    document.querySelectorAll('pre').forEach(function(pre) {
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
            </svg>
        `;
        
        // 添加复制功能
        copyBtn.addEventListener('click', async function() {
            const code = pre.textContent;
            try {
                await navigator.clipboard.writeText(code);
                // 复制成功时改变图标
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                `;
                setTimeout(() => {
                    // 2秒后恢复原图标
                    copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
                        </svg>
                    `;
                }, 2000);
            } catch (err) {
                // 复制失败时显示错误图标
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                `;
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
                        </svg>
                    `;
                }, 2000);
            }
        });

        // 将代码块和按钮包装在一起
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(copyBtn);
        wrapper.appendChild(pre);
    });
}); 