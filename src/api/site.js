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
  },
  /* 获取友站信息 */
  selectFriendSiteInfo() {
    return request({
      method: 'get',
      url: `${BASE_API}/friend/`
    })
  },
  /* 保存留言 */
  saveGuestbook(guestbookForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/guestbook/`,
      data: guestbookForm
    })
  }
}