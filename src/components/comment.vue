<template>
  <div
    class="comment"
    :id="`comment${comment.id}`"
    v-if="Object.keys(comment).length > 0"
  >
    <div class="comment-head">
      <div class="user-avatar"><img :src="comment.visitorAvatar" alt="" /></div>
      <div class="head-right">
        <section-title>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div>
              <span class="from-user user-name">{{ comment.visitorName }}</span>
              <span class="to-user" v-if="comment.acceptId"
                ><span style="margin: 0 5px">@</span
                ><span class="user-name">{{ comment.acceptName }}</span></span
              >
            </div>
            <div style="font-size: 13px">
              <span style="color: #9c9c9c; margin-right: 20px">{{
                comment.gmtCreate.substr(0, 16)
              }}</span>
              <span
                @click.stop="showCommentEditor = true"
                style="cursor: pointer"
                >回复</span
              >
            </div>
          </div>
        </section-title>
      </div>
    </div>
    <div class="comment-body">
      <div class="content-text">
        <p>{{ comment.content }}</p>
      </div>
      <div v-if="showCommentEditor" @click.stop="">
        <comment-message-editor
          :inline="true"
          buttonText="回复"
          @submit="submitReply"
        ></comment-message-editor>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import sectionTitle from "@/components/section-title";
import commentMessageEditor from "comment-message-editor";

import articleApi from "@/api/article";

export default {
  name: "comment",
  props: {
    comment: {
      type: Object,
    },
    articleId: {
      type: String,
      default: "",
    },
    parentId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showCommentEditor: false,
      /* 评论表单 */
      commentForm: {
          content: ''
      },
    };
  },
  watch: {
    showCommentEditor(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    },
  },
  components: {
    sectionTitle,
    commentMessageEditor,
  },
  methods: {
    reply(id) {
      const ref = `comment${id}`;
    },
    /* 提交回复 */
    submitReply(v) {
      // 验证访客是否登录
      if (this.$store.state.token) {
        // 设置评论的提交表单
        this.commentForm.articleId = this.articleId;
        this.commentForm.acceptId = this.comment.visitorId;
        this.commentForm.parentId = this.parentId;
        this.commentForm.content = v;
        // 调用api
        articleApi.saveComment(this.commentForm).then((res) => {
          // 提示
          this.$message.success("评论成功");
          this.$emit("refreshComments");
        });
      } else {
        // 提示
        this.$message.warning("登录后评论");
      }
    },
    close() {
      this.showCommentEditor = false;
    },
  },
};
</script>

<style scoped lang="less">
.comment {
  margin: 20px 0;
}
.comment-head {
  display: flex;
  .head-right {
    flex: 1;
  }
  .user-name {
    color: #8fd0cc;
  }
}
.comment-body {
  padding-left: 80px;
  .content-text {
    /*padding-bottom: 30px;*/
    margin-bottom: 30px;
    font-size: 14px;
    color: #9c9c9c;
    line-height: 1.3rem;
  }
}
.user-avatar {
  width: 50px;
  height: 50px;
  margin-right: 30px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
}
@media (max-width: 600px) {
  .comment-body {
    padding-left: 15px;
    .content-text {
      margin-top: 10px;
    }
  }
  .user-avatar {
    margin-right: 10px;
  }
}
</style>
