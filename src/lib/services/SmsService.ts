import * as debug from 'debug'
import { SpiderStatistics } from '../models/Statistics'
import { SMS_API } from '../../../config/api'

const SMSClient = require('@alicloud/sms-sdk')
const smsClient = new SMSClient(SMS_API)

const debugSms = debug('Spider:SmsService')

export class SmsService {
  async spiderSuccess(statistics: SpiderStatistics): Promise<any> {
    try {
      const resp = await smsClient.sendSMS({
        PhoneNumbers: '13721080281',
        SignName: '爬虫助手',
        TemplateCode: 'SMS_121910678',
        TemplateParam: JSON.stringify(statistics)
      })
      if (resp.Code === 'OK') {
        return resp
      } else {
        debugSms(`Send sms failure; code: ${resp.Code};`)
        return Promise.reject(
          new Error(`Send sms failure; code: ${resp.Code};`)
        )
      }
    } catch (e) {
      debugSms(`Send sms failure; error: ${e.message};`)
    }
  }

  async spiderFailure(msg: string): Promise<any> {
    try {
      const resp = await smsClient.sendSMS({
        PhoneNumbers: '13721080281',
        SignName: '爬虫助手',
        TemplateCode: 'SMS_121850656',
        TemplateParam: JSON.stringify({ errorMsg: msg })
      })
      if (resp.Code === 'OK') {
        return resp
      } else {
        debugSms(`Send sms failure; code: ${resp.Code};`)
        return Promise.reject(
          new Error(`Send sms failure; code: ${resp.Code};`)
        )
      }
    } catch (e) {
      debugSms(`Send sms failure; error: ${e.message};`)
    }
  }

  async signInSuccess(
    name: string,
    lastPoints: string,
    currentPoints: string
  ): Promise<any> {
    try {
      const resp = await smsClient.sendSMS({
        PhoneNumbers: '13721080281',
        SignName: '爬虫助手',
        TemplateCode: 'SMS_121906231',
        TemplateParam: JSON.stringify({ name, lastPoints, currentPoints })
      })
      console.log(resp)
      if (resp.Code === 'OK') {
        return resp
      } else {
        debugSms(`Send sms failure; code: ${resp.Code};`)
        return Promise.reject(
          new Error(`Send sms failure; code: ${resp.Code};`)
        )
      }
    } catch (e) {
      debugSms(`Send sms failure; error: ${e.message};`)
    }
  }

  async signInFailure(
    name: string,
    lastPoints: string,
    currentPoints: string
  ): Promise<any> {
    try {
      const resp = await smsClient.sendSMS({
        PhoneNumbers: '13721080281',
        SignName: '爬虫助手',
        TemplateCode: 'SMS_121856266',
        TemplateParam: JSON.stringify({ name, lastPoints, currentPoints })
      })
      console.log(resp)
      if (resp.Code === 'OK') {
        return resp
      } else {
        debugSms(`Send sms failure; code: ${resp.Code};`)
        return Promise.reject(
          new Error(`Send sms failure; code: ${resp.Code};`)
        )
      }
    } catch (e) {
      debugSms(`Send sms failure; error: ${e.message};`)
    }
  }
}
