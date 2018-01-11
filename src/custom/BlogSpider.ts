import { Spider } from '../Spider'
import { BlogService } from '../lib/services/BlogService'
import { Blog } from '../lib/models/Blog'
import { BlogSite } from '../lib/models/site.model'
import { resolveHref, resolveTimeFormat } from '../utils/index'
import { Logger } from '../utils/Logger'
import { SiteTask } from '../lib/tasks/SiteTask'

export class BlogSpider extends Spider<Blog> {
  private blogService: BlogService
  private logger: Logger
  constructor(sites: BlogSite[]) {
    super(sites)
    this.blogService = new BlogService()
    this.logger = new Logger(BlogSpider.name)
  }

  parse(
    $: CheerioStatic,
    task: SiteTask
  ): {
    items: Blog[],
    urls: string[]
  } {
    const { url, selector } = task

    const results = Array.from($(selector.item)).map(e => ({
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
      releaseAt: resolveTimeFormat(
        $(e)
          .find(selector.releaseAt)
          .text()
          .trim()
      )
    }))

    const moreUrls = Array.from($(selector.moreUrl)).map(e =>
      resolveHref(url, $(e).attr('href'))
    )

    return {
      items: results,
      urls: moreUrls
    }
  }

  async save(blogs: Blog[]) {
    return this.blogService.batchInsertIfNotIn(blogs)
  }
}
