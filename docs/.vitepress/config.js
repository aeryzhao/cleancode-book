import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Clean Code 中文',
  base: '/cleancode-book/',
  ignoreDeadLinks: true,
  themeConfig: {
    repo: 'iszhaoxg/cleancode-book',
    repoLabel: 'GitHub',
    docsRepo: 'iszhaoxg/cleancode-book',
    docsBranch: 'main/docs',
    editLink: {
      pattern: 'https://github.com/iszhaoxg/cleancode-book/edit/main/docs/:path',
      text: '帮助我们改善此页面！'
    },
    lastUpdated: true,
    outline: [2, 2],
    nav: [],
    sidebar: [
      {
        items: [
          { text: '首页', link: '/' },
          { text: '第 1 章 整洁代码', link: '/ch1' },
          { text: '第 2 章 有意义的命名', link: '/ch2' },
          { text: '第 3 章 函数', link: '/ch3' },
          { text: '第 4 章 注释', link: '/ch4' },
          { text: '第 5 章 格式', link: '/ch5' },
          { text: '第 6 章 对象和数据结构', link: '/ch6' },
          { text: '第 7 章 错误处理', link: '/ch7' },
          { text: '第 8 章 边界', link: '/ch8' },
          { text: '第 9 章 单元测试', link: '/ch9' },
          { text: '第 10 章 类', link: '/ch10' },
          { text: '第 11 章 系统', link: '/ch11' },
          { text: '第 12 章 迭进', link: '/ch12' },
          { text: '第 13 章 并发编程', link: '/ch13' },
          { text: '第 14 章 逐步改进', link: '/ch14' },
          { text: '第 15 章 JUnit 内幕', link: '/ch15' },
          { text: '第 16 章 重构 SerialDate', link: '/ch16' },
          { text: '第 17 章 味道与启发', link: '/ch17' },
          { text: '附录 A 并发编程 II', link: '/apA' }
        ]
      }
    ]
  }
})
