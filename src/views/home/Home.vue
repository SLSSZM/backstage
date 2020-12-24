<template>
  <el-container>
    <el-header>
      <div></div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push('./login');
    }
  }
};
</script>

<style scoped>
</style>