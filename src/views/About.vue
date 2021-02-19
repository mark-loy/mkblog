<template>
  <div class="about">
    <div class="site-content">
      <div class="content-warp">
        <div class="about-site about-info">
          <section-title><span>❤</span>关于博客</section-title>
          <div class="info-card">
            <p>
              我得非常感谢 fengziy (就叫疯子先生吧)，他提供了一套完善的前端的个人博客模板，省了我很多不必要的时间，必须支持疯子先生。想了解疯子先生的博客模板的，可以看看
            </p>
            <p>
              <a
                target="_blank"
                href="https://gitee.com/fengziy/Gblog"
                style="color: #ff6d6d"
                >Gitee仓库</a
              >
              |
              <a
                target="_blank"
                href="https://github.com/fengziye/Gblog"
                style="color: #ff6d6d"
                >Github仓库</a
              >记得star★哟
            </p>
          </div>
        </div>
        <div class="about-me about-info">
          <section-title id="Guestbook"><span>❤</span>给我留言</section-title>
          <div class="info-card">
            <div class="contactForm">
              <div class="form-item">
                <label for="mail">邮箱</label>
                <input
                  class="v"
                  type="email"
                  v-model="guestbookForm.mail"
                  name="mail"
                  id="mail"
                />
              </div>
              <div class="form-item">
                <label for="content">内容</label>
                <textarea
                  class="v"
                  id="content"
                  v-model="guestbookForm.content"
                  name="content"
                  rows="4"
                ></textarea>
              </div>
              <div class="form-item">
                <label></label>
                <button @click="saveGuestbook">提交</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sectionTitle from "@/components/section-title";
import { getTime, getTimeInterval } from "@/utils";
// import Quote from "@/components/quote";
import siteApi from "@/api/site";

export default {
  name: "About",
  data() {
    return {
      list: [],
      /* 留言表单 */
      guestbookForm: {
        mail: "",
        content: "",
      },
    };
  },
  components: {
    // Quote,
    sectionTitle,
  },
  methods: {
    /* 保存留言 */
    saveGuestbook() {
      // 验证表单项
      if (this.guestbookForm.mail && this.guestbookForm.content) {
        siteApi.saveGuestbook(this.guestbookForm).then((res) => {
          // 提示
          this.$message.success("留言成功");
          // 清空表单
          this.guestbookForm = {};
        });
      } else {
          this.$message.error("请将留言信息填写完整")
      }
    },
  },
  mounted() {},
};
</script>
<style scoped lang="less">
.about {
  padding-top: 40px;
}

.content-warp {
  margin-top: 80px;

  .about-info {
    margin: 30px 0;

    span {
      color: red;
      margin-right: 10px;
    }

    .info-card {
      min-height: 100px;
      padding: 20px;
      border-radius: 3px;
      margin: 30px 0 50px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      p {
        line-height: 1.7rem;
      }
    }
  }
  .contactForm {
    width: 100%;
    padding: 20px;
    .form-item {
      align-items: center;
      display: flex;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      label {
        width: 80px;
      }
      .v {
        min-height: 40px;
        line-height: 20px;
        border-radius: 3px;
        padding: 2px 10px;
        outline: none;
        border: 1px solid #8fd0cc;
        width: 100%;
        resize: vertical;
      }
      button {
        width: 100px;
        height: 40px;
        border-radius: 3px;
        outline: 0;
        border-style: none;
        cursor: pointer;
        background-color: #409eff;
        color: white;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

/*******/
@media (max-width: 800px) {
  .content-warp {
    margin-top: 0;
  }
}
</style>
