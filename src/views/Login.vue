<template>
  <div class="page-login">
    <div class="normal">
      <h2>欢迎回来</h2>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="email">
          <el-input
            type="email"
            v-model="loginForm.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button size="medium" @click="toRegister">去注册</el-button>
          <el-button size="medium" type="primary" @click="toLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 第三方登录 -->
    <div class="other">
      <a :href="BASE_API + 'ucenter/login/github/'">
        <i class="iconfont icongithub" style="color: #333"></i>
      </a>
      <a :href="BASE_API + 'ucenter/login/gitee/'">
        <i class="iconfont icongitee" style="color: rgb(199, 29, 35)"></i>
      </a>
    </div>
  </div>
</template>

<script>
import ucenterApi from "@/api/ucenter";

export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入邮箱地址"));
      }
      var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (re.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法的邮箱地址"));
      }
    };
    return {
      /* 登录表单 */
      loginForm: {},
      /* 登录表单验证规则 */
      loginFormRules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      BASE_API: process.env.VUE_APP_BASE_API
    };
  },
  methods: {
    /* 访客登录 */
    toLogin() {
      this.$refs["loginFormRef"].validate((valid) => {
        if (valid) {
          // 校验成功，调用api
          ucenterApi.toLogin(this.loginForm).then((res) => {
            // 提示
            this.$message.success("登录成功");
            // 设置token
            console.log(res.data.token);
            this.$store.commit("SET_TOKEN", res.data.token);
            // 跳转到首页
            this.$router.push("/");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 跳转到注册页面 */
    toRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped lang="less">
.page-login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(240, 242, 245);
  height: 100%;
  width: 100%;
  position: fixed;

  h2 {
    text-align: center;
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 20px;
  }

  .normal {
    width: 340px;
    position: relative;
    top: -150px;
  }

  .other {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
    top: -150px;

    i {
      font-size: 34px;
      align-items: center;
      margin: 0 10px;
    }
  }
}
</style>