import Main from './core/Main'
import { users } from '../../../config/users'
import { SmsService } from '../../lib/services/SmsService'

const signIn = async () => {
  const smsService = new SmsService()
  for (const user of users) {
    const result = await new Main(user.name, user.password).run()
    if (result.status) {
      smsService.signInSuccess(
        user.name,
        result.lastPoints,
        result.currentPoints
      )
    } else {
      smsService.signInFailure(user.name, result.lastPoints, result.lastPoints)
    }
  }
}

export { signIn }
