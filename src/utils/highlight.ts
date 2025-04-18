import hljs from 'highlight.js'
// 导入两种主题
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'

// 注册常用语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('markdown', markdown)

// 配置代码高亮
export function configureHighlight() {
  return {
    highlight(code: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value
        } catch (e) {
          console.error('Failed to highlight code block:', e)
          return code
        }
      }
      return hljs.highlightAuto(code).value
    }
  }
}

// 手动应用代码高亮
export function applyHighlight(element: HTMLElement) {
  const codeBlocks = element.querySelectorAll('pre code')
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block as HTMLElement)
  })
} 