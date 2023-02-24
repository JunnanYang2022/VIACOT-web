<template>
  <el-select
      :clearable="clearable"
      :filterable=true
      v-model="selectedValue"
      @change="change"
      :placeholder="placeholder"
      :no-data-text="noDataText"
      :filter-method="filterOptions"
  >
    <el-option
        v-for="(item,index) in selectList"
        :key="item.value + index"
        :label="item.desc"
        :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import {getBaseData} from '@/api/baseData/baseDataInit'

export default {
  name: 'BaseSelect',
  data() {
    return {
      allData: [],
      selectedValue: "",
      selectList: []
    }
  },
  props: {
    value: { //和父组件想关联
      type: String,
      default: null
    },
    dynamicValue: { //传入的选择的值
      type: String,
      default: null
    },
    url: {  //查询的url
      type: String,
      required: true
    },
    paramData: { //查询参数
      type: Object,
      default: null
    },
    defaultValue: { //默认选中第一项
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    noDataText: {
      type: String,
      default: '无数据'
    },
    modelFilter: {
      type: Boolean,
      default: false
    },
  },
  created() {
    this.updateSelect();
  },
  mounted() {
  },
  watch: {
    value: function () {
      if (this.value == '' || this.value == null) {
        if (this.defaultValue) {
          if (this.selectList.length > 0) {
            this.selectedValue = this.selectList[0].value
          }
        } else {
          this.selectedValue = this.value
        }
      } else {
        this.selectedValue = this.value
      }
    },
    paramData: function () {
      //重新查询
      this.updateSelect();
    }
    ,
    dynamicValue: function () {
      let obj = this.selectList.find(item => item.value === this.dynamicValue)
      if (obj != undefined) {
        this.selectedValue = obj.value
      }
    }
  },
  methods: {
    getVal() {
      return this.selectedValue;
    }
    ,
    change(data) {
      let obj = this.selectList.find(item => item.value === data)
      this.$emit("selectedValue", this.selectedValue);
      this.$emit("input", this.selectedValue);
      if (obj == undefined) {
        this.$emit("selectedObj", obj);
      } else {
        this.$emit("selectedObj", {value: obj.value, label: obj.desc});
      }
    },
    updateSelect2() {
      this.selectedValue = "";
      getBaseData(this.url, this.paramData).then(res => {
        this.selectList = res.data;
        if (this.defaultValue) {
          if (this.selectList.length > 0) {
            this.selectedValue = this.selectList[0].value
          }
        }
        if (this.dynamicValue != null) {
          let obj = this.selectList.find(item => item.value === this.dynamicValue)
          if (obj != undefined) {
            this.selectedValue = obj.value
          }
        }
        this.$emit("input", this.selectedValue);
      })
    },
    updateSelect() {
      this.selectedValue = "";
      getBaseData(this.url, this.paramData).then(res => {
        let data = res.data;
        this.allData = data ? data : [];
        this.selectList = this.allData.slice(0, 100)
        if (this.defaultValue) {
          if (this.selectList.length > 0) {
            this.selectedValue = this.selectList[0].value
          }
        }
        if (this.dynamicValue != null) {
          let obj = this.selectList.find(item => item.value === this.dynamicValue)
          if (obj != undefined) {
            this.selectedValue = obj.value
          }
        }
        this.$emit("input", this.selectedValue);
      })
    },
    filterOptions(query = '') {
      // query是输入框中的检索条件
      let arr = this.allData.filter(item => {
        return item.desc.includes(query)
      });
      // 根据检索条件筛选出来的选项，只取前100条
      if (arr.length > 100) {
        arr = arr.slice(0, 100)
      }
      // 清空之前的选项
      this.selectList.splice(0, this.selectList.length)
      if (arr.length > 30) {
        this.selectList.push(...arr)
      } else {
        this.selectList.push(...arr)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
