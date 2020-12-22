<template>
  <div class="login">
    <div class="login-item">
      <div class="login-avatar">
        <img src="../../assets/images/login.png" alt="avatar">
      </div>
      <!-- 表单 -->
      <el-form ref="loginFormRef" class="login-form" :rules="loginFormRules" :model="loginForm">
        <div class="title">PC后台管理</div>
        <div class="login-text">
          <el-button type="text">注册账号</el-button>
          <el-button type="text">忘记密码</el-button>
        </div>
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input placeholder="账号" prefix-icon="el-icon-user-solid" 
            v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input placeholder="密码" prefix-icon="el-icon-lock" 
            type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 登录 -->
        <el-form-item class="login-button">
          <el-button type="primary" @click="login" round>登录</el-button>
          <el-button type="info" @click="resetLoginForm" round>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //登录表单验证规则
      loginFormRules: {
        username: [
          {required: true, message: "请输入登录账号", trigger: "blur"},
          {min: 3, max: 10, message: '请输入3到10个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: "请输入登录密码", trigger: "blur"},
          {min: 3, max: 10, message: '请输入3到10个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        const{ data: res } = await this.$http.post('login', this.loginForm);
        if(res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        //将token保存在sessionstorage中
        window.sessionStorage.setItem('token', res.data.token);
        this.$router.push('/home');
      });
    }
  }
};
</script>

<style scoped>
.login {
  height: 100%;
}
.login-item {
  width: 450px;
  height: 300px;
  border: 1px solid #eee;
  border-radius: 15px;
  box-shadow: 0 0 3px #ccc;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;
}
.login-button {
  display: flex;
  justify-content: flex-end;
}
.login-text {
  display: flex;
  justify-content: space-between;
}
.title {
  color: rgb(17, 87, 59);
  font-size: 20px;
}

.login-avatar {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.login-avatar img {
  height: 100%;
  border-radius: 50%;
}
</style>