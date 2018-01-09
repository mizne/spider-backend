import { TaskSpider } from './tasks/TaskSpider'

const urls = [
  'https://www.oschina.net/news/industry',
  'https://toutiao.io/posts/hot/7',
  'https://jeffjade.com',
  'http://taobaofed.org'
]
const selectors = [
  {
    item: '#kinds-of-news .item.box',
    title: 'a .text-ellipsis',
    url: 'a',
    summary: '.summary',
    source: '开源中国'
  },
  {
    item: '.posts .post .content',
    title: 'h3.title a',
    url: 'h3.title a',
    summary: '.summary',
    source: '开发者头条'
  },
  {
    item: '#main article',
    title: 'header h1 a',
    url: 'header h1 a',
    summary: '.article-content p',
    source: '晚晴幽草轩'
  },
  {
    item: '.article.article-summary',
    title: '.article-title a',
    url: '.article-title a',
    summary: '.article-excerpt',
    source: '淘宝前端团队'
  }
]

const task = new TaskSpider(urls, selectors)
task.run().then(items => {
  task.save(items)
})
