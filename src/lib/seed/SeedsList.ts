import { OscTextExtractStrategy } from '../text-extract/OscTextExtractStrategy'
import { ToutiaoTextExtractStrategy } from '../text-extract/ToutiaoTextExtractStrategy'
import { TextExtractStrategy } from '../text-extract/TextExtractStrategy'
import { WanQingTextExtractStrategy } from '../text-extract/WanQingTextExtractStrategy'
import { TaoBaoFETextExtractStrategy } from '../text-extract/TaoBaoFETextExtractStrategy'
import { Article } from '../models/Article'

export interface ISeeds {
  host: string
  path: string
  textExtractStrategy: TextExtractStrategy<Article>
}

const seedsList: ISeeds[] = [
  {
    host: 'https://www.oschina.net',
    path: '/news/industry',
    textExtractStrategy: new OscTextExtractStrategy('https://www.oschina.net', '开源中国')
  },
  {
    host: 'https://toutiao.io',
    path: '/posts/hot/7',
    textExtractStrategy: new ToutiaoTextExtractStrategy('https://toutiao.io', '开发者头条')
  },
  {
    host: 'https://jeffjade.com',
    path: '/',
    textExtractStrategy: new WanQingTextExtractStrategy('https://jeffjade.com/', '晚晴幽草轩')
  },
  {
    host: 'http://taobaofed.org',
    path: '/',
    textExtractStrategy: new TaoBaoFETextExtractStrategy('http://taobaofed.org/', '淘宝前端团队')
  },
]
export { seedsList }
