<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加用户按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" 
          @click="addDialogVisible=true">
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <!-- 内容表格区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['dbBottom', index1 === 0 ? 'dbTop' : '', 'vcenter']" 
            v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag type="parmary"  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'dbTop', 'vcenter']" 
                v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"  closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" 
                    :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" 
            icon="el-icon-edit" 
            size="mini"
            @click="showEditDialog(scope.row._id)">编辑</el-button>
            <el-button type="danger" 
            icon="el-icon-delete" 
            size="mini"
            @click="showDeleteDialog(scope.row._id)">删除</el-button>
            <el-button type="warning" 
            icon="el-icon-setting" 
            size="mini"
            @click="showSetRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="addDialogVisible"
    @close="addDialogColse"
    width="50%">
      <el-form
        :model="addRoleFrom"
        :rules="addRoleRules"
        ref="addRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
    title="编辑角色"
    :visible.sync="editDialogVisible"
    @close="editDialogColse"
    width="50%">
      <el-form
        :model="editRoleFrom"
        :rules="editRoleRules"
        ref="editRoleRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 分配权限对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="setRightsDialog"
    width="50%"
    @close="setRightsDialogClose">
      <!-- 树形控件 -->
      <el-tree :data="setRightsList" :props="treeProps" show-checkbox 
      default-expand-all node-key="id" :default-checked-keys="defKeys"
      ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //角色列表
      rolesList: [],

      //添加角色数据
      addRoleFrom: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色对话框的显示与隐藏
      addDialogVisible: false,
      //添加角色的规则
      addRoleRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3, max: 6, trigger: 'blur'}
        ]
      },

      //编辑角色数据
      editRoleFrom: {},
      //添加角色对话框的显示与隐藏
      editDialogVisible: false,
      //编辑角色的规则
      editRoleRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3, max: 6, trigger: 'blur'}
        ]
      },

      //分配权限数据
      setRightsList: [],
      //分配权限对话框的显示与隐藏
      setRightsDialog: false,
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //树形控件默认勾选的数据
      defKeys: [],
      roleId: ''
    }
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const {data: res} = await this.$http.get('roles');
      if(res.meta.status !== 201) {
        return this.$message.error('获取用户列表失败');
      }
      this.rolesList = res.data;
      this.$message.success(res.meta.msg);
    },
    //根据id删除用户权限
    async removeRightById(role, right) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(res => res)
      if(confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      //获取数据
      const {data: res} = await this.$http.delete(`roles/${role._id}/rights/${right}`);
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      //用双向绑定来实现无刷新更新页面
      role.children = res.data.children;
    },
    //添加角色对话框关闭重置内容
    addDialogColse() {
      this.$refs.addRoleRef.resetFields();
    },
    //编辑角色对话框关闭重置内容
    editDialogColse() {
      this.$refs.editRoleRef.resetFields();
    },
    //添加用户
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if(!valid) return
        const {data: res} = await this.$http.post('roles', this.addRoleFrom);
        if(res.meta.status !== 201) {
          this.addDialogVisible = false;
          return this.$message.error(res.meta.msg);
        }
        this.addDialogVisible = false;
        this.getRolesList();
        // this.$message.success(res.meta.msg);
      })
    },
    //编辑用户
    async editRole() {
      const id = this.editRoleFrom._id;
      const {data: res} = await this.$http.put('roles/' + id, this.editRoleFrom);
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.editDialogVisible = false;
      this.getRolesList();
    },
    //获取编辑角色数据
    async showEditDialog(id) {
      const {data: res} = await this.$http.get('roles/' + id);
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.editRoleFrom = res.data;
      this.editDialogVisible = true;
    },
    //删除角色
    async showDeleteDialog(id) {
      const result = await this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if(result === 'confirm') {
        const {data: res} = await this.$http.delete('/roles/' + id);
        if(res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getRolesList();
      }else {
        this.$message.info('取消删除');
      }
    },
    //展示分配权限对话框
    async showSetRightsDialog(role) {
      const {data: res} = await this.$http.get('rights/tree');
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.setRightsList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.roleId = role._id
      this.setRightsDialog = true;
    },
    //用递归函数获取分配权限下的第三级权限
    getLeafKeys(node, arr) {
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    //分配权限对话框关闭事件
    setRightsDialogClose() {
      this.defKeys = []
    },
    //点击分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',');
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rid: idStr});
      if(res.meta.status !== 201) {
        return this.$message.error('分配权限失败');
      }
      this.$message.success(res.meta.msg);
      this.getRolesList();
      this.setRightsDialog = false;
    }
  },
  created() {
    //获取角色列表
    this.getRolesList();
  }
}
</script>

<style>
  .el-tag {
    margin: 7px;
  }
  .dbTop {
    border-top: 1px solid #eee;
  }
  .dbBottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>