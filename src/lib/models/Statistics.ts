export interface TaskStatistics {
  siteCount: number
  pageCount: number
  itemCount: number
  retryCount: number
}

export interface SpiderStatistics extends TaskStatistics {
  secondCost: number
}