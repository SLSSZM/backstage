<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="添加商品" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center="">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域-->
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules" :label-position="'top'">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in this.manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="n" v-for="(n, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in this.onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://localhost:3000/api/upload" :on-preview="handlePreview" :on-remove="handleRemove"
              :on-success="handleSuccess" list-type="picture" :headers="heaferObj">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            </form>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="priviewVisible" width="50%">
      <img :src="priviewPath" class="priviewImg">
    </el-dialog>
  </div>
</template>

<script>
//导入富文本编辑器和对应的样式
import { quillEditor } from 'vue-quill-editor';
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
//导入lodash
import _ from 'lodash';

export default {
  data () {
    return {
      //步骤条激活页
      activeIndex: '0',
      //添加商品的表单数据
      addForm: {
        goods_name: '',
        goods_id: 0,
        goods_number: 0,
        goods_price: 0,
        goods_weight: 0,
        //商品所属的分类参数
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的描述
        goods_introduce: '',
        attrs: []
      },
      //添加商品的验证规则
      addFormRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_cat: [{ required: true, message: "请选择商品分类", trigger: "blur" }]
      },
      //商品分类列表
      cateList: [],
      //联机选择框参数
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //动态参数数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      //设置图片上传的请求头
      heaferObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //预览图片路径
      priviewPath: '',
      //图片预览对话框
      priviewVisible: false
    }
  },
  components: {
    quillEditor
  },
  methods: {
    //获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data.result;
    },
    //级联选择器选择项发生变化是触发
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //切换标签页判断
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        if (this.addForm.goods_name === '') {
          this.$message.error('请输入商品名称');
          return false;
        }
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品分类');
          return false;
        }
      }
    },
    //切换标签页
    async tabClicked () {
      // 动态参数页
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        });
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ');
        })
        this.manyTableData = res.data;
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        });
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.onlyTableData = res.data;
      }
    },
    //预览图片
    handlePreview (file) {
      this.priviewPath = file.response.data.url;
      this.priviewVisible = true;
    },
    //删除图片
    async handleRemove (file) {
      this.$http.delete('upload/' + file.response.data.filename);
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(i => i.pic === filePath);
      this.addForm.pics.splice(index, 1);
    },
    //文件上传成功调用
    handleSuccess (response) {
      const picsInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picsInfo);
    },
    //添加商品
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项');
        }
        //处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          };
          this.addForm.attrs.push(newInfo);
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          };
          this.addForm.attrs.push(newInfo);
        })
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',');
        const { data: res } = await this.$http.post('goods', form);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$router.push('/goods');
      })
    }
  },
  computed: {
    //获取参数id
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
    }
  },
  created () {
    this.getCateList();
  }
}
</script>

<style scoped>
  .el-checkbox {
    margin: 5px 10px !important;
  }
  .priviewImg {
    width: 100%;
  }
  .el-button {
    margin: 10px 0 !important;
  }
</style>