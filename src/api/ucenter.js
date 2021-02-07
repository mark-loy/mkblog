import request from '@/utils/request'

const BASE_API = "ucenter/front"

export default {
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
  },
  /* 获取访客信息 */
  getVisitorInfo() {
    return request({
      method: 'get',
      url: `${BASE_API}/info`
    })
  }
}