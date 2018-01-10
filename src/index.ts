import { BlogSpider } from './custom/BlogSpider'

// TODO 如何处理 通过滚动到页底来加载更多内容 

const urls = [
  'https://jeffjade.com',
  'http://taobaofed.org',
  'https://www.h5jun.com/',
  'http://welefen.com/',
  'http://www.css88.com/',
]
const selectors = [
  {
    item: '#main article',
    title: 'header h1 a',
    url: 'header h1 a',
    summary: '.article-content p',
    source: '晚晴幽草轩',
    releaseAt: 'time',
    moreUrl: 'a.page-number',
  },
  {
    item: '.article.article-summary',
    title: '.article-title a',
    url: '.article-title a',
    summary: '.article-excerpt',
    source: '淘宝前端团队',
    releaseAt: 'time',
    moreUrl: 'a.page-number',
  },
  {
    item: '#page-index .post',
    title: '.title a',
    url: '.title a',
    summary: '.entry-content p',
    source: '十年踪迹',
    releaseAt: '.date',
    moreUrl: '.pagination a',
  },
  {
    item: '#page-index .post',
    title: '.title a',
    url: '.title a',
    summary: '.entry-content p',
    source: '李成银',
    releaseAt: '.date',
    moreUrl: '.pagination a',
  },
  {
    item: 'article',
    title: 'header h1 a',
    url: 'header h1 a',
    summary: '.entry-content p',
    source: 'WEB前端开发CSS88',
    releaseAt: 'time',
    moreUrl: '.navigation a',
  },
]

const task = new BlogSpider(urls, selectors)
task.run()
