import { Article } from '../models/Article'
import { TextExtractStrategy } from './TextExtractStrategy'

export class TextExtract {
  constructor(private textExtractStrategy: TextExtractStrategy<Article>) {}
  extract(html: string): Article[] {
    return this.textExtractStrategy.extract(html)
  }
}
