import request from '@/utils/request'

const BASE_API = "mds/mail"

export default {
  /* 发送验证码 */
  sendMailCode(email) {
    return request({
      method: 'post',
      url: `${BASE_API}/send/code`,
      params: {
        email: email
      }
    })
  },
  
}