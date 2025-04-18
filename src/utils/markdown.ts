import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

export interface Article {
  id: string
  title: string
  date: string
  author?: string
  category: string
  tags: string[]
  readTime: string
  content: string
  html: string
  summary: string
}

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

// 手动解析 frontmatter
function parseFrontmatter(content: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---[\r\n]+([\s\S]*?)[\r\n]+---/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content: content.trim() }
  }

  const frontmatter = match[1]
  const remainingContent = content.slice(match[0].length).trim()
  
  const data = frontmatter.split('\n').reduce((acc, line) => {
    line = line.trim()
    if (!line) return acc

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return acc

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // 处理引号
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }

    // 处理数组
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const arrayStr = value
          .slice(1, -1)                    // 移除 [ ]
          .split(',')                      // 分割项目
          .map(item => item.trim())        // 移除空格
          .filter(item => item.length > 0) // 移除空项
          .map(item => {
            // 处理带引号的项
            if (item.startsWith('"') && item.endsWith('"')) {
              return item.slice(1, -1)
            }
            return item
          })
        acc[key] = arrayStr
      } catch {
        acc[key] = []
      }
    } else {
      acc[key] = value
    }
    
    return acc
  }, {} as Record<string, any>)

  return { 
    data,
    // 移除开头的标题（因为标题已经在 frontmatter 中）
    content: remainingContent.replace(/^#\s+.*$/m, '').trim()
  }
}

export function parseMarkdown(content: string, id: string): Article {
  try {
    // 使用自定义方法解析 frontmatter
    const { data, content: markdownContent } = parseFrontmatter(content)
    
    // 生成摘要
    const summary = extractSummary(markdownContent)
    
    // 处理日期格式
    let dateStr = data.date
    if (dateStr) {
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          dateStr = new Date().toISOString()
        }
      } catch {
        dateStr = new Date().toISOString()
      }
    } else {
      dateStr = new Date().toISOString()
    }
    
    // 确保标题存在
    const title = data.title?.replace(/^["']|["']$/g, '') || '无标题'
    
    return {
      id,
      title,
      date: dateStr,
      author: data.author,
      category: data.category || '未分类',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readTime: data.readTime || `${Math.ceil(markdownContent.length / 500)} 分钟阅读`,
      content: markdownContent,
      html: marked(markdownContent),
      summary: data.summary || summary
    }
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return {
      id,
      title: '解析错误',
      date: new Date().toISOString(),
      category: '未分类',
      tags: [],
      readTime: '1 分钟阅读',
      content: '内容解析错误',
      html: '<p>内容解析错误</p>',
      summary: '内容解析错误'
    }
  }
}

export function extractSummary(content: string, length: number = 150): string {
  const plainText = content
    .replace(/^#+\s+[^\n]+/gm, '') // 移除标题
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 将链接转换为文本
    .replace(/[#*`_]/g, '') // 移除 Markdown 标记
    .replace(/\s+/g, ' ') // 合并空白字符
    .trim()
  
  return plainText.length > length 
    ? plainText.slice(0, length).replace(/[，。！？、][^，。！？、]*$/, '') + '...'
    : plainText
} 