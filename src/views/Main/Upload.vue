<template>
  <div class="app-container">
    <el-card>

      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-upload
              ref="upload"
              class="uploadNewick"
              :action="uploadUrl"
              :multiple="false"
              :on-progress="handleProcess"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-remove="beforeRemove"
              :limit="1"
              :show-file-list="false"
              :on-exceed="handleExceed"
              :file-list="fileList">
            <el-button size="small" type="primary">{{ $t('Yan.upload') }}</el-button>
            <div slot="tip" class="el-upload__tip">{{ $t('Yan.uploadFileTip') }}</div>
            <!--        <i class="el-icon-upload"></i>-->
            <!--        <div class="el-upload__text">将newick格式txt文件拖到此处，或<em>点击上传</em></div>-->
          </el-upload>
        </el-col>
        <el-col :span="6">
          <el-button
              size="small"
              icon="el-icon-download"
              @click="saveImg"
          >{{ $t('Yan.downloadIng') }}
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div
          ref="lineageChart"
          id="lineageChart"
          :style="{'width': '100%','height': '600px' ,'margin':'0 auto'}"
      >
      </div>

    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "Upload",
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}api/lineage/chart/uploadNewick`,
      fileList: [],
    }
  },
  watch: {},
  mounted() {
    this.lineageChart = echarts.init(this.$refs['lineageChart'])
  },
  methods: {
    handleTabClick(tab, event) {
    },
    handleRemove(file, fileList) {
    },
    handleProcess(file) {
    },
    handleExceed(files, fileList) {
    },
    beforeRemove(file, fileList) {
    },
    saveImg() {
      const opt = {
        // 导出的格式，可选 png, jpeg
        type: 'png',
        // 导出的图片分辨率比例，默认为 1。
        pixelRatio: 2,
        // 导出的图片背景色，默认使用 option 里的 backgroundColor
        backgroundColor: '#ffffff'
      }

      const img = new Image();
      img.src = this.lineageChart.getDataURL(opt)
      this.downloadImg(img.src)
    },
    downloadImg(url, name) {
      const a = document.createElement('a');
      const event = new MouseEvent('click');

      a.download = name || 'tree'
      a.href = url

      a.dispatchEvent(event)
    },
    handleSuccess(response, file, fileList) {
      debugger
      if (response.code === 200) {
        this.lineageChart.hideLoading();
        this.$message({
          message: 'upload success!',
          type: 'success'
        });
        this.lineageChart.setOption(this.getChartOption(response.data, 'horizontal', 1), true)
        this.lineageChart.hideLoading();
      } else {
        this.error("upload failed!");
      }
      this.$refs.upload.clearFiles();
    },
    getChartOption(data, direction, vOrient) {
      let orient = 'horizontal';
      let layout = 'orthogonal';
      if (direction === 2) {
        orient = 'vertical';
      } else if (direction === 3) {
        layout = 'radial'
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

            symbolSize: 7,
            layout: layout,// orthogonal-正交布局  radial-径向布局
            orient: orient,//方向

            // edgeShape: 'polyline',
            // edgeForkPosition: '5%',
            // initialTreeDepth: -1,
            // roam: true,

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
    },
  }
}
</script>

<style scoped>

</style>
