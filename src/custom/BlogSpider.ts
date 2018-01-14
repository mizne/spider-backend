import { Spider } from '../lib/Spider'
import { BlogService } from '../lib/services/BlogService'
import { SourceService } from '../lib/services/SourceService'
import { Blog } from '../lib/models/Blog'
import { BlogSite, BlogSelector } from '../lib/models/Site'
import { Helper } from '../lib/Helper'

export class BlogSpider extends Spider<Blog> {
  private blogService: BlogService
  private sourceService: SourceService
  constructor(sites: BlogSite[]) {
    super(sites)
    this.blogService = new BlogService()
    this.sourceService = new SourceService()
  }

  public parse(
    $: CheerioStatic,
    url: string,
    selector: BlogSelector
  ): {
    items: Blog[]
    urls: string[]
  } {
    const results = Array.from($(selector.item)).map(e => ({
      url: Helper.resolveHref(
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
      releaseAt: Helper.resolveTimeFormat(
        $(e)
          .find(selector.releaseAt)
          .text()
          .trim()
      )
    }))

    const moreUrls = Array.from($(selector.moreUrl)).map(e =>
      Helper.resolveHref(url, $(e).attr('href'))
    )

    return {
      items: results,
      urls: moreUrls
    }
  }

  public async save(blogs: Blog[]): Promise<number> {
    if (blogs.length > 0) {
      await this.sourceService.insertIfNotIn(blogs[0].source)
      return this.blogService.batchInsertIfNotIn(blogs)
    }
    return Promise.resolve(0)
  }
}
