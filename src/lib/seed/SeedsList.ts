import { OscTextExtractStrategy } from '../text-extract/OscTextExtractStrategy'
import { ToutiaoTextExtractStrategy } from '../text-extract/ToutiaoTextExtractStrategy'
import { TextExtractStrategy } from '../text-extract/TextExtractStrategy'
import { WanQingTextExtractStrategy } from '../text-extract/WanQingTextExtractStrategy'
import { Article } from '../../storage/models/Article'

export enum SourceCode {
  OS_CHINA = '开源中国',
  TOUTIAO = '开发者头条',
  WAN_QING_YOU_CAO_XUAN = '晚晴幽草轩'
}

export interface ISeeds {
  host: string
  path: string
  textExtractStrategy: TextExtractStrategy<Article>
}

const seedsList: ISeeds[] = [
  {
    host: 'https://www.oschina.net',
    path: '/news/industry',
    textExtractStrategy: new OscTextExtractStrategy('https://www.oschina.net')
  },
  {
    host: 'https://toutiao.io',
    path: '/posts/hot/7',
    textExtractStrategy: new ToutiaoTextExtractStrategy('https://toutiao.io')
  },
  {
    host: 'https://jeffjade.com/',
    path: '',
    textExtractStrategy: new WanQingTextExtractStrategy('https://jeffjade.com/')
  },
]
export { seedsList }
