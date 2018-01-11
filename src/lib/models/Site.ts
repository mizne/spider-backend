
export type BlogSelector = {
  item: string
  title: string
  url: string
  summary: string
  source: string
  releaseAt: string
  moreUrl: string
}

export type BlogSite = {
  url: string
  selector: BlogSelector
}

