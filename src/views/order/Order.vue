<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表视图区 -->
      <el-table border :data="orderList" stripe>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80px"></el-table-column>
        <el-table-column prop=" pay_status" label="是否付款" width="80px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="170px">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showBox(scope.row.order_id)">修改地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页视图区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 50]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressVisibleClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddress()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './cityData';
export default {
  data () {
    return {
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单列表
      orderList: [],
      // 总订单数
      total: 0,
      //修改地址对话框的显示与隐藏
      addressVisible: false,
      //修改地址表单数据
      addressForm: {
        address1: [],
        address2: ''
      },
      //修改地址表单验证规则
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
      },
      //城市数据
      cityData,
      //编辑订单id
      order_id: 0
    }
  },
  methods: {
    //获取订单列表数据
    async getOrderList () {
      const { data: res } = await this.$http.get('order', {
        params: this.queryInfo
      });
      if (res.meta.status !== 201) {
        return this.$message.error(res.mete.msg);
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    //切换显示数量
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //切换页数
    handleCurrentChange (newPage) {
      this.queryInfo.paegnum = newPage;
      this.getGoodsList();
    },
    //展示修改地址对话框
    showBox (id) {
      this.order_id = id;
      this.addressVisible = true;
    },
    //编辑地址对话框表单重置
    addressVisibleClose () {
      this.$refs.addressFormRef.resetFields();
    },
    //提交修改地址
    editAddress () {
      this.$refs.addressFormRef.validate(async valid => {
        if (!valid) return;
        const e = { consignee_addr: this.addressForm.address1.join('') + this.addressForm.address2 };
        const { data: res } = await this.$http.put('order/' + this.order_id, e);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error('修改地址失败');
        }
        this.$message.success('修改地址成功');
        this.addressVisible = false;
      })
    }
  },
  created () {
    this.getOrderList();
  }
}
</script>

<style scoped>
</style>