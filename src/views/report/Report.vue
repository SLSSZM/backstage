<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash';
export default {
  data () {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          { boundaryGap: false }
        ],
        yAxis: [
          { type: 'value' }
        ]
      }
    }
  },
  methods: {
    async Charts () {
      let myChart = echarts.init(document.getElementById('main'));

      const { data: res } = await this.$http.get('report');
      if (res.meta.status !== 201) {
        return this.$message.error('获取图表数据失败');
      }
      this.$message.success('获取图表数据成功');
      const areaStyle = { normal: {} };
      res.data.series.forEach(item => {
        item.areaStyle = areaStyle;
      })
      const result = _.merge(res.data, this.option);
      myChart.setOption(result);
    }
  },
  //当dom被渲染完毕时执行
  mounted () {
    this.Charts();
  }
}
</script>

<style scoped>
</style>