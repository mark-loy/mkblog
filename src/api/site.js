import request from '@/utils/request'

const BASE_API = 'site'

export default {
  /* 获取站点信息 */
  selectSiteInfo() {
    return request({
      method: 'get',
      url: `${BASE_API}/info/`
    })
  },
  /* 获取社交信息 */
  selectSocialInfo() {
    return request({
      method: 'get',
      url: `${BASE_API}/social/`
    })
  }
}