---
date: "2025-05-27"
draft: false
title: "环境配置"
description: "个人的环境配置"
author: MTandHJ
tags:
  - Doc
  - Trick
  - Git
pinned: true
---


## Prompt

### 翻译

````text
### Role

You are a professional academic writing assistant and scientific translator with expertise in both English and Chinese. Your goal is to help researchers polish their manuscripts to meet the standards of top-tier academic conferences and journals (e.g., NeurIPS, ICLR, ICML, Nature, IEEE, ACM).

### Tasks & Instructions

- Whenever given a Chinese text wrapped within quotation marks (""), please provide the corresponding English translation. 
- Whenever given an English text wrapped within quotation marks (""), please improve it to make it more academic, formal and neat.
- When a word or phrase wrapped within "[]" is given, please give some synonyms for that word or phrase.

### Examples

User: "近年来, 已经有许多相关方法被提出."
Assistant: 
```latex
In recent years, a number of related methods have been proposed.
```
User: [a number of]
Assistant: 
```latex
- numerous (adj. 众多的, 许多的): There are **numerous** methods in which to do this. 
- many (adj. 许多的): **Many** scholars have argued thus.
```
User: [利用]
Assistant: 
```latex
- use (v. 用, 使用, 利用): They **use** a lot of big words.
- employ (v. 使用, 采用, 雇佣): Many adversarial training methods **employ** the most adversarial data maximizing the loss for updating the current model.
- adopt (v. 采纳, 采取, 接受): There is little or no incentive to **adopt** such measures.
```
````


## VSCode

### 基本配置

```json
{
    // ==========================================
    // 1. 编辑器基础设置 (General Editor)
    // ==========================================
    "editor.fontSize": 14,
    "editor.lineNumbers": "on",
    "editor.rulers": [],
    "editor.accessibilitySupport": "off",
    "editor.experimentalEditContextEnabled": false,
    "files.autoSave": "afterDelay",
    "update.mode": "manual",
    "workbench.colorTheme": "Solarized-light",
    "workbench.activityBar.location": "bottom",
    "explorer.confirmDelete": false,
    "explorer.confirmDragAndDrop": false,
    "security.workspace.trust.untrustedFiles": "open",
    "security.promptForLocalFileProtocolHandling": false,
    "search.followSymlinks": false,

    // ==========================================
    // 2. 编程语言 & 语法高亮 (Languages & Theming)
    // ==========================================
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": "keyword.control.flow.python",
                "settings": {
                    "foreground": "#FF6E6E",
                    "fontStyle": "bold"
                }
            },
            {
                "name": "Function/Method names",
                "scope": [
                    "entity.name.function",
                    "meta.function-call.generic",
                    "support.function"
                ],
                "settings": {
                    "foreground": "#FFAA5A"
                }
            }
        ]
    },
    "[python]": {
        "editor.wordBasedSuggestions": "off"
    },

    // ==========================================
    // 3. Vim 模拟器配置 (Vim Emulation)
    // ==========================================
    "vim.leader": ",",
    "vim.easymotion": true,
    "vim.incsearch": true,
    "vim.useSystemClipboard": true,
    "vim.useCtrlKeys": true,
    "vim.hlsearch": true,
    "vim.handleKeys": {
        "<C-a>": false,
        "<C-f>": false
    },
    // 插入模式快捷键 (jk 退出插入模式)
    "vim.insertModeKeyBindings": [
        {
            "before": ["j", "k"],
            "after": ["<Esc>"]
        }
    ],
    // 普通模式快捷键
    "vim.normalModeKeyBindingsNonRecursive": [
        {
            "before": ["<leader>", "d"],
            "after": ["d", "d"]
        },
        {
            "before": ["<C-n>"],
            "commands": [":nohl"]
        },
        {
            "before": ["E"],
            "after": ["g", "t"]
        },
        {
            "before": ["L"],
            "after": ["$"]
        },
        {
            "before": ["H"],
            "after": ["^"]
        }
    ],
    "vim.normalModeKeyBindings": [
        {
            "before": ["Z", "Z"],
            "commands": [":wq"]
        }
    ],
    // 可视模式快捷键
    "vim.visualModeKeyBindings": [
        {
            "before": [">"],
            "commands": ["editor.action.indentLines"]
        },
        {
            "before": ["<"],
            "commands": ["editor.action.outdentLines"]
        }
    ],
    "vim.visualModeKeyBindingsNonRecursive": [
        {
            "before": ["p"],
            "after": ["p", "g", "v", "y"] // 粘贴后不丢失寄存器内容
        }
    ],
    // 算子模式
    "vim.operatorPendingModeKeyBindings": [
        {
            "before": ["L"],
            "after": ["$"]
        },
        {
            "before": ["H"],
            "after": ["^"]
        }
    ],
    // 自动切换输入法 (Mac im-select)
    "vim.autoSwitchInputMethod.enable": true,
    "vim.autoSwitchInputMethod.defaultIM": "com.apple.keylayout.ABC",
    "vim.autoSwitchInputMethod.obtainIMCmd": "/usr/local/bin/im-select",
    "vim.autoSwitchInputMethod.switchIMCmd": "/usr/local/bin/im-select {im}",

    // ==========================================
    // 4. LaTeX 配置 (Latex Workshop)
    // ==========================================
    "latex-workshop.latex.autoBuild.run": "never",
    "latex-workshop.message.error.show": false,
    "latex-workshop.message.warning.show": false,
    "latex-workshop.showContextMenu": true,
    "latex-workshop.intellisense.package.enabled": true,
    "latex-workshop.view.pdf.internal.synctex.keybinding": "double-click",
    
    // 编译工具配置
    "latex-workshop.latex.tools": [
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": ["-synctex=1", "-interaction=nonstopmode", "-file-line-error", "%DOCFILE%"]
        },
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": ["-synctex=1", "-interaction=nonstopmode", "-file-line-error", "%DOCFILE%"]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": ["%DOCFILE%"]
        },
        {
            "name": "biber",
            "command": "biber",
            "args": ["%DOCFILE%"]
        }
    ],
    // 编译方案 (Recipe)
    "latex-workshop.latex.recipes": [
        {
            "name": "pbibpp",
            "tools": ["pdflatex", "bibtex", "pdflatex", "pdflatex"]
        }
    ],
    // 辅助文件清理
    "latex-workshop.latex.clean.fileTypes": [
        "*.aux", "*.bbl", "*.blg", "*.idx", "*.ind", "*.lof", "*.lot", "*.out", "*.toc", "*.acn", "*.acr", "*.alg", "*.glg", "*.glo", "*.gls", "*.ist", "*.fls", "*.log", "*.fdb_latexmk"
    ],
    "latex-workshop.latex.autoClean.run": "onFailed",
    // 外部 PDF 查看器 (SumatraPDF)
    "latex-workshop.view.pdf.viewer": "external",
    "latex-workshop.view.pdf.ref.viewer": "auto",
    "latex-workshop.view.pdf.external.viewer.command": "E:/SumatraPDF/SumatraPDF.exe",
    "latex-workshop.view.pdf.external.viewer.args": ["%PDF%"],
    "latex-workshop.view.pdf.external.synctex.command": "E:/SumatraPDF/SumatraPDF.exe",
    "latex-workshop.view.pdf.external.synctex.args": [
        "-forward-search",
        "%TEX%",
        "%LINE%",
        "-reuse-instance",
        "-inverse-search",
        "\"E:/Microsoft VS Code/Code.exe\" \"E:/Microsoft VS Code/resources/app/out/cli.js\" -r -g \"%f:%l\"",
        "%PDF%"
    ],

    // ==========================================
    // 5. Jupyter Notebook & 数据科学 (Data Science)
    // ==========================================
    "notebook.lineNumbers": "on",
    "notebook.confirmDeleteRunningCell": false,
    "workbench.editorAssociations": {
        "*.ipynb": "jupyter-notebook"
    },
    "jupyter.interactiveWindow.textEditor.executeSelection": false,
    "jupyter.interactiveWindow.creationMode": "perFile",

    // ==========================================
    // 6. 远程开发 & 终端 (Remote SSH & Terminal)
    // ==========================================
    "terminal.integrated.enableMultiLinePasteWarning": "never",
    "terminal.integrated.defaultProfile.windows": "Command Prompt",

    // ==========================================
    // 7. 版本控制 (Git)
    // ==========================================
    "git.confirmSync": false,
    "git.autofetch": true,
    "git.ignoreMissingGitWarning": true,

    // ==========================================
    // 8. Markdown & 图片托管 (Markdown & Assets)
    // ==========================================
    "markdown-preview-github-styles.colorTheme": "light",
    "markdown-preview-enhanced.enablePreviewZenMode": false,
    "pasteImage.path": "${currentFileDir}/${currentFileNameWithoutExt}",
    "picgo.picBed.current": "github",
    "picgo.picBed.github.repo": "MTandHJ/blog_source",
    "picgo.picBed.uploader": "github",
    "picgo.picBed.github.branch": "master",
    "picgo.picBed.github.path": "images/",

    // ==========================================
    // 9. AI 辅助 (Copilot)
    // ==========================================
    "github.copilot.enable": {
        "*": false,
        "plaintext": false,
        "markdown": false,
        "scminput": false,
        "python": false
    }
}
```

### Remote 免密登录

- 在远程服务器上执行如下命令 (`<id_rsa.pub>` 替换为个人的 .ssh 下的公钥):

```bash
cd ~
mkdir ./.ssh
echo "<id_rsa.pub>" >> ./.ssh/authorized_keys
chmod 600 ./.ssh/authorized_keys
chmod 700 ./.ssh
```

### 本地清理服务器 ssh 指纹

- 服务器重装系统后 ssh 指纹会发生更改, 此时需要通过如下命令删除 `known_hosts`

```bash
# windows 终端
ssh-keygen -R [服务器IP地址]
```

### Latex

#### Windows

- [MikTex](https://miktex.org/download):
  1. 设置 'Install missing packages' 为 'Yes'.

#### Mac

- 该文件需通过 `command + shift + p` 放入工作区设置 (即仅在当前目录下生效).

```json
{
    "latex-workshop.latex.tools": [
        {
          "name": "xelatex",
          "command": "xelatex",
          "args": [
            "-synctex=1",
            "-interaction=nonstopmode",
            "-file-line-error",
            "%DOC%"
          ]
        },
        {
          "name": "pdflatex",
          "command": "pdflatex",
          "args": [
            "-synctex=1",
            "-interaction=nonstopmode",
            "-file-line-error",
            "%DOC%"
          ]
        },
        {
          "name": "latexmk",
          "command": "latexmk",
          "args": [
            "-synctex=1",
            "-interaction=nonstopmode",
            "-file-line-error",
            "-pdf",
            "%DOC%"
          ]
        },
        {
          "name": "bibtex",
          "command": "bibtex",
          "args": [
            "%DOCFILE%"
          ]
        }
      ],

      "latex-workshop.latex.recipes": [

        {
          "name": "XeLaTeX",
          "tools": [
            "xelatex"
          ]
        },

        // {
        //   "name": "PDFLaTeX",
        //   "tools": [
        //     "pdflatex"
        //   ]
        // },
        // {
        //   "name": "latexmk",
        //   "tools": [
        //     "latexmk"
        //   ]
        // },
        // {
        //   "name": "BibTeX",
        //   "tools": [
        //     "bibtex"
        //   ]
        // },
        {
          "name": "xelatex -> bibtex -> xelatex*2",
          "tools": [
            "xelatex",
            "bibtex",
            "xelatex",
            "xelatex"
          ]
        },
        // {
        //   "name": "pdflatex -> bibtex -> pdflatex*2",
        //   "tools": [
        //     "pdflatex",
        //     "bibtex",
        //     "pdflatex",
        //     "pdflatex"
        //   ]
        // },
    ],
    "latex-workshop.view.pdf.viewer": "external",
    "latex-workshop.latex.autoBuild.run": "never",
    "latex-workshop.view.pdf.external.synctex.command": "/Applications/Skim.app/Contents/SharedSupport/displayline",
    "latex-workshop.view.pdf.external.synctex.args": [
        "-r",
        "%LINE%",
        "%PDF%",
        "%TEX%"
    ],

    "latex-workshop.view.pdf.external.viewer.command": "/Applications/Skim.app/Contents/SharedSupport/displayline",
    "latex-workshop.view.pdf.external.viewer.args": [
        "0",
        "%PDF%",
    ],
}

```


## uv

[Ahaknow-从 Conda 到 uv：现代化 Python 开发迁移指南](https://blog.ahaknow.com/posts/aiknow/conda-uv-python/)

### 安装

#### Windows 手动安装

1. 在 [uv-github](https://github.com/astral-sh/uv) 的 release 中下载相应的压缩文件;
2. 解压至某个地方, 例如 `C:\uv` (uv 下应该有 `uv.exe`);
3. 将 `path\to\uv` (`C:\uv`) 加入到环境变量 `Path` 中

### 指令

- (**基础操作**)

|动作|Conda 命令|uv 命令|备注|
|:-:|:-:|:-:|:-:|
|创建环境|`conda create -n myenv`| uv venv| 默认在当前目录下创建 .venv|
|安装 Python|conda install python=3.11|uv python install 3.11|uv 全局管理 Python 版本|
|指定版本创建|conda create -n myenv python=3.10|uv venv --python 3.10||
|激活环境|conda activate myenv|source .venv/bin/activate| Windows: .venv\Scripts\activate|
|退出环境| conda deactivate |deactivate||
|删除环境|conda env remove -n myenv|rm -rf .venv| 直接删文件夹即可|

- (**项目内包管理**)

|动作|Conda 命令|uv 命令|备注|
|:-:|:-:|:-:|:-:|
|初始化项目||uv init|生成 pyproject.toml|
|安装包|conda install numpy|uv add numpy|自动更新 lock 文件|
|安装特定版本|conda install numpy=1.24|uv add "numpy==1.24"||
|卸载包|conda remove numpy|uv remove numpy||
|安装开发依赖||uv add --dev pytest|测试/格式化工具专用|
|列出已安装包|conda list|uv tree|树状显式更清晰|

- (**环境复现与同步**)

|动作|Conda 命令|uv 命令|备注|
|:-:|:-:|:-:|:-:|
|导出依赖|conda env export > env.yml|(自动维护)|uv 自动维护 uv.lock 无需手动导出|
|复现环境|conda env create -f env.yml|uv sync|一键同步|
|更新所有包|conda update --all|uv lock --upgrade|更新 lock 文件中的版本|

## Conda

- 下载后通过如下命令安装

```bash
bash Miniconda3-latest-Linux-x86_64.sh
```

### 清华镜像

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/linux-64/
conda config --set show_channel_urls yes
```


## Pip

### 清华镜像

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```