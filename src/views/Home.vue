<template>
  <div class="home">
    <banner isHome="true" :src="bannerUrl"></banner>
    <el-row type="flex" justify="space-around">
      <el-col :span="4" :xs="0" class="left-sticky">
        <el-card style="max-width: 294px">
          <ul class="category-list">
            <li>
              <a href="/" class="category-item">
                <div class="category-left">
                  <span>全部分类</span>
                </div>
                <div class="category-right">
                  <span class="counts">{{ categoryArticleCount }} </span>
                </div>
              </a>
            </li>
            <li v-for="category in categories" :key="category.id">
              <a :href="'#/category/' + category.id + '/' + category.name" class="category-item">
                <div class="category-left">
                  <span>{{ category.name }} </span>
                </div>
                <div class="category-right">
                  <span class="counts">{{ category.articleCount }} </span>
                </div>
              </a>
            </li>
          </ul>
        </el-card>

        <el-card class="box-card" style="max-width: 294px; margin-top: 20px">
          <div slot="header" class="clearfix">
            <span style="font-size: 17px; color: #6f6f6f;">标签</span>
          </div>
          <div>
            <el-tag
              v-for="tag in tags"
              :key="tag.id"
              effect="plain"
              style="margin: 0 5px 5px 0;"
            >
              <a :href="'#/tag/' + tag.id + '/' + tag.name">
                {{ tag.name }}({{ tag.articleCount }})
              </a>
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" :xs="24">
        <div class="site-content animate">
          <!--通知栏-->
          <div class="notify">
            <div class="search-result" v-if="hideSlogan">
              <span v-if="searchWords"
                >搜索结果："{{ searchWords }}" 相关文章</span
              >
              <span v-else-if="category">分类 "{{ name }}" 相关文章</span>
              <span v-else-if="tagInfo">标签 "{{ name }}" 相关文章</span>
            </div>
            <quote v-else>{{ notice }}</quote>
          </div>

          <!--焦点图-->
          <div class="top-feature" v-if="!hideSlogan">
            <section-title>
              <div style="display: flex; align-items: flex-end">
                聚焦<small-ico></small-ico>
              </div>
            </section-title>
            <div class="feature-content">
              <div
                class="feature-item"
                v-for="item in features"
                :key="item.title"
              >
                <Feature :data="item"></Feature>
              </div>
            </div>
          </div>
          <!--文章列表-->
          <main class="site-main" :class="{ search: hideSlogan }">
            <section-title v-if="!hideSlogan">推荐</section-title>
            <template v-for="item in articles">
              <post :post="item" :key="item.id"></post>
            </template>
          </main>

          <!--加载更多-->
          <div class="more" v-show="hasNextPage">
            <div class="more-btn" @click="getMoreArticles">More</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4" :xs="0"></el-col>
    </el-row>
  </div>
</template>

<script>
import Banner from "@/components/banner";
import Feature from "@/components/feature";
import sectionTitle from "@/components/section-title";
import Post from "@/components/post";
import SmallIco from "@/components/small-ico";
import Quote from "@/components/quote";

import homeApi from "@/api/home";
import siteApi from "@/api/site";

export default {
  name: "Home",
  data() {
    return {
      /* 焦点图数据 */
      features: [],
      /* 文章列表数据 */
      articles: [],
      /* 当前页 */
      currPage: 1,
      /* 当页显示数 */
      size: 2,
      /* 是否存在下一页 */
      hasNextPage: false,
      /* 文章查询对象 */
      articleQuery: {
        title: "",
        cateId: "",
        tagId: "",
      },
      /* 首页背景图 */
      bannerUrl: "",
      /* 分类 */
      categories: [],
      /* 分类的文章总数 */
      categoryArticleCount: 0,
      /* 标签 */
      tags: [],
    };
  },
  components: {
    Banner,
    Feature,
    sectionTitle,
    Post,
    SmallIco,
    Quote,
  },
  computed: {
    searchWords() {
      return this.$route.params.words;
    },
    category() {
      return this.$route.params.cate;
    },
    tagInfo() {
      return this.$route.params.tag;
    },
    name() {
      return this.$route.params.name
    },
    hideSlogan() {
      return this.category || this.searchWords || this.tagInfo;
    },
    notice() {
      return this.$store.getters.notice;
    },
  },
  mounted() {
    this.getFocusImages();
    this.getArticlesList();
    this.getHomeBanner();
    this.getAllCategory();
    this.getAllTag();
  },
  watch: {
    /* 监听路由变化 */
    $route(newValue, oldValue) {
      this.getArticlesList();
    },
  },
  methods: {
    /* 获取文章列表数据 */
    getArticlesList() {
      this.articleQuery.title = this.searchWords;
      this.articleQuery.cateId = this.category;
      this.articleQuery.tagId = this.tagInfo;
      // 调用api
      homeApi
        .getArticlePage(this.currPage, this.size, this.articleQuery)
        .then((res) => {
          this.articles = res.data.articles;
          this.currPage = res.data.current;
          this.hasNextPage = res.data.hasNext;
        });
    },
    /* 获取更多的文章列表数据 */
    getMoreArticles() {
      // 调用api
      homeApi
        .getArticlePage(this.currPage + 1, this.size, this.articleQuery)
        .then((res) => {
          this.articles = this.articles.concat(res.data.articles);
          this.currPage = res.data.current;
          this.hasNextPage = res.data.hasNext;
        });
    },
    /* 获取焦点图数据 */
    getFocusImages() {
      homeApi.getFeatures().then((res) => {
        this.features = res.data.features;
      });
    },
    /* 获取首页背景图 */
    getHomeBanner() {
      siteApi.selectSiteInfo().then((res) => {
        this.bannerUrl = res.data.siteInfo.banner;
      });
    },
    /* 获取所有的分类 */
    getAllCategory() {
      // 调用api
      homeApi.getAllCategory().then((res) => {
        this.categories = res.data.categories;
        this.categoryArticleCount = res.data.total;
      });
    },
    /* 获取所有的标签 */
    getAllTag() {
      // 调用api
      homeApi.getAllTag().then((res) => {
        this.tags = res.data.tags;
      });
    },
  },
};
</script>
<style scoped lang="less">
.left-sticky {
  position: relative;
  top: 60px;
  left: 50px;
  .category-list {
    .category-item {
      justify-content: space-between;

      .counts {
        margin-right: 20px;
        background-color: #f5f5f5;
        color: #4a4a4a;
        padding: 0.75em;
        font-size: 0.75rem;
        border-radius: 4px;
      }
    }
    li a {
      padding-left: 20px;
      font-size: 15px;
      height: 54px;
      position: relative;
      display: flex;
      align-items: center;
      color: #4f6174;
      font-weight: 500;
      margin-bottom: 3px;
      border-radius: 5px 0 0 5px;
      transition: all 0.5s;
    }
  }
}
.site-content {
  .notify {
    margin: 60px 0;
    border-radius: 3px;
    & > div {
      padding: 20px;
    }
  }

  .search-result {
    padding: 15px 20px;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    border: 1px dashed #ddd;
    color: #828282;
  }
}

.top-feature {
  width: 100%;
  height: auto;
  margin-top: 30px;

  .feature-content {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;

    .feature-item {
      width: 32.9%;
    }
  }
}

.site-main {
  padding-top: 80px;

  &.search {
    padding-top: 0;
  }
}

.more {
  margin: 50px 0;
  .more-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #adadad;
    border: 1px solid #adadad;
    border-radius: 20px;
    margin: 0 auto;
    cursor: pointer;
    &:hover {
      color: #8fd0cc;
      border: 1px dashed #8fd0cc;
    }
  }
}

/******/
@media (max-width: 800px) {
  .top-feature {
    display: none;
  }

  .site-main {
    padding-top: 40px;
  }

  .site-content {
    .notify {
      margin: 30px 0 0 0;
    }

    .search-result {
      margin-bottom: 20px;
      font-size: 16px;
    }
  }
}

/******/
</style>
