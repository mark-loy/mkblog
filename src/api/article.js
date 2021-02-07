import request from '@/utils/request'

const BASE_API = 'blog/article/detail'

export default {
  /* 获取文章详情数据 */
  getArticleDetail(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/${aid}`
    })
  },
  /* 查询文章的评论信息 */
  selectArticleComments(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/comment/${aid}`
    })
  },
  /* 保存评论 */
  saveComment(commentForm) {
    return request({
      method: 'post',
      url: `${BASE_API}/comment`,
      data: commentForm
    })
  }

}