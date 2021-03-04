<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--  -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 内容表格区 -->
      <el-table :data="cateList" border stripe :indent = "30"
      row-key="cat_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template v-slot="scope">
            <el-button v-if="scope.row.cat_deleted" type="success" disabled size="mini" icon="el-icon-check" circle></el-button>
            <el-button v-else type="danger" icon="el-icon-close" disabled size="mini" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialogVisible(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="showDeleteDialog(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisibleColse"
    >
      <!-- 内容区 -->
      <el-form
        :model="addCateForm"
        ref="addCateRef"
        label-width="80px"
        :rules="addRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cascaderProps"
          @change="parentCateChanged"
          clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogVisibleColse"
    >
      <!-- 内容区 -->
      <el-form
        :model="editCateForm"
        ref="editCateRef"
        label-width="80px"
        :rules="editRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类参数
      cateList: [],
      //查询条件
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
        type: 3
      },
      //总页数
      total: 0,
      //添加分类对话框的显示与隐藏
      addDialogVisible: false,
      //添加分类数据
      addCateForm: {
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认为一级
        cat_level: 0
      },
      //添加分类的父级分类数据
      parentCateList: [],
      //添加分类规则
      addRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      //设置级联选择器为配置对象
      cascaderProps: { 
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //所选择的父级分类id数组
      selectedKeys: [],
      //编辑分类对话框的显示与隐藏
      editDialogVisible: false,
      //编辑分类对话框的规则
      editRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },
      //编辑分类数据
      editCateForm: {}
    }
  },
  methods: {
    //获取商品分类列表参数
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo});
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
      this.$message.success(res.meta.msg);
    },
    //监听pagesize变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize.newSize;
      this.getCateList();
    },
    //监听pagenum变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum.newPage;
      this.getCateList();
    },
    //显示添加分类对话框
    async showAddDialog() {
      //获取添加分类所需要的数据
      const {data: res} = await this.$http.get('categories', {params: {type: 2}});
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.parentCateList = res.data.result;
      this.addDialogVisible = true;
    },
    //级联选择器发生改变
    parentCateChanged() {
      if(this.selectedKeys.length !== 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
        this.addCateForm.cat_level = this.selectedKeys.length;
      }else{
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    //提交添加分类
    addCate() {
      this.$refs.addCateRef.validate(async valid => {
        if(!valid) return;
        const {data: res} = await this.$http.post('categories', this.addCateForm);
        if(res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        // console.log(res)
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.addDialogVisible = false;
      });
    },
    //监听添加分类对话框关闭事件，重置表单
    addDialogVisibleColse() {
      this.$refs.addCateRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    //监听编辑分类对话框的关闭事件
    editDialogVisibleColse() {
      this.$refs.editCateRef.resetFields();
    },
    //显示编辑对话框
    showEditDialogVisible(data) {
      this.editCateForm = data;
      this.editDialogVisible = true;
    },
    //提交编辑分类数据
    editCate() {
      this.$refs.editCateRef.validate(async valid => {
        if(!valid) return;
        const {data: res} = await this.$http.put('categories', this.editCateForm);
        // console.log(res);
        if(res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.editDialogVisible = false;
      });
    },
    //删除分类
    async showDeleteDialog(data) {
      const result = await this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if(result === 'confirm') {
        const {data: res} = await this.$http.delete(`categories/${data.cat_id}/${data.cat_level}/${data.cat_pid}`);
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        //判断删除的是不是当前页最后一个数据
        if(this.cateList.length === 1) this.queryInfo.pagenum--;
        // 刷新用户列表
        this.getCateList();
      }else {
        this.$message.info('取消删除');
      }
    }
  },
  created() {
    this.getCateList();
  }
}
</script>

<style scoped>

</style>