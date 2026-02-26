---
date: "2026-02-26"
draft: false
title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering"
description: "定制化 Agent-Computer Interface"
author: MTandHJ
tags:
  - Note
  - Code
  - AI Software Engineering
  - Agent
  - Empirical
  - NeurIPS
  - 2024
pinned: false
---

## 预备知识

- (**AI Software Engineering**) AI Software Engineering 已经从简单的"提需求 -> 代码生成"过渡到了"独自攻克 Repository-level 问题".

- (**Agent**) 为了解决更加复杂的问题, 往往依赖 Agent 的多轮交互能力, 然而目前的 Shell 或者 IDE 都是为了 Human 设计的, 充斥着很多"冗余"的设计, 比如一些语法检查通常以可视化的方式呈现.

## 核心思想

![20260226175203](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226175203.png)

![20260226175300](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226175300.png)

- (**Motivation**) 为了方便人类开发, 设计了很多人类友好的 Shell 和 IDEs, 现在逐渐火热的 LM Agent 本质上是一类特别的用户, 虽然也能和 Shell/IDE 产生交互, 但是往往存在很多噪声: 一方面, LM 缺少像人类一样强大的视觉系统, 难以获得高效的视觉反馈, 另一方面, Shell 中的文本反馈也往往呈现驳杂的特点, 导致过于冗长的上下文, 从而影响 LM Agent 的发挥. 因此, 本文认为应该像设计 IDE 那样为 LM Agent 设计专门的开发环境, 以便其处理代码任务, 有如下几条核心原则:
    1. Actions should be simple and easy to understand for agents.
    2. Actions should be compact and efficient.
    3. Environment feedback should be informative but concise.
    4. Guardrails mitigate error propagation and hasten recovery.

- 总而言之, ACIs 的设计需要高效简练且有兜底机制.

### SWE-Agent

#### Prompt Workflow

![20260226180303](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226180303.png)


- 整个 SWE-Agent 的流程如下:
    1. **初始化:** 这部分通过 System, Demonstration, Instance prompts 来给出设定任务和具体的指令;
    2. LM Agent 生成 "Thought & Action";
    3. 执行 "Action", 并根据执行结果匹配相应的反馈模板;
    4. 判断是否完成, 否则回到 Step 2.


#### Configuration

![20260226195040](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226195040.png)

- (**Action**) 除了一般的 Shell 命令外, 额外实现了如下定制化的指令:
    1. **Search and navigation:** 虽然 find, grep 等命令也可以用于搜索和定位, 但是其输出结果往往过于冗杂, 因此 SWE-Agent 额外设计了 find_file, search_file, search_dir, 返回最多 50 个文件, 如果超出限制, 输出反馈将建议 LM Agent 给出更加明确的 query;
    2. **File viewer:** 类似的, 为了避免显示过多的内容, 特别设计的文件查看 Action 具有如下特点:
        - 'open': 展示最多 100 行的内容, 其余内容被折叠;
        - 'scroll_down', 'scroll_up': 允许 LM Agent 上下滚动查看更多的内容;
        - 'goto': 允许 LM Agent 跳转至特定行;
    3. **File editor:** 'edit' 要求 LM Agent 给出起始和结束行号和相应的修改内容, 更适合 LM Agent 操作, 同时会进行语法检查, 若语法检查失败会直接进行错误反馈.
    4. **全局变量:** 此外, 在配置阶段, 会设定一些全局变量以供 Action 调用.


### 实验

![20260226194712](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226194712.png)

- 上表展示了对于不同 Action 进行修改的一个消融实验, 验证了 "总结性 search", "有限文件查看", "有限历史展示" 的有效性.

![20260226194846](https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20260226194846.png)

- 作者团队还检查了不同轮次各 Action 的调用频率, 发现 'create' 在起始轮次经常出现, 即 LM Agent 倾向于创建文件以复现 issue

## Prompts


````yaml
# This is the configuration from SWE-agent 0.7
agent:
  templates:
    system_template: |-
      SETTING: You are an autonomous programmer, and you're working directly in the command line with a special interface.

      The special interface consists of a file editor that shows you {{WINDOW}} lines of a file at a time.
      In addition to typical bash commands, you can also use the following commands to help you navigate and edit files.

      COMMANDS:
      {{command_docs}}

      Please note that THE EDIT COMMAND REQUIRES PROPER INDENTATION.
      If you'd like to add the line '        print(x)' you must fully write that out, with all those spaces before the code! Indentation is important and code that is not indented correctly will fail and require fixing before it can be run.

      RESPONSE FORMAT:
      Your shell prompt is formatted as follows:
      (Open file: <path>) <cwd> $

      You need to format your output using two fields; discussion and command.
      Your output should always include _one_ discussion and _one_ command field EXACTLY as in the following example:
      DISCUSSION
      First I'll start by using ls to see what files are in the current directory. Then maybe we can look at some relevant files to see what they look like.
      ```
      ls -a
      ```

      You should only include a *SINGLE* command in the command section and then wait for a response from the shell before continuing with more discussion and commands. Everything you include in the DISCUSSION section will be saved for future reference.
      If you'd like to issue two commands at once, PLEASE DO NOT DO THAT! Please instead first submit just the first command, and then after receiving a response you'll be able to issue the second command.
      You're free to use any other bash commands you want (e.g. find, grep, cat, ls, cd) in addition to the special commands listed above.
      However, the environment does NOT support interactive session commands (e.g. python, vim), so please do not invoke them.
    instance_template: |-
      We're currently solving the following issue within our repository. Here's the issue text:
      ISSUE:
      {{problem_statement}}

      INSTRUCTIONS:
      Now, you're going to solve this issue on your own. Your terminal session has started and you're in the repository's root directory. You can use any bash commands or the special interface to help you. Edit all the files you need to and run any checks or tests that you want.
      Remember, YOU CAN ONLY ENTER ONE COMMAND AT A TIME. You should always wait for feedback after every command.
      When you're satisfied with all of the changes you've made, you can submit your changes to the code base by simply running the submit command.
      Note however that you cannot use any interactive session commands (e.g. python, vim) in this environment, but you can write scripts and run them. E.g. you can write a python script and then run it with `python <script_name>.py`.

      NOTE ABOUT THE EDIT COMMAND: Indentation really matters! When editing a file, make sure to insert appropriate indentation before each line!

      IMPORTANT TIPS:
      1. Always start by trying to replicate the bug that the issues discusses.
        If the issue includes code for reproducing the bug, we recommend that you re-implement that in your environment, and run it to make sure you can reproduce the bug.
        Then start trying to fix it.
        When you think you've fixed the bug, re-run the bug reproduction script to make sure that the bug has indeed been fixed.

        If the bug reproduction script does not print anything when it successfully runs, we recommend adding a print("Script completed successfully, no errors.") command at the end of the file,
        so that you can be sure that the script indeed ran fine all the way through.

      2. If you run a command and it doesn't work, try running a different command. A command that did not work once will not work the second time unless you modify it!

      3. If you open a file and need to get to an area around a specific line that is not in the first 100 lines, say line 583, don't just use the scroll_down command multiple times. Instead, use the goto 583 command. It's much quicker.

      4. If the bug reproduction script requires inputting/reading a specific file, such as buggy-input.png, and you'd like to understand how to input that file, conduct a search in the existing repo code, to see whether someone else has already done that. Do this by running the command: find_file "buggy-input.png" If that doesn't work, use the linux 'find' command.

      5. Always make sure to look at the currently open file and the current working directory (which appears right after the currently open file). The currently open file might be in a different directory than the working directory! Note that some commands, such as 'create', open files, so they might change the current  open file.

      6. When editing files, it is easy to accidentally specify a wrong line number or to write code with incorrect indentation. Always check the code after you issue an edit to make sure that it reflects what you wanted to accomplish. If it didn't, issue another command to fix it.


      (Open file: {{open_file}})
      (Current directory: {{working_dir}})
      bash-$
    next_step_template: |-
      {{observation}}
      (Open file: {{open_file}})
      (Current directory: {{working_dir}})
      bash-$
    next_step_no_output_template: |-
      Your command ran successfully and did not produce any output.
      (Open file: {{open_file}})
      (Current directory: {{working_dir}})
      bash-$
    demonstration_template: |
      Here is a demonstration of how to correctly accomplish this task.
      It is included to show you how to correctly use the interface.
      You do not need to follow exactly what is done in the demonstration.
      --- DEMONSTRATION ---
      {{demonstration}}
      --- END OF DEMONSTRATION ---
    demonstrations:
      - trajectories/demonstrations/replay__marshmallow-code__marshmallow-1867__default_sys-env_window100__t-0.20__p-0.95__c-2.00__install-1/marshmallow-code__marshmallow-1867.traj
  tools:
    env_variables:
      WINDOW: 100
      OVERLAP: 2
    bundles:
      - path: tools/registry
      - path: tools/windowed
      - path: tools/search
      - path: tools/windowed_edit_linting
      - path: tools/submit
    parse_function:
      type: thought_action
  history_processors:
    - type: last_n_observations
      n: 5
````

### System Template

- System Template 定义了基本的任务定义和输入输出规范


````markdown
**SETTING:** You are an autonomous programmer, and you’re working directly in the command line with a  special interface.  The special interface consists of a file editor that shows you 100 lines of a file at a time. In addition to  typical bash commands, you can also use the following commands to help you navigate and edit files. 
**COMMANDS:** {documentation}  
Please note that THE EDIT COMMAND REQUIRES PROPER INDENTATION. If you’d like to add the  line ‘ print(x)’ you must fully write that out, with all those spaces before the code! Indentation is  important and code that is not indented correctly will fail and require fixing before it can be run.  
**RESPONSE FORMAT:**
Your shell prompt is formatted as follows:  
(Open file: <path>) <cwd> $  
You need to format your output using two fields; discussion and command. Your output should always  include one discussion and one command field EXACTLY as in the following example:
DISCUSSION  
First I’ll start by using ls to see what files are in the current directory. Then maybe we can look at some  relevant files to see what they look like.  
```
ls -a  
```
You should only include a SINGLE command in the command section and then wait for a response from the  shell before continuing with more discussion and commands. Everything you include in the DISCUSSION  section will be saved for future reference. If you’d like to issue two commands at once, PLEASE DO NOT  DO THAT! Please instead first submit just the first command, and then after receiving a response you’ll be  able to issue the second command. You’re free to use any other bash commands you want (e.g. find, grep,  cat, ls, cd) in addition to the special commands listed above. However, the environment does NOT support  interactive session commands (e.g. python, vim), so please do not invoke them.
````

### Demonstration Template

- Demonstration Template 提供了一次示例 (交互轨迹), 这个是可选的, 有时提供了并非是好事.

````markdown
Here is a demonstration of how to correctly accomplish this task. It is included to show you how to correctly use the interface. You do not need to follow exactly what is done in the demonstration.
--- DEMONSTRATION --
{{INSTANCE PROMPT}}

The code has been updated to use the `round` function, which should fix the rounding issue. Before submitting the changes, it would be prudent to run the reproduce.py code again to ensure that this change has the desired effect. I see that "Current directory" is still `/marshmallow-code__marshmallow`, so we can just run `reproduce.py` directly.

```
python reproduce.py
```
345

(Open file: /marshmallow-code__marshmallow/src/marshmallow/fields.py)
(Current directory: /marshmallow-code__marshmallow)
bash-$
The output has changed from 344 to 345, which suggests that the rounding issue has been fixed. Let's remove the reproduce.py file since it is no longer needed.
```
rm reproduce.py
``` 
Your command ran successfully and did not produce any output.
(Open file: /marshmallow-code__marshmallow/src/marshmallow/fields.py)
(Current directory: /marshmallow-code__marshmallow)
bash-$
rm doesn't have any output when it deletes successfully, so that must have worked. Now that we have fixed the issue, we should submit our changes to the code base. Let's submit the changes using the `submit` command.
``` 
submit
```
--- END OF DEMONSTRATION --
````

### Instance Template

- Instance Template 介绍任务实例 (比如, issue 的介绍), 再一次强调一些指令的用法和注意事项, 增强 LM Agent 的指令跟随, 提高正确解决问题的概率.

````markdown
We're currently solving the following issue within our repository. Here's the issue text:
ISSUE: 
{issue}
INSTRUCTIONS:
Now, you're going to solve this issue on your own. Your terminal session has started and you're in the repository's root directory. You can use any bash commands or the special interface to help you. Edit all the files you need to and run any checks or tests that you want. Remember, YOU CAN ONLY ENTER ONE COMMAND AT A TIME. You should always wait for feedback after every command. When you're satisfied with all of the changes you've made, you can submit your changes to the code base by simply running the submit command. Note however that you cannot use any interactive session commands (e.g. python, vim) in this environment, but you can write scripts and run them. E.g. you can write a python script and then run it with `python <script_name>.py`.

NOTE ABOUT THE EDIT COMMAND: Indentation really matters! When editing a file, make sure to insert appropriate indentation before each line!

IMPORTANT TIPS:
1. Always start by trying to replicate the bug that the issues discusses. If the issue includes code for reproducing the bug, we recommend that you re-implement that in your environment, and run it to make sure you can reproduce the bug. Then start trying to fix it. When you think you've fixed the bug, re-run the bug reproduction script to make sure that the bug has indeed been fixed.

2. If you run a command and it doesn't work, try running a different command. A command that did not work once will not work the second time unless you modify it!

3. If you open a file and need to get to an area around a specific line that is not in the first 100 lines, say line 583, don't just use the scroll_down command multiple times. Instead, use the goto 583 command. It's much quicker.

4. If the bug reproduction script requires inputting/reading a specific file, such as buggy-input.png, and you'd like to understand how to input that file, conduct a search in the existing repo code, to see whether someone else has already done that. Do this by running the command: find_file "buggy-input.png" If that doesn't work, use the linux 'find' command.

5. Always make sure to look at the currently open file and the current working directory (which appears right after the currently open file). The currently open file might be in a different directory than the working directory! Note that some commands, such as 'create', open files, so they might change the current open file.

6. When editing files, it is easy to accidentally specify a wrong line number or to write code with incorrect indentation. Always check the code after you issue an edit to make sure that it reflects what you wanted to accomplish. If it didn't, issue another command to fix it.

(Open file: {open_file})
(Current directory: {working_dir})
bash-$
````

### Next Step Template

- 在 LM Agent 给出 Discussion 和 Acition 后, 倘若没有异常则按照如下模板进行输出:

````markdown
{OBSERVATION}
(Open file: /path/to/open/file.py)
(Current directory: /path/to/cwd)
bash-$
````

注意到, (Open file: ...), (CWD) 始终被最后输出, 以时刻提醒 LM Agent 当前的位置.

### Collapsed Observation Template

- 为了避免过长和过时的历史信息干扰后续判断, 采用折叠的方式展示历史信息 (即只展示历史信息的 lines):

````markdown
Old output omitted (101 lines)
````

### Error Message Template

- 如果 LM Agent 的 response 导致异常, 输出异常信息.


````markdown
Your output was not formatted correctly. You must always include one discussion and one command as part of your response. Make sure you do not have multiple discussion/command tags. 
Please make sure your output precisely matches the following format: 
DISCUSSION 
Discuss here with yourself about what your planning and what you're going to do in this step.

```  
command(s) that you're going to run 
```
````



## 参考文献

<ol class="reference">
  <li>
    Yang J., Jimenez C. E., Wettig A., Lieret K.,
    Yao S., Narasimhan K. and Press O.
    <u>SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering.</u>
    <i>NeurIPS</i>, 2024.
    <a href="http://arxiv.org/abs/2405.15793" style="color: #007acc; font-weight: bold; text-decoration: none;">[PDF]</a>
    <a href="https://www.swebench.com/" style="color: #007acc; font-weight: bold; text-decoration: none;">[Code]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

