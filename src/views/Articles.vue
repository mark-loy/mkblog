<template>
  <div class="articles">
    <banner :src="article.imageUrl"></banner>
    <div class="site-content animate">
      <!-- 文章目录 -->
      <div id="article-menus" v-if="menus.length !== 0">
        <menu-tree :menus="menus" child-label="child"></menu-tree>
      </div>
      <main class="site-main" :style="'margin-top:' + height + 'px'">
        <article class="hentry">
          <!-- 文章头部 -->
          <header class="entry-header">
            <!-- 标题输出 -->
            <h1 class="entry-title">{{ article.title }}</h1>
            <hr />
            <div class="breadcrumbs">
              <div id="crumbs">最后更新时间：{{ article.gmtModified }}</div>
            </div>
          </header>
          <!-- 正文输出 -->
          <div class="entry-content" v-html="article.content"></div>
          <!-- 文章底部 -->
          <section-title>
            <footer class="post-footer">
              <!-- 阅读次数 -->
              <div class="post-like">
                <i class="iconfont iconeyes"></i>
                <span class="count">{{ article.viewCount }} </span>
              </div>
              <!-- 分享按钮 -->
              <!-- <div class="post-share">
                <ul class="sharehidden">
                  <li>
                    <a
                      href="http://qr.liantu.com/api.php?text=https://zhebk.cn/Web/gongan.html"
                      onclick="window.open(this.href, 'renren-share', 'width=490,height=700');return false;"
                      class="s-weixin"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      ><img
                        src="https://cdn.zhebk.cn/usr/themes/Akina/images/wechat.png"
                    /></a>
                  </li>
                  <li>
                    <a
                      href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=https://zhebk.cn/Web/gongan.html/&amp;title=公安联网备案记录"
                      onclick="window.open(this.href, 'weibo-share', 'width=730,height=500');return false;"
                      class="s-qq"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      ><img
                        src="https://cdn.zhebk.cn/usr/themes/Akina/images/qzone.png"
                    /></a>
                  </li>
                  <li>
                    <a
                      href="http://service.weibo.com/share/share.php?url=https://zhebk.cn/Web/gongan.html/&amp;title=公安联网备案记录"
                      onclick="window.open(this.href, 'weibo-share', 'width=550,height=235');return false;"
                      class="s-sina"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      ><img
                        src="https://cdn.zhebk.cn/usr/themes/Akina/images/sina.png"
                    /></a>
                  </li>
                  <li>
                    <a
                      href="http://shuo.douban.com/!service/share?https://zhebk.cn/Web/gongan.html/&amp;title=公安联网备案记录"
                      onclick="window.open(this.href, 'renren-share', 'width=490,height=600');return false;"
                      class="s-douban"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      ><img
                        src="https://cdn.zhebk.cn/usr/themes/Akina/images/douban.png"
                    /></a>
                  </li>
                </ul>
                <i class="iconfont show-share"></i>
              </div> -->
              <!-- 赞助按钮 -->
              <div class="donate" @click="showDonate = !showDonate">
                <span>赏</span>
                <ul class="donate_inner" :class="{ show: showDonate }">
                  <li class="wedonate">
                    <img src="http://cdn.fengziy.cn/gblog/wexin_pay.png" />
                    <p>微信</p>
                  </li>
                  <li class="alidonate">
                    <img src="http://cdn.fengziy.cn/gblog/ali_pay.jpg" />
                    <p>支付宝</p>
                  </li>
                </ul>
              </div>
              <!-- 文章分类 -->
              <div class="post-tags">
                <i class="iconfont iconcategory"></i>
                <!-- TODO 分类 -->
                <router-link :to="'/category/' + article.cateId"
                  >{{ article.cateName }}
                </router-link>
              </div>
            </footer>
          </section-title>

          <!--声明-->
          <div class="open-message">
            <p>
              声明：muke博客|版权所有，违者必究|如未注明，均为原创|本网站采用<a
                href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
                target="_blank"
                >BY-NC-SA</a
              >协议进行授权
            </p>
            <p>
              转载：转载请注明原文链接 -
              <a :href="'/article/' + article.id">{{ article.title }} </a>
            </p>
          </div>
          <!-- 评论编辑区 -->
          <div>
            <div>全部评论({{total}})</div>
            <comment-message-editor
              class="comment-editor"
              buttonText="评论"
              @submit="submitComment"
              ref="commentEditorRef"
            ></comment-message-editor>
          </div>
          <!--评论-->
          <div class="comments">
            <comment v-for="item in comments" :key="item.id" :comment="item" :articleId="article.id" :parentId="item.id" @refreshComments="getComment">
              <template v-if="item.children.length">
                <comment
                  v-for="reply in item.children"
                  :key="reply.id"
                  :comment="reply"
                  :articleId="article.id"
                  :parentId="item.id"
                  @refreshComments="getComment"
                ></comment>
              </template>
            </comment>
          </div>
        </article>
      </main>
    </div>
  </div>
</template>

<script>
import Banner from "@/components/banner";
import sectionTitle from "@/components/section-title";
import comment from "@/components/comment";
import menuTree from "@/components/menu-tree";

import articleApi from "@/api/article";

import commentMessageEditor from "comment-message-editor";

// 引入代码高亮插件
import Prism from "prismjs";

export default {
  name: "articles",
  data() {
    return {
      /* 文章对象 */
      article: {},
      showDonate: false,
      /* 评论列表 */
      comments: [],
      /* 评论总数 */
      total: 0,
      /* 评论表单 */
      commentForm: {
        /* 文章id */
        articleId: '',
        /* 评论类型 */
        parentId: 0,
        /* 接收人id */
        acceptId: '',
        /* 评论内容 */
        content: ''
      },
      /* 目录 */
      menus: [],
      height: 0,
    };
  },
  components: {
    Banner,
    sectionTitle,
    comment,
    menuTree,
    Prism,
    commentMessageEditor,
  },
  created() {
    // 获取路由中的文章id
    if (this.$route.params && this.$route.params.id) {
      this.article.id = this.$route.params.id;
    }
    this.getArticleDetail();
    this.getComment();
  },
  mounted() {
    // 等待页面目录渲染完整
    setTimeout(() => {
      this.menusDivHeight();
    }, 200);
  },
  methods: {
    /* 获取文章详情数据 */
    getArticleDetail() {
      // 调用api
      articleApi.getArticleDetail(this.article.id).then((res) => {
        // 设置文章详情数据
        this.article = res.data.article;
        // 当数据渲染完毕执行
        this.$nextTick(() => {
          // 生成目录
          this.createMenus();
          this.createPreCode();
          Prism.highlightAll();
        });
      });
    },
    /* 获取文章评论 */
    getComment() {
      // 调用api
      articleApi.selectArticleComments(this.article.id).then((res) => {
        // 设置评论数据
        this.comments = res.data.comments;
        this.total = res.data.total
      });
    },
    fetchH(arr, left, right) {
      if (right) {
        return arr.filter(
          (item) => item.offsetTop > left && item.offsetTop < right
        );
      } else {
        return arr.filter((item) => item.offsetTop > left);
      }
    },
    /* 获取目录div的高度 */
    menusDivHeight() {
      let e = document.querySelector("#article-menus");
      if (e !== null) {
        this.height = -e.offsetHeight;
      }
    },
    // 生成目录
    createMenus() {
      let arr = [];
      for (let i = 6; i > 0; i--) {
        let temp = [];
        // 获取文章内容中所有的标题标签
        let e = document
          .querySelector(".entry-content")
          .querySelectorAll(`h${i}`);
        for (let j = 0; j < e.length; j++) {
          // 为标题标签设置id属性
          e[j].setAttribute("id", e[j].innerText);
          let child = this.fetchH(
            arr,
            e[j].offsetTop,
            j + 1 === e.length ? undefined : e[j + 1].offsetTop
          );
          temp.push({
            h: i,
            title: e[j].innerText,
            id: e[j].id,
            offsetTop: e[j].offsetTop,
            child,
          });
        }
        if (temp.length) {
          arr = temp;
        }
      }
      this.menus = arr;
    },
    /* 重新给代码区域设置class */
    createPreCode() {
      // 获取所有代码片段区域
      let pres = document.querySelectorAll("pre");
      // 判断是否存在代码区域
      if (pres.length) {
        // 遍历
        for (let i = 0; i < pres.length; i++) {
          const pre = pres[i];
          const code = pre.childNodes[0];
          // 获取当前pre的class属性
          let preClass = pre.getAttribute("class");
          // 截取出class的语言部分
          let language = preClass.split("-")[1];
          // 重新设置class
          pre.setAttribute("class", "");
          code.setAttribute("class", "language-" + language);
        }
      }
    },
    /* 提交文章评论 */
    submitComment(v) {
      // 验证访客是否登录
      if(this.$store.state.token) {
        // 设置评论的提交表单
        this.commentForm.articleId = this.article.id
        this.commentForm.acceptId = this.article.userId
        this.commentForm.content = v
        // 调用api
        articleApi.saveComment(this.commentForm).then(res => {
          // 提示
          this.$message.success("评论成功")
          // 刷新评论数据
          window.location.href = "/article/" + this.article.id
        })
      } else{
        // 提示
        this.$message.warning("登录后评论")
      }
    },
  },
};
</script>
<style scoped lang="less">
.site-content {
  position: relative;
  .site-main {
    padding: 80px 0 0 0;
  }
}
#article-menus {
  position: sticky;
  top: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 15px;
  width: 300px;
  transform: translateX(-120%) translateY(150px);
  font-size: 14px;
}
article.hentry {
  .entry-header {
    .entry-title {
      font-size: 23px;
      font-weight: 600;
      color: #737373;
      margin: 0.67em 0;

      &:before {
        content: "#";
        margin-right: 6px;
        color: #d82e16;
        font-size: 20px;
        font-weight: 600;
      }
    }

    hr {
      height: 1px;
      border: 0;
      background: #efefef;
      margin: 15px 0;
    }

    .breadcrumbs {
      font-size: 14px;
      color: #d2d2d2;
      text-decoration: none;
      margin-bottom: 30px;
    }
  }

  .entry-content {
  }

  footer.post-footer {
    width: 100%;
    padding: 20px 10px;
    margin-top: 30px;
    height: 65px;
    position: relative;
    i {
      font-size: 18px;
      margin-right: 5px;
    }
    .post-like {
      float: right;
      margin: 7px 0 0 20px;
    }

    .post-share {
      float: right;
      list-style: none;
      margin-right: 20px;
    }

    .donate {
      float: left;
      line-height: 36px;
      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border: 1px solid #2b2b2b;
      &:hover {
        border: 1px solid goldenrod;
        span {
          color: goldenrod;
        }
      }
      span {
        color: #2b2b2b;
        padding: 10px;
        position: relative;
        cursor: pointer;
      }

      .donate_inner {
        display: none;
        margin: 0;
        list-style: none;
        position: absolute;
        left: 80px;
        top: -40px;
        background: #fff;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 3px;
        &.show {
          display: block;
        }
        li {
          float: left;
        }

        img {
          width: 100px;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #d2d2d2;
          line-height: 1rem;
        }
      }

      .donate_inner:after,
      .donate_inner:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 45%;
        margin-left: -8px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
      }

      .donate_inner:before {
        left: -1px;
        border-right: 8px solid #ddd;
      }
    }

    .post-tags {
      margin: 7px 0 0 20px;
      float: left;
      text-transform: uppercase;
      a:hover {
        color: #ff6d6d;
      }
    }
  }
  .open-message {
    margin: 50px 0;
    position: relative;
    background: #2b2b2b;
    padding: 10px 30px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    &:after {
      content: "";
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #2b2b2b;
      position: absolute;
      top: -8px;
      left: 48%;
    }
    p {
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a {
      color: #a0dad0;
      padding: 0 5px;
    }
  }

  .comment-editor {
    margin: 20px 0;
  }
}
</style>
