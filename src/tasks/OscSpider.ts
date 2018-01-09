import { Spider } from '../Spider'
import { ArticleService } from '../lib/services/ArticleService'
import { Article } from '../lib/models/Article'
import { resolveHref } from '../utils/index'


export class TaskSpider extends Spider<Article> {
  private articleService: ArticleService
  constructor(urls: string[], selectors: any[]) {
    super(urls, selectors)
    this.articleService = new ArticleService()
  }

  parse($: CheerioStatic, url: string, selector: any): Article[] {
    const results: Article[] = []
    const nodeList = $(selector.item)
    nodeList.each((_, e) => {
      results.push({
        url: resolveHref(url, $(e).find(selector.url).attr('href')),
        title: $(e).find(selector.title).text().trim(),
        summary: $(e).find(selector.summary).text(),
        source: selector.source
      })
    })
    // 排除广告
    return results.filter(e => e.title)
  }

  async save(articles: Article[]) {
    return this.articleService.batchInsertIfNotIn(articles)
  }
}

