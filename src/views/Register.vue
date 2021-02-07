<template>
  <div class="page-register">
    <div class="normal">
      <h2>欢迎回来</h2>
      <el-form
        :model="registerForm"
        :rules="registerFormRules"
        ref="registerFormRef"
      >
        <el-form-item prop="nickname">
          <el-input
            v-model="registerForm.nickname"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            v-model="registerForm.pass"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            type="email"
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            type="email"
            v-model="registerForm.code"
            placeholder="验证码"
            style="width: 170px"
          ></el-input>
          <el-button @click="sendMailCode" :disabled="codeState" type="primary" style="float: right"
            >{{codeText}} </el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            size="medium"
            type="primary"
            @click="toRegister"
            style="width: 100%"
            >立即注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import ucenterApi from "@/api/ucenter";
import mailApi from '@/api/mail'

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
    var validatePass = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length > 5 && value.length < 16) {
          if (this.registerForm.pass !== "") {
            this.$refs.registerFormRef.validateField("checkPass");
          }
          callback();
        } else {
          callback(new Error("密码长度为6-15个字符"));
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      /* 注册表单 */
      registerForm: {},
      /* 注册表单校验规则 */
      registerFormRules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      /* 验证码文本 */
      codeText: "获取验证码",
      /* 获取验证码间隔时长 */
      timer: 60,
      /* 控制验证码按钮状态 */
      codeState: false
    };
  },
  methods: {
    /* 访客注册 */
    toRegister() {
      this.$refs['registerFormRef'].validate((valid) => {
        if (valid) {
          // 调用api
          ucenterApi.toRegister(this.registerForm).then(res => {
            // 提示
            this.$message.success("注册成功")
            // 跳转到登录页
            this.$router.push("/login")
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 发送验证码 */
    sendMailCode() {
      // 判断邮件地址
      if (this.registerForm.email) {
        // 调用api
        mailApi.sendMailCode(this.registerForm.email).then((res) => {
          // 提示
          this.$message.success("验证码发送成功，请注意查收");
          // 调用定时器
          this.codeTimer()
        });
      } else {
        this.$message.warning("请先填写邮件地址");
      }
    },
    /* 验证码定时器 */
    codeTimer() {
      var timer = setInterval(() => {
          --this.timer
          this.codeText = this.timer
          // 按钮改为不可用
          this.codeState = true
          if (this.timer < 1) {
            // 关闭定时器
            clearInterval(timer)
            this.codeText = "获取验证码"
            this.codeState = false
            // 还原倒计时
            this.timer = 60
          }
        }, 1000);
    }
  },
};
</script>

<style scoped lang="less">
.page-register {
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
      font-size: 30px;
      align-items: center;
      margin: 0 10px;
    }
  }
}
</style>