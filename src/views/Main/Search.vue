<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          label-width="200px">

        <el-form-item :label="$t('Yan.species')">
          <el-input
              v-model="form.species"
              :placeholder="$t('Yan.speciesPla')"
          />
        </el-form-item>

        <el-form-item :label="$t('Yan.cellNum')">
          <el-select v-model="form.cellNum" :placeholder="$t('Yan.select')">
            <el-option
                v-for="item in cellNumOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item :label-width="'50px'" class="searchItem">
          <el-button type="primary" @click="submitForm()">{{ $t('Yan.btnSearch') }}</el-button>
          <el-button type="default" @click="resetForm()">{{ $t('Yan.btnReset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 10px">
      <el-table
          :data="tableData"
          :stripe="true"
          :highlight-current-row="true"
          :empty-text="$t('Yan.empty')"
          border
          style="width: 100%">

        <el-table-column
            :label="$t('Yan.index')"
            type="index"
            align="center"
            min-width="50">
        </el-table-column>

        <!--        <el-table-column
                    prop="treeId"
                    :label="$t('Yan.treeId')"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="200">
                </el-table-column>-->

        <el-table-column
            prop="treeName"
            :label="$t('Yan.treeName')"
            :show-overflow-tooltip="true"
            align="center"
            min-width="200">
        </el-table-column>

        <el-table-column
            prop="latinName"
            :label="$t('Yan.latinName')"
            :show-overflow-tooltip="true"
            align="center"
            min-width="80">
        </el-table-column>

        <el-table-column
            prop="eoa"
            :label="$t('Yan.eoa')"
            :show-overflow-tooltip="true"
            align="center"
            min-width="150">
        </el-table-column>

        <el-table-column
            prop="cellNum"
            :label="$t('Yan.cellNum')"
            :show-overflow-tooltip="true"
            align="center"
            min-width="50">
        </el-table-column>

        <el-table-column
            prop="paper"
            :label="$t('Yan.paper')"
            :show-overflow-tooltip="true"
            align="center"
            min-width="200">
        </el-table-column>

        <el-table-column
            :label="$t('Yan.operation')"
            fixed="right"
            align="center"
            min-width="200">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="text" size="small">{{ $t('Yan.visualDisplay') }}</el-button>
            <el-button @click="downloadNewick(scope.row)" type="text" size="small">{{ $t('Yan.downloadNewick') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {requestData} from "@/api/main/search"

export default {
  name: "Search",
  data() {
    return {
      form: {
        species: '',
        cellNum: '',
      },
      cellNumOptions: [
        {label: '<500', value: 1},
        {label: '≥500 and≤1000', value: 2},
        {label: '>1000', value: 3}
      ],
      tableData: [],

    }
  },
  mounted() {
    this.requestDataAndRendering()
  },
  methods: {
    submitForm() {
      this.requestDataAndRendering()
    },
    resetForm() {
      this.form.species = ''
      this.form.cellNum = ''
    },
    toDetail(data) {
      this.$router.push({
        path: '/visualization',
        query: {
          treeId: data.treeId
        }
      })
    },
    downloadNewick(data) {
      window.open(`${process.env.VUE_APP_BASE_API}api/lineage/chart/downloadNewick?treeId=${data.treeId}`)
    },
    requestDataAndRendering() { // 请求后台数据并渲染表格
      this.loading = true
      requestData('/search', this.form).then(res => {
        this.tableData = res.data
        this.loading = false
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.el-table {
  margin: 0 auto;
}
</style>
