<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" :closable="false" show-icon type="warning"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="selectedCateKeys" :options="Catelist" :props="cataProps" clearable
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtuDisabeld" @click="addDialogVisible=true">添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handClose(i, scope.row)">
                  {{item}}</el-tag>
                <!-- 添加新标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="isBtuDisabeld" @click="addDialogVisible = true">添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handClose(i, scope.row)">
                  {{item}}</el-tag>
                <!-- 添加新标签 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogColse()">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogColse()">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name" @input="change($event)"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //商品分类数据
      Catelist: [],
      //级联选择器绑定到的数据id
      selectedCateKeys: [],
      //级联选择器的配置
      cataProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //标签页被激活的标签名称
      activeName: "many",
      // 动态参数
      manyData: [],
      //静态属性
      onlyData: [],
      //添加参数对话框的显示与隐藏
      addDialogVisible: false,
      //添加参数的表单数据
      addForm: {},
      //添加参数表单的验证规则
      addFormRules: {
        attr_name: [{ required: true, trigger: 'blur', message: '请输入参数名称' }]
      },
      //编辑参数对话框的显示与隐藏
      editDialogVisible: false,
      //编辑参数的表单数据
      editForm: {},
      //编辑参数表单的验证规则
      editFormRules: {
        attr_name: [{ required: true, trigger: 'blur', message: '请输入参数名称' }]
      }
    };
  },
  methods: {
    //获取商品分类参数
    async getCateList () {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.Catelist = res.data.result;
    },
    //监听级联选择器改变并获取参数
    handleChange () {
      this.getParamsData();
    },
    //监听标签页改变
    handleTabClick () {
      this.getParamsData();
    },
    //获取参数数据
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.manyData = [];
        this.onlyData = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        //控制按钮与文本框的切换显示
        item.inputVisible = false;
        //文本框输入的值
        item.inputValue = '';
      })
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      if (this.activeName === "many") {
        this.manyData = res.data;
      } else {
        this.onlyData = res.data;
      }
    },
    //监听添加参数对话框关闭事件
    addDialogColse () {
      this.$refs.addFormRef.resetFields();
    },
    //提交添加参数数据
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.getParamsData();
        this.$message.success(res.meta.msg);
        this.addDialogVisible = false;
      })
    },
    //监听编辑参数对话框关闭事件
    editDialogColse () {
      this.$refs.editFormRef.resetFields();
    },
    //显示编辑参数对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //提交编辑参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.getParamsData();
        this.editDialogVisible = false;
        this.$message.success(res.meta.msg);
      })
    },
    //解决编辑参数输入框无法输入
    change (e) {
      this.$forceUpdate(e);
    },
    //删除参数
    async deleteParams (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
      this.getParamsData();
    },
    //文本框失去焦点或按下enter时触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = '';
        return;
      }
      //如果没有return，则需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      this.saveAttrvals(row);
    },
    //将attr_vals的修改提交到数据库
    async saveAttrvals (row) {
      //将添加的参数数据进行提交
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      });
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    //点击按钮展示文本输入框
    showInput (row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //$nextTick：页面元素重新渲染完成之后调用
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应的参数项
    handClose (i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrvals(row);
    }
  },
  created () {
    this.getCateList();
  },
  computed: {
    //监听是否获取分类最后一项
    isBtuDisabeld () {
      return this.selectedCateKeys.length !== 3;
    },
    //获取分类最后一项id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //获取文本
    titleText () {
      if (this.activeName === "many") {
        return '动态参数';
      } else {
        return '静态属性';
      }
    },
  },
};
</script>

<style scope>
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 10px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>