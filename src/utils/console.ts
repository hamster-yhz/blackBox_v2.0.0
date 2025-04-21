// 控制台彩蛋
export function initConsoleEasterEgg() {
  const style = 'color: #3b82f6; font-size: 18px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
  const warningStyle = 'color: #ef4444; font-size: 16px; font-weight: bold;'
  const messageStyle = 'color: #10b981; font-size: 14px;'

  const messages = [
    { text: '🎉 欢迎来到我的博客！', style },
    { text: '⚠️ 温馨提示：', style: warningStyle },
    { text: '虽然你很好奇想看看源码，', style: messageStyle },
    { text: '但请不要爬取文章内容哦～', style: messageStyle },
    { text: '如果喜欢的话，不妨收藏网站，常来逛逛 😊', style: messageStyle },
    { text: '祝你浏览愉快！', style: messageStyle }
  ]

  const catArt = `
%c
     /\\_/\\  
    ( o.o ) 
     > ^ <  
    
`

  let isDevToolsOpen = false
  let lastPrintTime = 0
  const PRINT_COOLDOWN = 5000 // 5秒冷却时间

  // 打印消息的函数
  const printMessages = () => {
    const now = Date.now()
    if (now - lastPrintTime < PRINT_COOLDOWN) return
    
    messages.forEach(msg => {
      console.log('%c' + msg.text, msg.style)
    })
    console.log(catArt, 'font-family: monospace; color: #3b82f6;')
    
    lastPrintTime = now
  }

  // 检测开发者工具的打开
  const devToolsCheck = () => {
    // 方法1：检测窗口大小变化
    const widthThreshold = window.outerWidth - window.innerWidth > 160
    const heightThreshold = window.outerHeight - window.innerHeight > 160
    const isCurrentlyOpen = widthThreshold || heightThreshold
    
    // 方法2：检测控制台是否被清除
    const isConsoleCleared = !console.log.toString().includes('native code')
    
    if ((isCurrentlyOpen || isConsoleCleared) && !isDevToolsOpen) {
      isDevToolsOpen = true
      printMessages()
    } else if (!isCurrentlyOpen && !isConsoleCleared && isDevToolsOpen) {
      isDevToolsOpen = false
    }
  }

  // 监听开发者工具的快捷键
  window.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
      (e.key === 'F12')                             // F12
    ) {
      printMessages()
    }
  })

  // 使用 MutationObserver 监听控制台清除事件
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        // 如果控制台被清除且开发者工具仍然打开，重新打印消息
        if (isDevToolsOpen) {
          printMessages()
        }
      }
    })
  })

  // 尝试监听控制台清除
  try {
    const body = document.querySelector('body')
    if (body) {
      observer.observe(body, {
        childList: true,
        subtree: true
      })
    }
  } catch (e) {
    // 忽略可能的错误
  }

  // 使用 requestAnimationFrame 代替 setInterval，性能更好
  let rafId: number
  const checkLoop = () => {
    devToolsCheck()
    rafId = requestAnimationFrame(checkLoop)
  }
  rafId = requestAnimationFrame(checkLoop)

  // 添加页面卸载时的清理
  window.addEventListener('unload', () => {
    cancelAnimationFrame(rafId)
    observer.disconnect()
  })
} 