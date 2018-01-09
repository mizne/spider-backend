import { TextExtractStrategy } from './TextExtractStrategy'
import * as cheerio from 'cheerio'

import { Article } from '../models/Article'
import { fullPath } from '../../utils'

export class OscTextExtractStrategy implements TextExtractStrategy<Article> {
  constructor(
    private host: string,
    private source: string
  ) {}
  extract(html: string): Article[] {
    const $ = cheerio.load(html)
    const results: Article[] = []
    const nodeList = $('#kinds-of-news').find('.item')
    nodeList.each((_, e) => {
      const a = $(e).find('a')
      const summaryDom = $(e).find('.summary')
      results.push({
        url: fullPath(this.host, a.attr('href')),
        title: a.find('.text-ellipsis').text().trim(),
        summary: summaryDom.text(),
        source: this.source
      })
    })
    // 排除广告
    return results.filter(e => e.title)
  }
}
