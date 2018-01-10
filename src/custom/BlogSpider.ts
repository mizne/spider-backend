import { Spider } from '../Spider'
import { BlogService } from '../lib/services/BlogService'
import { Blog } from '../lib/models/Blog'
import { resolveHref, extractRegularTime } from '../utils/index'
import { Logger } from '../utils/Logger'

export class BlogSpider extends Spider<Blog> {
  private blogService: BlogService
  private logger: Logger
  constructor(urls: string[], selectors: any[]) {
    super(urls, selectors)
    this.blogService = new BlogService()
    this.logger = new Logger(BlogSpider.name)
  }

  parse(
    $: CheerioStatic,
    url: string
  ): {
    items: Blog[]
    urls: string[]
  } {
    const urlIndex = this.urls
      .map(url => {
        const [protocol, , host] = url.split(/\//)
        return `${protocol}//${host}`
      })
      .findIndex(e => url.startsWith(e))
    if (urlIndex === -1) {
      this.logger.warn(`blog url: ${url} is external site;`)
      return {
        items: [],
        urls: []
      }
    }
    const selector = this.selectors[urlIndex]
    const results: Blog[] = []
    const nodeList = $(selector.item)
    nodeList.each((_, e) => {
      results.push({
        url: resolveHref(
          url,
          $(e)
            .find(selector.url)
            .attr('href')
            .trim()
        ),
        title: $(e)
          .find(selector.title)
          .text()
          .trim(),
        summary: $(e)
          .find(selector.summary)
          .text()
          .trim(),
        source: selector.source,
        releaseAt: extractRegularTime(
          $(e)
            .find(selector.releaseAt)
            .text()
            .trim()
        )
      })
    })

    const moreUrls: string[] = []
    const moreUrlList = $(selector.moreUrl)
    moreUrlList.each((_, e) => {
      moreUrls.push(resolveHref(url, $(e).attr('href')))
    })
    return {
      items: results,
      urls: moreUrls
    }
  }

  async save(blogs: Blog[]) {
    return this.blogService.batchInsertIfNotIn(blogs)
  }
}
