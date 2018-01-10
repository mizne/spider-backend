import { BlogSpider } from './custom/BlogSpider'

// 如何处理 通过滚动到页底来加载更多内容 

const urls = [
  'https://jeffjade.com',
  'http://taobaofed.org'
]
const selectors = [
  {
    item: '#main article',
    title: 'header h1 a',
    url: 'header h1 a',
    summary: '.article-content p',
    source: '晚晴幽草轩',
    moreUrl: 'a.page-number',
    releaseAt: 'time'
  },
  {
    item: '.article.article-summary',
    title: '.article-title a',
    url: '.article-title a',
    summary: '.article-excerpt',
    source: '淘宝前端团队',
    moreUrl: 'a.page-number',
    releaseAt: 'time'
  }
]

const task = new BlogSpider(urls, selectors)
task.run()
