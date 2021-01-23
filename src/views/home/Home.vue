<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>PC后台管理</div>
      <el-button icon="el-icon-delete" plain @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <home-aside></home-aside>
      <!-- 内容区 -->
      <home-main></home-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeAside from './children/HomeAside';
import HomeMain from './children/HomeMain'

export default {
  components: {
    HomeAside,
    HomeMain
  },
  methods: {
    //退出登录
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("./login");
    }
  }
};
</script>

<style scoped>
.home-container {
  /* padding: 30px; */
  height: 100%;
}
.el-header {
  background-color: #b9c7d4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  color: #fff;
}
</style>