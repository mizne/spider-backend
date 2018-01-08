import { SourceCode } from '../../lib/seed/SeedsList'

export interface Article {
  url: string
  title: string
  summary: string
  source: SourceCode
}
