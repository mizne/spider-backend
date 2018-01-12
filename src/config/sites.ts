import { BlogSite } from '../lib/models/Site'

const sites: BlogSite[] = [
  {
    url: 'https://jeffjade.com',
    selector: {
      item: '#main article',
      title: 'header h1 a',
      url: 'header h1 a',
      summary: '.article-content p',
      source: '晚晴幽草轩',
      releaseAt: 'time',
      moreUrl: 'a.page-number'
    }
  },
  {
    url: 'http://taobaofed.org',
    selector: {
      item: '.article.article-summary',
      title: '.article-title a',
      url: '.article-title a',
      summary: '.article-excerpt',
      source: '淘宝前端团队',
      releaseAt: 'time',
      moreUrl: 'a.page-number'
    }
  },
  {
    url: 'https://www.h5jun.com/',
    selector: {
      item: '#page-index .post',
      title: '.title a',
      url: '.title a',
      summary: '.entry-content p',
      source: '十年踪迹',
      releaseAt: '.date',
      moreUrl: '.pagination a'
    }
  },
  {
    url: 'http://welefen.com/',
    selector: {
      item: '#page-index .post',
      title: '.title a',
      url: '.title a',
      summary: '.entry-content p',
      source: '李成银',
      releaseAt: '.date',
      moreUrl: '.pagination a'
    }
  },
  {
    url: 'http://www.css88.com/',
    selector: {
      item: 'article',
      title: 'header h1 a',
      url: 'header h1 a',
      summary: '.entry-content p',
      source: 'WEB前端开发CSS88',
      releaseAt: 'time',
      moreUrl: '.navigation a'
    }
  }
]

export { sites }
