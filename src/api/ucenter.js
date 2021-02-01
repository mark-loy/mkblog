import request from '@/utils/request'

const BASE_API = "ucenter/front"

export default {
  /* 发送验证码 */
  sendMailCode(email) {
    return request({
      method: 'post',
      url: `${BASE_API}/mail/send`,
      params: {
        email: email
      }
    })
  },
  /* 访客登录 */
  toLogin(loginForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/login`,
      data: loginForm
    })
  },
  /* 访客注册 */
  toRegister(registerForm) {
    return request({
      method: 'post', 
      url: `${BASE_API}/register`,
      data: registerForm
    })
  }
}