import request from '@/utils/request'

const BASE_API = "blog/home"

export default {
  /* 多组合条件查询文章分页数据 */
  getArticlePage(page, size, articleQuery) {
    return request({
      method: 'post',
      url: `${BASE_API}/articles/${page}/${size}`,
      data: articleQuery
    })
  },
  /* 根据id查询文章数据 */
  getArticleById(aid) {
    return request({
      method: 'get',
      url: `${BASE_API}/article/${aid}`
    })
  },
  /* 获取首页焦点图列表数据 */
  getFeatures() {
    return request({
      method: 'get',
      url: `${BASE_API}/focus`
    })
  },
  /* 获取所有分类 */
  getAllCategory() {
    return request({
      method: 'get',
      url: `${BASE_API}/all/category`
    })
  },
  /* 获取所有标签 */
  getAllTag() {
    return request({
      method: 'get',
      url: `${BASE_API}/all/tag`
    })
  }
}