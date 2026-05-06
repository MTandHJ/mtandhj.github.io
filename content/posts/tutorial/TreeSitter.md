---
date: "2026-04-12"
draft: false
title: "Tree Sitter"
description: "语法树, Tree Sitter"
author: MTandHJ
tags:
  - Tutorial
  - AI Software Engineering
  - AST
  - Seminal
pinned: false
---

## 基本介绍

- tree-sitter 是一个能够将代码**无损**转换为语法树的工具, 提供了遍历和查询的工具. 因此, 在语法高亮以及现在 AI Code 领域有着广泛的应用. 特别地, tree-sitter 支持增量分析, 即使代码存在语法错误, 依旧可以解析的优势.

- 可以通过一个案例来理解 tree-sitter 的作用, 我们常常会希望从代码中提取特别模块 (比如函数名) 的需求, 虽然可以通过正则表达式来解决特定的需求, 然而这种方式往往依赖于特定的代码, 需要进行专门的设计: 比如, 下列代码也会检索到字符串/注释中的函数名.

    ```python {.run}

    import re
    code = """
    def hello(): pass
    s = "def fake(): pass"
    # def commented(): pass
    """
    print(re.findall(r'def\s+(\w+)', code))
    ```

### 语法树

这里介绍下语法树及其变种, 以如下的源代码为例:

```python
def hello(name): pass
```

语法树的生成依赖 1. 句法分析得到基本的词元; 2. 根据一些特定的语法规则, 形成树形结构.

- (**句法分析 (Lexical Analysis)**)

    ```
    Token 序列:
    [KEYWORD:def] [IDENTIFIER:hello] [LPAREN:(] [IDENTIFIER:name] [RPAREN:)] [COLON::]
    ```
- (**语法分析（Syntactic Analysis / Parsing）**) 根据语法规则，将 token 序列组织成**树形结构**：

    ```
    function_definition
    ├── "def"                    ← 关键字
    ├── identifier: "hello"      ← 函数名
    ├── parameters               ← 参数列表
    │   ├── "("                  ← 左括号
    │   ├── identifier: "name"   ← 参数名
    │   └── ")"                  ← 右括号
    └── ":"                      ← 冒号
    ```

#### AST vs CST

- (**抽象语法树 (AST, Abstract Syntax Tree)**) 去掉对语义无关紧要的 token，只保留**结构和含义**：

    ```
    FunctionDef
    ├── name: hello
    ├── args: [name]
    └── body:
        └── Pass
    ```

- (**具体语法树 (CST, Concrete Syntax Tree)**) 保留源代码中的**所有** token，包括括号、逗号、关键字等：

    ```
    function_definition
    ├── "def"          ← 保留了关键字
    ├── identifier: hello
    ├── parameters
    │   ├── "("        ← 保留了括号
    │   ├── identifier: name
    │   └── ")"        ← 保留了括号
    ├── ":"            ← 保留了冒号
    └── block
        └── pass_statement
            └── "pass" ← 保留了关键字
    ```

| 特性 | CST | AST |
|------|-----|-----|
| 信息完整性 | 保留所有 token | 省略语法糖 |
| 可还原源码 | 可以（因为信息完整） | 不能完全还原 |
| 节点数量 | 较多 | 较少 |
| 典型用途 | 代码格式化、语法高亮 | 编译、静态分析 |
| 代表工具 | **tree-sitter** | Python `ast` 模块 |

## tree-sitter

```python {.run}
from tree_sitter import Language, Parser, Query, QueryCursor
import tree_sitter_python as tspython

def print_tree(node, indent=0):
    """缩进打印语法树的所有节点。

    Parameters
    ----------
    node : tree_sitter.Node
        起始节点。
    indent : int
        当前缩进层级。
    """
    # 叶子节点显示源码文本
    text = ""
    if node.child_count == 0:
        text = f'  "{node.text.decode()}"'

    # Named 节点直接显示 type，Anonymous 节点用引号包裹
    name = node.type if node.is_named else f'"{node.type}"'
    # name = node.type

    print(f"{'  ' * indent}{name}{text}")

    for child in node.children:
        print_tree(child, indent + 1)
```

```python {.run}

code = """
def add(a, b):
    return a + b

def neg(a):
    '''negation operation'''
    return -a

def sub(a, b):
    # negative
    b_neg = neg(b)
    return add(a, b_neg)
"""
```

### 代码解析: `Parser`

- 通过 `Parser(LANGUAGE)` 配置好对应语言的语法规则后, 可通过 `Parser.parse` 传入 bytes 化后的代码以生成对应的 CST.

```python {.run}

# 1. 从语言包创建 Language 对象
PY_LANGUAGE = Language(tspython.language())

# 2. 创建 Parser 并指定语言
parser = Parser(PY_LANGUAGE)

# 3. 解析代码（必须传入 bytes，不能是 str）
tree = parser.parse(bytes(code, encoding="utf-8"))

# 4. 查看语法树的 S-expression 表示
print(str(tree.root_node))
print("=" * 100)
print_tree(tree.rootnode)
```

- `tree` 的 S-expression 具有类似如下的结构

    ```scheme
    (node
        field: (child)
        field: (child))
    ```

    每个 node 下的 child 均以 `field: (child)` 的方式展现, `field` 的存在有利于快速定向检索.


- (**例子:**)

    ```scheme
    (module
    (function_definition
        name: (identifier)
        parameters: (parameters)
        body: (block
        (pass_statement))))
    ```

    对应的树形结构:

    ```
    module                          ← 根节点（每个 Python 文件是一个 module）
    └── function_definition         ← 函数定义
        ├── name: identifier        ← 字段 name → 函数名 "hello"
        ├── parameters: parameters  ← 字段 parameters → 参数列表（空）
        └── body: block             ← 字段 body → 函数体
            └── pass_statement      ← pass 语句
    ```

- 每个 `(type ...)` 表示一个节点, `type` 是节点类型;
- 嵌套的括号表示父子关系
- `field_name: (type)` 表示该子节点 (`type`) 在父节点中的**字段名** (如 `name:`, `body:`)
- S-expression 中只显示 **Named 节点**，Anonymous 节点（`def`、`(`、`)`、`:`）被省略

- `tree-sitter` 的一大特点是可以通过如下方式进行增量解析, 避免重复解析开销:

```python {.run}
new_code = code + """
def mul(a, b):
    return a * b
"""

new_tree = parser.parse(bytes(new_code, encoding="utf-8"), old_tree=tree)
print_tree(new_tree.root_node)
```

```python {.run}
# 查看变化范围
for r in tree.changed_ranges(new_tree):
    print(f"变化范围: byte {r.start_byte}..{r.end_byte}")
```

### Node: 节点

- 通过 `LANGUAGE` 来查看对应语言所有的 `节点类型`, `字段名`:

    ```python {.run}
    print("语言名称:", PY_LANGUAGE.name)
    print("节点类型数量:", PY_LANGUAGE.node_kind_count)
    print("字段数量:", PY_LANGUAGE.field_count)
    print("ABI 版本:", PY_LANGUAGE.abi_version)
    ```

    ```python {.run}
    for i in range(PY_LANGUAGE.node_kind_count):
        kind = PY_LANGUAGE.node_kind_for_id(i)
        is_named = PY_LANGUAGE.node_kind_is_named(i)
        if is_named:
            tag = "Named" if is_named else "Anonymous"
            print(f"  ID {i:3d}: {kind!r:30s} ({tag})")
    ```

    ```python {.run}
    for i in range(PY_LANGUAGE.field_count):
        kind = PY_LANGUAGE.field_name_for_id(i)
        print(f"  ID {i:3d}: {kind!r:30s}")
    ```

| 类别 | 属性/方法 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| **身份** | `type` | 属性 (str) | 节点类型名，如 `"function_definition"` |
| | `is_named` | 属性 (bool) | 是否为 Named 节点（对应 AST 节点） |
| | `kind_id` | 属性 (int) | 节点类型的数值 ID |
| | `is_error` | 属性 (bool) | 该节点自身是否存在语法错误 |
| | `has_error` | 属性 (bool) | 该节点的子树中是否存在语法错误 |
| **文本** | `text` | 属性 (bytes) | 节点对应的源码，返回 **bytes** 类型 |
| **位置** | `start_point` / `end_point` | 属性 (Point) | 起始/结束位置，`Point(row, column)`，0-indexed |
| | `start_byte` / `end_byte` | 属性 (int) | 起始/结束位置的字节偏移量 |
| | `byte_range` | 属性 (range) | 字节范围，可直接用于切片 |
| **子节点** | `children` | 属性 (iterable) | 所有子节点（Named + Anonymous） |
| | `named_children` | 属性 (iterable) | 仅 Named 子节点（遍历它相当于遍历 AST） |
| | `child_count` | 属性 (int) | 子节点总数 |
| | `named_child_count` | 属性 (int) | Named 子节点总数 |
| | `child(index)` | 方法 | 返回第 `index` 个子节点 |
| | `child_by_field_name(name)` | 方法 | 按字段名获取子节点，无则返回 `None` |
| **导航** | `parent` | 属性 | 父节点，根节点为 `None` |
| | `next_sibling` / `prev_sibling` | 属性 | 下一个/上一个兄弟节点（含 Anonymous） |
| | `next_named_sibling` | 属性 | 下一个 Named 兄弟节点 |
| | `prev_named_sibling` | 属性 | 上一个 Named 兄弟节点 |
| **查找** | `descendant_for_point_range(start, end)` | 方法 | 返回覆盖指定行列范围的最小子节点 |
| **遍历** | `walk()` | 方法 | 返回 `TreeCursor`，用于高效遍历子树 |


### S-表达式查询

- 通过 `Query` $\rightarrow$ `QueryCursor` 进行查询:

    ```python {.run}
    # 匹配 function_definition 节点, 捕获其 name 字段
    pattern = """
    (function_definition
        name: (identifier) @func_name
    )
    """
    query = Query(
        PY_LANGUAGE, pattern
    )

    # 用 captures() 进行查询
    cursor = QueryCursor(query)
    captures = cursor.captures(root)
    # captures 返回 dict: {capture_name: [Node, ...]}
    for node in captures["func_name"]:
        print(f"函数名: {node.text.decode()}  (行 {node.start_point.row})")
    # 函数名: add  (行 1)
    # 函数名: sub  (行 8)
    # 函数名: neg  (行 4)
    ```

| 语法类型 | 写法示例 | 说明 |
| :--- | :--- | :--- |
| **基础匹配** | `(function_definition)` | 匹配所有类型为 `function_definition` 的节点 |
| | `(identifier)` | 匹配所有类型为 `identifier` 的节点 |
| **字段约束** | `(function_definition name: (identifier))` | 匹配 `function_definition` 节点，且其 `name` 字段必须是 `identifier` 类型 |
| **捕获** | `(function_definition name: (identifier) @func_name)` | 用 `@name` 标记节点，执行后可通过名称提取 |
| **通配符** | `(_)` | 匹配**任意** Named 节点（不关心具体类型） |
| | `(assignment left: (identifier) @var right: (_) @value)` | 匹配赋值语句，右侧可以是任意类型 |
| **匿名节点** | `"def"` | 匹配关键字 `def`（字面量，Anonymous 节点） |
| | `"("` | 匹配左括号 |
| | `"return"` | 匹配 `return` 关键字 |
| **交替** | `[...]` | 匹配方括号内任一模式 |
| | `[ (function_definition name: (identifier) @name) (class_definition name: (identifier) @name) ]` | 同时匹配函数名和类名，捕获到同一个 `@name` |

#### 谓词（Predicates）

谓词 (Predicates) 是加在查询模式**内部**的附加条件, 用 `(#predicate)` 的形式写在模式的末尾. 它的作用是进一步筛选已匹配到的节点.

**核心写法:**
谓词需要写在圆括号 `()` 内, 紧跟在你想要约束的查询模式后面. 一个模式可以有多个谓词.

| 谓词写法 | 功能 | 示例 |
| :--- | :--- | :--- |
| `#eq? @capture "string"` | 判断捕获节点的文本**是否等于**某字符串 | `(#eq? @name "main")` |
| `#eq? @cap1 @cap2` | 判断两个捕获节点的文本**是否相等** | `(#eq? @left @right)` |
| `#match? @capture "regex"` | 判断捕获节点的文本**是否匹配**正则表达式 | `(#match? @name "^test")` |
| `#not-eq?` / `#not-match?` | 上述谓词的**否定形式** | `(#not-eq? @name "main")`  |
| `#any-xxx?` | 对**量化捕获**（如 `+`, `*`）中**任意一个**满足条件即通过 | `(#any-eq? @comments "#")`  |


```python {.run}
pattern = """
(
  (function_definition
    name: (identifier) @func_name
    parameters: (parameters
      (identifier) @param_name)
    body: (block
      (expression_statement
        (string) @docstring)?)
  )
  (#match? @param_name "^a$")
)
"""
query = Query(
    PY_LANGUAGE, pattern
)

cursor = QueryCursor(query)
captures = cursor.captures(root)

for tag, nodes in captures.items():
    for node in nodes:
        print(f"[{tag:10s}]\t[{node.type}]\t{node.text.decode():30s}")
```


## 附录

### S-expression


S-expression 起源于 **Lisp** 语言. 现在常作为一种用括号表示树形结构的极简语法:

- **原子 (Atom)**：`42`、`"hello"`、`foo`
- **表达式**：`(操作符 参数 ...)`

```lisp
(+ 1 2)          ; 表达 1 + 2
(* (+ 2 3) 4)    ; 表达 (2 + 3) * 4
```

| S-expression | Python 等价概念 |
| :--- | :--- |
| `(+ 1 2)` | `["+", 1, 2]` |
| `(print "hi")` | `["print", "hi"]` |


## 参考文献

<ol class="reference">
  <li>
    <u>tree-sitter</u>
    <a href="https://github.com/tree-sitter/tree-sitter" style="color: #007acc; font-weight: bold; text-decoration: none;">[Doc]</a>
  </li>
  <li>
    <u>py-tree-sitter</u>
    <a href="https://tree-sitter.github.io/py-tree-sitter/://arxiv.org/abs/1502.05477" style="color: #007acc; font-weight: bold; text-decoration: none;">[Doc]</a>
  </li>
  <!-- 添加更多文献条目 -->
</ol>

