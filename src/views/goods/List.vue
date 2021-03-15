<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()" </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="95px"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="85px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="85px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)">
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 50]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" background="">
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="addFormFules">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoods()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //获取商品列表查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //商品列表
      goodsList: [],
      //商品总数
      pageTotal: 0,
      //编辑商品对话框的显示与隐藏
      editDialogVisible: false,
      //编辑商品数据
      editForm: {},
      //编辑商品对话框的表单规则
      addFormFules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" },],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" },],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" },],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" },],
      }
    }
  },
  methods: {
    //获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      });
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.pageTotal = res.data.total;
      this.goodsList = res.data.result;
    },
    //当pagesize发生改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //当前页数发生改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //删除商品
    async removeGoods (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除');
      }
      const { data: res } = await this.$http.delete('goods/' + id);
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.getGoodsList();
      this.$message.success(res.meta.msg);
    },
    //跳转到添加商品页面
    goAddpage () {
      this.$router.push('/goods/add');
    },
    //显示编辑商品对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('goods/' + id);
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //编辑商品
    editGoods () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, this.editForm);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.getGoodsList();
        this.editDialogVisible = false;
      })
    }
  },
  created () {
    this.getGoodsList();
  }
}
</script>

<style scoped>
</style>