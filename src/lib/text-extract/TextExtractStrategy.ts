export interface TextExtractStrategy<T> {
  extract(html: string): T[]
}
