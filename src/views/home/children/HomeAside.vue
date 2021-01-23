<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <!-- 折叠按钮 -->
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu :unique-opened="true" 
    :collapse="isCollapse" 
    :collapse-transition="false"
    :router="true"
    :default-active="$route.path">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconList[item.authname]"></i>
          <span>{{ item.authname }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item-group
          v-for="children in item.children"
          :key="children.id"
          @click="activeClick(children.path)">
          <el-menu-item :index="'/' + children.path">
            <i class="el-icon-menu"></i>
            <span>{{ children.authname }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      //菜单列表
      menuList: [],
      //一级菜单的图标
      iconList: {
        用户管理: "el-icon-user-solid",
        权限管理: "el-icon-s-tools",
        商品管理: "el-icon-s-goods",
        订单管理: "el-icon-s-order",
        数据统计: "el-icon-s-marketing",
      },
      //是否折叠
      isCollapse: false
    };
  },
  methods: {
    //获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get("menu");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    //是否折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    //在创建前获取菜单列表
    this.getMenuList();
  },
};
</script>

<style scoped>
.toggle-button {
  color: #fff;
  height: 24px;
  text-align: center;
  background-color: #dbe4ec;
  cursor: pointer;
  letter-spacing: 0.2em;
  vertical-align: middle;
}
</style>