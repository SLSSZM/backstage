<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 内容表格区 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="roleName" label="权限"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="showDeleteDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <!-- 设置角色按钮 -->
            <el-tooltip
              effect="dark"
              content="更改角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogColse"
    >
      <!-- 内容区 -->
      <el-form
        :model="addUserData"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      ref="editUserRef"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容区 -->
      <el-form
        :model="editUser"
        :rules="editUserRules"
        ref="editUserRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) return callback();
      return callback("请输入正确的邮箱");
    };
    //验证手机的规则
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) return callback();
      return callback(new Error("请输入正确的手机"));
    };
    return {
      //获取用户列表的请求参数
      queryInfo: {
        //查询条件
        query: "",
        //当前页数
        pagenum: 1,
        //当前页显示多少条数据
        pagesize: 5,
      },
      //数据
      userList: [],
      //总数据
      total: 0,
      //添加用户对话框的显示和隐藏
      addDialogVisible: false,
      //添加用户的数据
      addUserData: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加用户的验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "用户名长度在3~8个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在6~16个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //修改用户对话框的显示和隐藏
      editDialogVisible: false,
      //修改用户对话框的数据
      editUser: {},
      //修改用户数据的验证规则
      editUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取数据
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status === 403) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.totalpage;
    },
    //切换每页显示的数据数量
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //页数发生改变
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getUserList();
    },
    //监听添加用户对话框关闭事件
    addDialogColse() {
      this.$refs.addUserRef.resetFields();
    },
    //提交添加用户数据
    addUser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("/users", this.addUserData);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        //成功添加关闭添加用户对话框
        this.addDialogVisible = false;
        //重新查询用户列表
        this.getUserList();
      });
    },
    //获取修改用户对话框数据
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("/users/" + id);
      this.editUser = res.editUser;
      this.editDialogVisible = true;
    },
    //监听修改用户对话框关闭事件
    editDialogClosed() {
      this.$refs.editUserRef.resetFields();
    },
    //提交修改用户数据
    editUserInfo() {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "/users/" + this.editUser._id,
          {
            emial: this.editUser.email,
            mobile: this.editUser.mobile,
          }
        );
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        //关闭对话框
        this.editDialogVisible = false;
        //刷新用户列表
        this.getUserList();
      });
    },
    //删除用户
    async showDeleteDialog(id) {
      const result = await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if(result === 'confirm') {
        const {data: res} = await this.$http.delete('/users/' + id);
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        //判断删除的是不是当前页最后一个数据
        if(this.userList.length === 1) this.queryInfo.pagenum--;
        // 刷新用户列表
        this.getUserList();
      }else {
        this.$message.info('取消删除');
      }
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style scoped>
</style>