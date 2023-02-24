<template>
  <div class="carousel">
    <el-carousel :interval="2000" type="card" height="300px">
      <el-carousel-item
          class="home-carousel-item"
          v-for="(item,index) in imgPath"
          :key="index"
          :style="item"
      />
    </el-carousel>

    <div class="home-carousel-item-content">
      <div class="home-carousel-item-logo">
        <img src="../../assets/img/logo.png" style="width: 100px;height: 100px;"/>
      </div>

      <h2 class="home-carouse-title">{{ $t('Yan.carouseTitle') }}</h2>
      <p class="home-carouse-description"></p>
      <p class="home-carouse-link">{{ $t('Yan.h2') }}</p>
    </div>

    <div class="home-content">
      <p>
        {{ $t('Yan.h3') }}
      </p>
      <p>
        {{ $t('Yan.h4') }}
      </p>
      <p style="margin-top: 20px">Species:6 species </p>
      <p>The number of tree node:>10000 </p>
      <p>The number of lineage tree:{{ treeNum }} </p>
    </div>

  </div>

</template>

<script>
import {requestData} from "@/api/main/search";

export default {
  name: "Home",
  data() {
    return {
      imgPath: [
        /*{
          backgroundImage: 'url(' + require('../../assets/img/1.jpg') + ')',
        },
        {
          backgroundImage: 'url(' + require('../../assets/img/2.jpg') + ')',
        },
        {
          backgroundImage: 'url(' + require('../../assets/img/3.jpg') + ')',
        },
        {
          backgroundImage: 'url(' + require('../../assets/img/4.jpg') + ')',
        }*/
      ],
      treeNum: 0
    }
  },
  mounted() {
    this.requestDataAndRendering()
  },
  methods: {
    requestDataAndRendering() { // 获取数的数量
      requestData('/search', this.form).then(res => {
        this.treeNum = res.data.length
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
.carousel {
  margin: 0 auto;
  width: 100%;
  height: 700px;
}

.home-carousel-item {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  filter: blur(2px); /*虚化值，越大越模糊*/
}

.home-carousel-item-content {
  color: #fff;
  padding-top: 60px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  position: absolute; /*设置内容层绝对定位*/
  z-index: 6; /*将内容至于上层*/
  top: 60px;
  align: center;
}

.home-carouse-title {
  font-size: 40px;
  font-weight: 700;
  color: #000000;
  margin-top: 0;
}

.home-carouse-description {
  font-size: 22px;
  font-weight: 400;
  color: #000000;
}

.home-carouse-link {
  color: #000000;
  font-size: 16px;
}

.home-content {
  margin: 0 auto;
  width: 80%;
  padding: 20px;
}

.home-content p {
  text-indent: 25px;
}

</style>
