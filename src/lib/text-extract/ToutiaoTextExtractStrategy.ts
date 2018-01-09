import { TextExtractStrategy } from './TextExtractStrategy'
import * as cheerio from 'cheerio'

import { Article } from '../../storage/models/Article'
import { fullPath } from '../../utils'

export class ToutiaoTextExtractStrategy implements TextExtractStrategy<Article> {
  constructor(private host: string, private source: string) {}
  extract(html: string): Article[] {
    const $ = cheerio.load(html)
    const results: Article[] = []
    const nodeList = $('.posts').find('.post .content')
    nodeList.each((_, e) => {
      const a = $(e).find('h3.title a')
      const summaryDom = $(e).find('.summary')
      results.push({
        url: fullPath(this.host, a.attr('href')),
        title: a.text().trim(),
        summary: summaryDom.text(),
        source: this.source
      })
    })
    return results as Article[]
  }
}
