# 速查表

Markdown 语法快速参考。

## 概述

此 Markdown 备忘单对所有 Markdown 语法元素进行了快速概述。它无法涵盖所有特殊情况，因此，如果你需要有关任何这些元素的更多信息，请参阅 [基本语法](https://www.markdown.cn/docs/tutorial-basics/basic-syntax) 和 [扩展语法](https://www.markdown.cn/docs/tutorial-basics/extended-syntax) 的参考指南。

## 基本语法

这些是 John Gruber 的原始设计文档中概述的元素。所有 Markdown 应用程序都支持这些元素。

| 元素                                                                                | Markdown 语法                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [标题](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#headings)          | `# H1`<br>`## H2`<br>`### H3`                          |
| [粗体](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#bold)              | `**bold text**`                                        |
| [斜体](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#italic)            | `*italicized text*`                                    |
| [引用块](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#blockquotes-1)    | `> blockquote`                                         |
| [有序列表](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#ordered-lists)   | `1. First item`<br>`2. Second item`<br>`3. Third item` |
| [无序列表](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#unordered-lists) | `- First item`<br>`- Second item`<br>`- Third item`    |
| [代码](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#code)              | `` `code` ``                                           |
| [水平线](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#horizontal-rules) | `---`                                                  |
| [链接](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#links)             | `[title](https://www.example.com)`                     |
| [图片](https://www.markdown.cn/docs/tutorial-basics/basic-syntax#images)            | `![alt text](image.jpg)`                               |

## 扩展语法

这些元素通过添加其他功能来扩展基本语法。并非所有 Markdown 应用程序都支持这些元素。

| 元素                                                                                                                                                                                   | Markdown 语法                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| [表格](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#tables)                                                                                                            | ```<br>\| 语法 \| 说明 \|<br>\| ----------- \| ----------- \|<br>\| 标题 \| 名称 \|<br>\| 段落 \| 文本 \|<br><br>```                          |
| [带围栏的代码块](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#fenced-code-blocks)                                                                                           | ```<br>  ```<br>    {<br>      "firstName": "John",<br>      "lastName": "Smith",<br>      "age": 25<br>    }<br>  ```<br><br>``` |
| [脚注](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#footnotes)                                                                                                         | ```<br>这是一个带脚注的句子。[^1]<br>[^1]: 这是脚注。<br><br>```                                                                                  |
| [标题 ID](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#heading-ids)                                                                                                    | ```<br>### 我的伟大标题 {#custom-id}<br><br>```                                                                                         |
| [定义列表](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#definition-lists)                                                                                                | ```<br>术语<br>: 定义<br><br>```                                                                                                      |
| [删除线](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#strikethrough)                                                                                                    | ```<br>~~世界是平的。~~<br><br>```                                                                                                      |
| [任务列表](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#task-lists)                                                                                                      | ```<br>- [x] 撰写新闻稿<br>- [ ] 更新网站<br>- [ ] 联系媒体<br><br>```                                                                         |
| [表情符号](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#emoji)（另请参阅 [复制和粘贴表情符号](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#copying-and-pasting-emoji)） | ```<br>太搞笑了！:joy<br><br>```                                                                                                       |
| [高亮](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#highlight)                                                                                                         | ```<br>我需要高亮这些==非常重要的单词==。<br><br>```                                                                                             |
| [下标](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#subscript)                                                                                                         | ```<br>    H~2~O<br><br>```                                                                                                       |
| [上标](https://www.markdown.cn/docs/tutorial-basics/extended-syntax#superscript)                                                                                                       | ```<br>    X^2^<br><br>```                                                                                                        |

## 下载

你可以将此备忘单下载为 Markdown 文件，以便在 Markdown 应用程序中使用。
