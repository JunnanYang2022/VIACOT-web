<template>
  <div style="width: 100%;">
    <el-card v-show="childForm.activeTab === '1' ">
      <el-button icon="el-icon-download" @click="saveImg(1)"
                 style="float: right;position: relative;right: 20px;z-index: 999;">{{ $t('Yan.downloadIng') }}
      </el-button>
      <div ref="lineageChart2" id="lineageChart2" style="width: 100%;height: 600px;margin:0 auto"></div>
    </el-card>

    <el-card v-show="childForm.activeTab === '2' ">
      <el-button icon="el-icon-download" @click="saveImg(2)"
                 style="float: right;position: relative;right: 20px;z-index: 999;"
      >{{ $t('Yan.downloadIng') }}
      </el-button>
      <div style="width:100%;display: flex;justify-content: space-between;">
        <div ref="chart-gene-left2" id="chartByGeneLeft2" style="width: 50%;height: 600px;margin:0 auto"></div>
        <div ref="chart-gene-right2" id="chartByGeneRight2" style="width: 50%;height: 600px;margin:0 auto"></div>
      </div>
    </el-card>
  </div>
</template>

<script>

import {requestData} from "@/api/main/visualization"
import echarts from 'echarts'

export default {
  name: "Children",
  props: {
    childForm: {
      type: Object,
      required: true,
      default: {}
    }
  },
  data() {
    return {
      lineageChart2: {},
      chartByGeneLeft2: {},
      chartByGeneRight2: {}
    }
  },
  watch: {
    childForm(newVal, oldVal) {
      debugger
      this.requestDataAndRendering()
    }
  },
  mounted() {
    this.requestDataAndRendering()
  },
  methods: {
    requestDataAndRendering() { // 请求后台数据并渲染表格
      if (this.childForm.activeTab === '1') {
        this.lineageChart2 = echarts.init(this.$refs['lineageChart2'])
        this.lineageChart2.showLoading();
        debugger
        requestData('/treeData', this.childForm).then(res => {
          debugger
          this.lineageChart2.setOption(this.getChartOption(res.data, 1, 1), true)
          this.lineageChart2.hideLoading();
        }).catch(e => {
          console.log(e)
          this.lineageChart2.hideLoading();
        })
      } else if (this.childForm.activeTab === '2') {
        this.chartByGeneLeft2 = echarts.init(this.$refs['chart-gene-left2'])
        this.chartByGeneRight2 = echarts.init(this.$refs['chart-gene-right2'])
        this.chartByGeneLeft2.showLoading();
        this.chartByGeneRight2.showLoading();
        requestData('/geneCompareTreeData', this.childForm).then(res => {
          this.chartByGeneLeft2.setOption(this.getChartOption(res.data.treeData1, 1, 1), true)
          this.chartByGeneLeft2.hideLoading();
          this.chartByGeneRight2.setOption(this.getChartOption(res.data.treeData2, 1, 2), true)
          this.chartByGeneRight2.hideLoading();
        }).catch(e => {
          console.log(e)
          this.chartByGeneLeft2.hideLoading();
          this.chartByGeneRight2.hideLoading();
        })

      }
    },
    saveImg(type) {
      const opt = {
        // 导出的格式，可选 png, jpeg
        type: 'jpeg',
        // 导出的图片分辨率比例，默认为 1。
        pixelRatio: 2,
        // 导出的图片背景色，默认使用 option 里的 backgroundColor
        backgroundColor: '#ffffff'
      }
      if (type === 1) {
        const img = new Image();
        img.src = this.lineageChart2.getDataURL(opt)
        this.downloadImg(img.src)
      } else {
        const imgLeft = new Image();
        const imgRight = new Image();
        imgLeft.src = this.chartByGeneLeft2.getDataURL(opt)
        imgRight.src = this.chartByGeneRight2.getDataURL(opt)
        this.downloadImg(imgLeft.src, 'left')
        this.downloadImg(imgRight.src, 'right')
      }

    },
    downloadImg(url, name) {
      const a = document.createElement('a');
      const event = new MouseEvent('click');

      a.download = name || '树图'
      a.href = url

      a.dispatchEvent(event)
    },
    getChartOption(data, direction, vOrient) {
      let orient = 'horizontal';
      if (direction === 2) {
        orient = 'vertical';
      } else {
        if (vOrient === 1) {
          orient = 'LR'
        } else {
          orient = 'RL'
        }
      }

      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: data,

            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',

            symbolSize: 14,
            orient: orient,//方向

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 9
            },

            tooltip: {
              formatter: 'Node Name（Expression Or Blot）：{b}<br />{c}'
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
