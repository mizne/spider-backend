import * as debug from 'debug'

import { SpiderStatistics } from '../models/Statistics'
import { debugError } from '../Helper'

const SMSClient = require('@alicloud/sms-sdk')
const accessKeyId = 'LTAIvat4XlXP7yFR'
const secretAccessKey = 'UqTweRjlx1c5AgJZYCZrlT97qiPvTy'
const smsClient = new SMSClient({ accessKeyId, secretAccessKey })

const debugSms = debug('Spider:SmsService')

export class SmsService {
  async sendSuccessSms(statistics: SpiderStatistics): Promise<any> {
    try {
      const resp = await smsClient.sendSMS({
        PhoneNumbers: '13721080281',
        SignName: '爬虫助手',
        TemplateCode: 'SMS_121910678',
        TemplateParam: JSON.stringify(statistics)
      })
      console.log(resp)
      if (resp.Code === 'OK') {
        return resp
      } else {
        debugSms(`Send sms failure; code: ${resp.Code};`)
        return Promise.reject(new Error(`Send sms failure; code: ${resp.Code};`))
      }
    } catch (e) {
      debugError(e)
    }
  }

  async sendFailureSms(msg: string): Promise<any> {
    try {
      const resp = await smsClient.sendSMS({
        PhoneNumbers: '13721080281',
        SignName: '爬虫助手',
        TemplateCode: 'SMS_121850656',
        TemplateParam: JSON.stringify({errorMsg: msg})
      })
      console.log(resp)
      if (resp.Code === 'OK') {
        return resp
      } else {
        debugSms(`Send sms failure; code: ${resp.Code};`)
        return Promise.reject(new Error(`Send sms failure; code: ${resp.Code};`))
      }
    } catch (e) {
      debugError(e)
    }
  }
}
