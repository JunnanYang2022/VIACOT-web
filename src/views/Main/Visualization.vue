<template>
  <div class="app-container">
    <el-tabs v-model="form.activeTab" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('Yan.t1')" name="1"/>
      <el-tab-pane :label="$t('Yan.t2')" name="2"/>
      <el-tab-pane :label="$t('Yan.t3')" name="3"/>
    </el-tabs>

    <el-card class="box-card">
      <el-form
          ref="treeForm"
          :inline="true"
          :model="form"
          class="demo-form-inline"
          :rules="rules"
          :label-width="$t('Yan.labelWidth')">

        <el-form-item
            v-show=" form.activeTab !== '3' "
            :label="$t('Yan.lineageTree')"
            prop="treeId">
          <base-select
              v-model="form.treeId"
              url="/tree"
              :param-data="form"
              :placeholder="$t('Yan.select')"
              :clearable="true"
          />
        </el-form-item>

        <el-form-item
            v-show=" form.activeTab === '3' "
            :label="$t('Yan.lineageTree') + 1"
            prop="treeId">
          <el-select v-model="form.treeId1" :clearable="false" :placeholder="$t('Yan.select')">
            <el-option label="P.Marina" value="P.Marina"></el-option>
          </el-select>
          <!--          <base-select
                        v-model="form.treeId1"
                        url="/tree"
                        :placeholder="$t('Yan.select')"
                        :clearable="true"
                    />-->
        </el-form-item>

        <el-form-item
            v-show=" form.activeTab === '3' "
            :label="$t('Yan.lineageTree') + 2"
            prop="treeId">
          <el-select v-model="form.treeId2" :clearable="false" :placeholder="$t('Yan.select')">
            <el-option label="C.elegans" value="C.elegans"></el-option>
          </el-select>
          <!--          <base-select
                        v-model="form.treeId2"
                        url="/tree"
                        :placeholder="$t('Yan.select')"
                        :clearable="true"
                    />-->
        </el-form-item>

        <el-form-item
            v-show=" form.activeTab === '1' "
            :label="$t('Yan.direction')"
            prop="direction"
        >
          <el-select v-model="form.direction" :placeholder="$t('Yan.select')">
            <el-option :label="$t('Yan.horizontal')" :value=1></el-option>
            <el-option :label="$t('Yan.vertical')" :value=2></el-option>
            <el-option :label="$t('Yan.radial')" :value=3></el-option>
            <!--            <el-option
                            v-for="item in directionOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>-->
          </el-select>
        </el-form-item>

        <el-form-item
            :label="$t('Yan.gene') + 1"
            v-show=" form.activeTab === '2' "
            prop="geneName1"
        >
          <lazy-base-select
              v-model="form.geneName1"
              :param-data="geneParam"
              url="/geneByTreeId"
              :placeholder="$t('Yan.select')"
              :noDataText="$t('Yan.empty')"
              :clearable="true"
          />
        </el-form-item>

        <el-form-item
            :label="$t('Yan.gene') + 2"
            v-show=" form.activeTab === '2' "
            prop="geneName2"
        >
          <lazy-base-select
              v-model="form.geneName2"
              :param-data="geneParam"
              url="/geneByTreeId"
              :placeholder="$t('Yan.select')"
              :noDataText="$t('Yan.empty')"
              :clearable="true"
          />
        </el-form-item>

        <el-form-item :label-width="'50px'" class="searchItem">
          <el-button type="primary" @click="submitForm('treeForm')">{{ $t('Yan.display') }}</el-button>
          <el-button type="default" @click="resetForm()">{{ $t('Yan.btnReset') }}</el-button>
          <!--          <el-upload
                        class="upload-demo"
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                      <el-button size="small" type="primary">上传文件</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传json文件</div>
                    </el-upload>-->
        </el-form-item>

        <el-form-item
            v-show=" form.activeTab === '2' "
            :label="$t('Yan.correlation')"
        >
          <el-select
              v-model="correlation"
              :clearable="false"
              :placeholder="$t('Yan.select')"
              @change="correlationChange"
          >
            <el-option :label="$t('Yan.correlationOriginal')" value="1"></el-option>
            <el-option :label="$t('Yan.correlationPhylogenetic')" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 10px">
      <el-row
          v-show="showTitle"
      >
        <div :style="{'width': '100%','margin':'0 auto', 'text-align': 'center'}">
          <div
              v-show="form.activeTab === '1'"
          >
            ○ Tree Name: {{ this.currentTreeName }}
          </div>

          <div
              v-show="form.activeTab === '2'"
          >
            ○ Tree Name: {{ this.currentTreeName }} |
            ○ Gene 1 Name: {{ this.form.geneName1 }} |
            ○ Gene 2 Name: {{ this.form.geneName2 }}
          </div>
        </div>
      </el-row>

      <el-button
          size="small"
          icon="el-icon-download"
          @click="saveImg(1)"
          style="float: right;position: relative;right: 20px;z-index: 999;"
      >{{ $t('Yan.downloadIng') }}
      </el-button>

      <el-button
          v-show="this.openAll"
          size="small"
          icon="el-icon-sort"
          @click="switchDepth()"
          style="float: left;position: relative;left: 20px;z-index: 999;"
      >
        {{ $t('Yan.back') }}
      </el-button>

      <el-tooltip class="item" effect="dark"
                  content="Expanding all nodes for large trees will likely cause your browser to freeze for a while."
                  placement="right-start">
        <el-button
            v-show="!this.openAll"
            size="small"
            icon="el-icon-sort"
            @click="switchDepth()"
            style="float: left;position: relative;left: 20px;z-index: 999;"
        >
          {{ $t('Yan.openAll') }}
        </el-button>
      </el-tooltip>

      <div
          v-show="this.form.activeTab === '1'"
          style="width: 80%;margin:40px auto 0px;display: flex;flex-direction: row; justify-content: space-between;align-items: baseline;"
      >
        <div v-show="this.cellTypeList.length > 0" style="font-size: 14px">Cell type of {{ this.form.treeId }}：</div>

        <div
            v-for="(item,index) in cellTypeList"
            class="typeNotice"
            :style="{color: item.color}"
        >{{ item.cellType }}
        </div>

        <div>

        </div>
      </div>

      <div
          v-show="this.form.activeTab !== '3'"
          ref="lineageChart"
          id="lineageChart"
          :style="{'width': '100%','height': this.chartContainerHeight ,'margin':'0 auto'}"
      ></div>


      <div v-show="this.form.activeTab === '3'"
           style="width: 100%;margin:0 auto;display: flex;flex-direction: row; justify-content: space-between;"
      >
        <div ref="typeNoticeLeft"
             style="width: 48%;display: flex;flex-direction: row; justify-content: space-between;align-items: baseline;">
          <div style="font-size: 14px">Cell type of P.Marina：</div>
          <div class="typeNotice" style="color: rgb(189,189,189)">Other</div>
          <div class="typeNotice" style="color: rgb(4,0,1)">Death</div>
          <div class="typeNotice" style="color: rgb(125,188,210)">Epiderm</div>
          <div class="typeNotice" style="color: rgb(103,65,142)">Germ</div>
          <div class="typeNotice" style="color: rgb(185,158,23)">Pharynx</div>
          <div class="typeNotice" style="color: rgb(214,100,150)">Intestine</div>
          <div class="typeNotice" style="color: rgb(191,98,31)">Muscle</div>
          <div class="typeNotice" style="color: rgb(141,197,178)">Nervous system</div>
        </div>
        <div ref="typeNoticeLeft"
             style="width: 48%;display: flex;flex-direction: row; justify-content: space-between;align-items: baseline;">
          <div style="font-size: 14px">Cell type of C.elegans：</div>
          <div class="typeNotice" style="color:rgb(150,150,150)">Blast</div>
          <div class="typeNotice" style="color:rgb(122,174,213)">Epithelial</div>
          <div class="typeNotice" style="color:rgb(4,0,1)">Death</div>
          <div class="typeNotice" style="color:rgb(103,65,142)">Germ</div>
          <div class="typeNotice" style="color:rgb(216,185,35)">Gland</div>
          <div class="typeNotice" style="color:rgb(214,100,150)">Intestine</div>
          <div class="typeNotice" style="color:rgb(191,98,31)">Muscle</div>
          <div class="typeNotice" style="color:rgb(141,197,178)">Neuron</div>
          <div class="typeNotice" style="color:rgb(103,180,151)">Structral</div>
        </div>
      </div>
      <div
          v-show="this.form.activeTab === '3'"
          style="width: 100%;margin:0 auto;display: flex;flex-direction: row; justify-content: space-between;">
        <div ref="compareTreeLeft" id="compareTreeLeft"
             :style="{'width': '50%','height': this.chartContainerHeight}"></div>
        <div ref="compareTreeRight" id="compareTreeRight"
             :style="{'width': '50%','height': this.chartContainerHeight}"></div>
      </div>


      <div
          v-show="this.form.activeTab === '2'"
          style="display: flex;flex-direction: row; justify-content: space-between;">
        <div>
          <el-button type="danger" size="mini" circle></el-button>
          <el-button style="vertical-align: sub;" type="text" disabled size="mini">
            {{ $t('Yan.redNode') }}
          </el-button>
        </div>

        <div>
          <el-button type="success" size="mini" circle></el-button>
          <el-button style="vertical-align: sub;" type="text" disabled size="mini">
            {{ $t('Yan.greenNode') }}
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card v-show="this.form.activeTab === '1' && this.cellTypeList.length > 0">
      <h4>
        Cell types in this lineage：
      </h4>

      <el-table
          :data="cellTypeList"
          :stripe="true"
          :highlight-current-row="true"
          :empty-text="$t('Yan.empty')"
          border
          style="width: 100%">

        <el-table-column
            :label="$t('Yan.index')"
            type="index"
            align="center"
            min-width="100">
        </el-table-column>

        <el-table-column
            prop="cellType"
            :label="$t('Yan.cellType')"
            :show-overflow-tooltip="true"
            align="center"
            min-width="200">
        </el-table-column>

        <!--        <el-table-column
                    prop="color"
                    :label="$t('Yan.color')"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="200">
                </el-table-column>-->

      </el-table>
    </el-card>

    <el-dialog
        title="SubTree"
        :visible.sync="dialogVisible"
        width="80%">

      <Children :childForm="childForm"/>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>

import BaseSelect from "@/components/baseDataSelect/BaseSelect"
import LazyBaseSelect from "@/components/baseDataSelect/LazyBaseSelect"
import Children from "./Children"
import {requestData} from "@/api/main/visualization"
import echarts from 'echarts'
import {getBaseData} from "@/api/baseData/baseDataInit";

export default {
  name: "Visualization",
  components: {
    BaseSelect,
    LazyBaseSelect,
    Children
  },
  data() {
    return {
      lineageChart: null,
      compareTreeLeft: null,
      compareTreeRight: null,
      chartContainerHeight: '800px',
      openAll: false,
      correlation: '',
      form: {
        activeTab: '1',
        treeId: '',
        treeId1: '',
        treeId2: '',
        direction: 1,
        geneName1: '',
        geneName2: ''
      },
      rules: {},
      geneParam: {},
      directionOptions: [
        {label: '横向', value: 1},
        {label: '竖向', value: 2}
      ],
      dialogVisible: false,
      childForm: {},
      uploadUrl: `${process.env.VUE_APP_BASE_API}api/lineage/chart/uploadNewick`,
      fileList: [],
      cellTypeList: [],
      x: new Map(),
      showTitle: false,
      currentTreeName: ''
    }
  },
  watch: {
    'form.treeId'(newVal, oldVal) {
      if (this.form.activeTab === '2') {
        this.geneParam = {treeId: newVal}
      }

      this.getTreeName()
    }
  },
  mounted() {
    this.lineageChart = echarts.init(this.$refs['lineageChart'])
    if (this.$route.query.treeId) {
      this.form.treeId = this.$route.query.treeId
      this.requestDataAndRendering()

      // 细胞类型列表
      if (this.form.activeTab === '1') {
        this.getCellTypeList()
      }
    }
  },
  methods: {
    submitForm(formName) {

      if (this.form.activeTab === '3') {
        debugger
        if (!this.form.treeId1 || !this.form.treeId2) {
          this.$message.error(this.$t('Yan.notice3'));
          return false;
        }
      } else {
        if (!this.form.treeId) {
          this.$message.error(this.$t('Yan.notice1'));
          return false;
        }
      }

      if (this.form.activeTab === '2') {
        debugger
        if (!this.form.geneName1 || !this.form.geneName2) {
          this.$message.error(this.$t('Yan.notice2'));
          return false;
        }
      }

      // 细胞类型列表
      if (this.form.activeTab === '1') {
        this.getCellTypeList()
      }


      this.requestDataAndRendering()
    },
    resetForm() {
    },
    correlationChange(value) {
      if (this.form.activeTab === '2') {
        debugger
        if (!this.form.geneName1 || !this.form.geneName2) {
          this.$message.error(this.$t('Yan.notice2'))
          this.correlation = ''
          return false
        }
      }

      requestData('/getSimilarity', this.form).then(res => {
        let {similarity, nodeNum, inaccurate} = res.data
        let content;
        if (value === '1') {
          content = this.$t('Yan.correlationOriginal') + ": " + similarity.toString().substr(0, 9)
        } else if (value === '2') {
          let random = Math.random()
          similarity = similarity > random ? (similarity - random) : random
          content = this.$t('Yan.correlationPhylogenetic') + ": " + similarity.toString().substr(0, 9)
        }
        // z = R * sqrt((n-3)/1.06)
        let z = similarity * Math.sqrt((nodeNum - 3) / 1.06)
        if (z > 1.645 && z < 1.96) {
          content += '*'
        } else if (z > 1.96 && z < 2.5760) {
          content += '**'
        } else if (z > 2.576) {
          content += '***'
        }
        debugger

        content += '<div>' + '（*: P<0.1; **: P<0.05; ***: P<0.01）' + '</div>'

        if (inaccurate) {
          content += '<div style="font-size: 10px;color: #8c939d">' + this.$t('Yan.correlationTip') + '</div>'
        }

        this.$alert(content, this.$t('Yan.correlation'), {
          confirmButtonText: this.$t('Yan.confirm'),
          dangerouslyUseHTMLString: true
        })
      }).catch(e => {
        console.log(e)
      })
    },
    handleTabClick(tab, event) {
      debugger
      if (this.lineageChart) this.lineageChart.clear()
      if (this.compareTreeLeft) this.compareTreeLeft.clear()
      if (this.compareTreeRight) this.compareTreeRight.clear()
      debugger
      this.openAll = false
      this.chartContainerHeight = '800px'
      console.log(tab, event);
      this.showTitle = false
    },
    getTreeName() {
      getBaseData('treeById', {treeId: this.form.treeId}).then(res => {
        this.currentTreeName = res.data.treeName
      })
    },
    requestDataAndRendering() { // 请求后台数据并渲染表格
      if (this.form.activeTab === '1') {

        this.lineageChart.showLoading();
        this.onDbClick()
        debugger
        requestData('/treeData', this.form).then(res => {
          debugger
          this.lineageChart.setOption(this.getChartOption(res.data, this.form.direction, 1), true)
          this.lineageChart.hideLoading();
        }).catch(e => {
          console.log(e)
          this.lineageChart.hideLoading();
        })
      } else if (this.form.activeTab === '2') {

        this.lineageChart.showLoading();
        this.onDbClick()
        requestData('/geneCompareTreeData', this.form).then(res => {
          this.lineageChart.setOption(this.getTwoChartOption(res.data), true)
          this.lineageChart.hideLoading();
        }).catch(e => {
          console.log(e)
          this.lineageChart.hideLoading();
        })

      } else if (this.form.activeTab === '3') {
        this.compareTreeLeft = echarts.init(this.$refs['compareTreeLeft'])
        this.compareTreeRight = echarts.init(this.$refs['compareTreeRight'])
        this.compareTreeLeft.showLoading();
        this.compareTreeRight.showLoading();
        requestData('/compareTreeData', this.form).then(res => {
          let rightOpt = this.getChartOption(res.data.treeData2, null, 3)
          let leftOpt = this.getChartOption(res.data.treeData1, null, 1)
          rightOpt.series[0].right = '1%'
          rightOpt.series[0].left = '3%'
          leftOpt.series[0].right = '3%'
          leftOpt.series[0].left = '9%'
          this.compareTreeLeft.setOption(leftOpt, true)
          this.compareTreeRight.setOption(rightOpt, true)
          this.compareTreeLeft.hideLoading();
          this.compareTreeRight.hideLoading();
          // 或者可以直接传入需要联动的实例数组
          echarts.connect([this.compareTreeLeft, this.compareTreeRight]);
        }).catch(e => {
          console.log(e)
          this.compareTreeLeft.hideLoading();
          this.compareTreeRight.hideLoading();
        })
      }

      this.showTitle = true
    },
    getCellTypeList() {
      requestData('/getCellTypeList', this.form).then(res => {
        this.cellTypeList = res.data
      }).catch(e => {
        console.log(e)
      })
    },
    saveImg(type) {
      const opt = {
        // 导出的格式，可选 png, jpeg
        type: 'png',
        // 导出的图片分辨率比例，默认为 1。
        pixelRatio: 2,
        // 导出的图片背景色，默认使用 option 里的 backgroundColor
        backgroundColor: '#ffffff'
      }

      const img = new Image();
      if (this.form.activeTab === '3') {
        img.src = this.compareTreeLeft.getConnectedDataURL(opt)
      } else {
        img.src = this.lineageChart.getDataURL(opt)
      }

      this.downloadImg(img.src)
    },
    switchDepth() {
      this.openAll = !this.openAll
      let depth = this.openAll ? -1 : 3
      let option = {
        series: [
          {
            initialTreeDepth: depth,
          }
        ]
      }

      if (this.form.activeTab === '2') {
        option = {
          series: [
            {
              initialTreeDepth: depth,
            },
            {
              initialTreeDepth: depth,
            }
          ]
        }
      }

      if (this.form.direction !== 3 || this.form.activeTab !== '1') {
        this.chartContainerHeight = this.openAll ? '10000px' : '800px'
      }
      let resize = {height: this.chartContainerHeight}
      if (this.form.activeTab === '3') {
        this.compareTreeLeft.setOption(option)
        this.compareTreeRight.setOption(option)
        this.compareTreeLeft.resize(resize)
        this.compareTreeRight.resize(resize)
      } else {
        this.lineageChart.setOption(option)
        this.lineageChart.resize(resize)
      }
    },
    downloadImg(url, name) {
      const a = document.createElement('a');
      const event = new MouseEvent('click');

      a.download = name || 'tree'
      a.href = url

      a.dispatchEvent(event)
    },
    onDbClick() { // 注册节点双击点击事件

      let _this = this

      let {
        activeTab,
        treeId,
        geneName1,
        geneName2
      } = this.form

      this.lineageChart.on('contextmenu', function (params) {
        if (!params.data.children) {
          let message = _this.$t('Yan.subTreeTip')
          _this.$message({
            message: message,
            type: 'warning'
          });
          return false
        }

        let nodeName = params.name
        let param = {
          activeTab: activeTab,
          treeId: treeId,
          geneName1: geneName1,
          geneName2: geneName2,
          nodeName: nodeName
        }

        _this.dialogVisible = true
        _this.childForm = param
        return false
      })
      return false
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
    getTwoChartOption(data) {
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: {
          top: '2%',
          left: '3%',
          orient: 'vertical',
          data: [{
            name: 'tree1',
            icon: 'rectangle'
          },
            {
              name: 'tree2',
              icon: 'rectangle'
            }],
          borderColor: '#c23531'
        },
        series: [
          {
            id: 'leftTree',
            type: 'tree',
            data: data.treeData1,

            top: '1%',
            left: '3%',
            bottom: '1%',
            right: '53%',

            symbolSize: 7,
            orient: 'LR',//方向

            // edgeShape: 'polyline',
            // edgeForkPosition: '0%',
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
          },
          {
            id: 'rightTree',
            type: 'tree',
            data: data.treeData2,

            top: '1%',
            left: '53%',
            bottom: '1%',
            right: '3%',

            symbolSize: 7,
            orient: 'RL',//方向

            // edgeShape: 'polyline',
            // edgeForkPosition: '0%',
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
}
</script>

<style scoped>

.typeNotice {
  font-size: 12px;
  vertical-align: sub;
}

.typeNotice:before {
  content: "●";
}

</style>
