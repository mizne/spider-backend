import { TextExtractStrategy } from './TextExtractStrategy'
import * as cheerio from 'cheerio'

import { Article } from '../models/Article'
import { fullPath } from '../../utils'

export class TaoBaoFETextExtractStrategy implements TextExtractStrategy<Article> {
  constructor(private host: string, private source: string) {}
  extract(html: string): Article[] {
    const $ = cheerio.load(html)
    const results: Article[] = []
    const nodeList = $('.article.article-summary')
    nodeList.each((_, e) => {
      const a = $(e).find('.article-title a')
      const summaryDom = $(e).find('.article-excerpt')
      results.push({
        url: fullPath(this.host, a.attr('href')),
        title: a.text().trim(),
        summary: summaryDom.text(),
        source: this.source
      })
    })
    return results
  }
}