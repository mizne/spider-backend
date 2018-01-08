import { TextExtractStrategy } from './TextExtractStrategy'
import * as cheerio from 'cheerio'

import { Article } from '../../storage/models/Article'
import { fullPath } from '../../utils'
import { SourceCode } from '../seed/SeedsList'

export class WanQingTextExtractStrategy implements TextExtractStrategy<Article> {
  constructor(private host: string) {}
  extract(html: string): Article[] {
    const $ = cheerio.load(html)
    const results: Article[] = []
    const nodeList = $('#main').find('article')
    nodeList.each((_, e) => {
      const a = $(e).find('header h1 a')
      const summaryDom = $(e).find('.article-content p')
      results.push({
        url: fullPath(this.host, a.attr('href')),
        title: a.text().trim(),
        summary: summaryDom.text(),
        source: SourceCode.WAN_QING_YOU_CAO_XUAN
      })
    })
    return results
  }
}
