<template>
  <div id="app">
    <el-container>
      <el-header>
        <div>
          <img class="logoImg" src="./assets/img/logo.png" alt/>
          <div v-if="this.lang === 'en-US'" class="logoText" style="font-size: 12px">
            {{$t('Yan.logoText')}}
          </div>

          <div v-if="this.lang !== 'en-US'" class="logoText">
            {{$t('Yan.logoText')}}
          </div>
        </div>

        <el-menu
            :default-active="defaultActive"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            :router="router"
        >
          <el-menu-item index="/">{{$t('Yan.home')}}</el-menu-item>
          <el-menu-item index="/search">{{$t('Yan.search')}}</el-menu-item>
          <el-menu-item index="/upload">{{$t('Yan.upload')}}</el-menu-item>
          <el-menu-item index="/download">{{$t('Yan.download')}}</el-menu-item>
          <el-menu-item @click="toContactUs()">{{$t('Yan.contactUs')}}</el-menu-item>
        </el-menu>
      </el-header>


      <el-main>
        <div style="width: 100px;display: inline-flex;position: absolute;right: 15px;top: 15px">
          <el-button type="text" icon="el-icon-connection"  @click="changeLangEvent">{{$t('Yan.changeLang')}}</el-button>
        </div>
        <router-view/>
      </el-main>
      <div style="position: fixed;bottom: 0px" class="footer" v-show="isShow">
       <!-- <div class="footer-content">
          <ul class="content-nav">
            <li>
              <p>简介</p>
              <span>发展历程</span>
              <span>实验室文化</span>
              <span>实验室荣誉</span>
              <span>合作伙伴</span>
            </li>
            <li>
              <p>实验室成员</p>
              <span>导师</span>
              <span>博士后</span>
              <span>博士生</span>
              <span>硕士生</span>
            </li>
            <li>
              <p>论文&项目</p>
              <span>论文列表</span>
              <span>项目列表</span>
            </li>
            <li>
              <p>联系我们</p>
              <span>邮箱：xxxxx@163.com</span>
              <span>电话：021-000000000</span>
              <span>地址：广州市</span>
            </li>
          </ul>
          <img src="./assets/img/ercode.png" alt/>
        </div>-->
        <div class="copyright">
          <span>
            {{$t('Yan.copyRight') }}
          </span>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      router: true,
      defaultActive: "/",
      isShow: true,
      lang: 'en-US'
    };
  },
  watch: {
    $route(to, from) {
      this.defaultActive = to.path
      this.isShow = this.defaultActive === '/';
    }
  },
  methods: {
    toContactUs() {
      window.open("https://www.labxing.com/yangjrlab")
    },
    handleSelect(key) {
      this.isShow = this.defaultActive === key;
      window.console.log(this.isShow);
    },
    /**
     * 切换语言
     */
    changeLangEvent() {
      this.lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN';
      this.$i18n.locale = this.lang;//关键语句
/*      this.$confirm('确定切换语言吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.lang === 'zh-CN') {
          this.lang = 'en-US';
          this.$i18n.locale = this.lang;//关键语句
        } else {
          this.lang = 'zh-CN';
          this.$i18n.locale = this.lang;//关键语句
        }
      }).catch(() => {
        this.$message({
          type: 'info',
        });
      });*/
    }
  }
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

html,
body {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 1240px;
  margin: 0 auto;
  //background-color: #fff;

  .logoText {
    line-height: 60px;
    font-size: 20px;
    margin-left: 15px;
    display: inline;
    font-weight: bold;
    position: absolute;
  }

  .logoImg {
    line-height: 60px;
    margin-top: 5px;
    width: 50px;
    height: 50px;
  }
}

.el-main {
  padding: 0 !important;
}

.footer {
  width: 100%;
  overflow: hidden;
  background-color: #14679f;

  &-content {
    width: 1240px;
    margin: 0 auto;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;

    .content-nav {
      display: flex;
      justify-content: space-around;

      li {
        display: flex;
        flex-direction: column;
        padding: 0 20px;
        //justify-content: center;
        align-items: flex-start;

        p {
          font-size: 20px;
          color: #d4edff;
          padding: 10px 0;
        }

        span {
          color: #f7f7f7;
          font-weight: 300;
          padding: 5px 0;
        }
      }
    }

    img {
      width: 170px;
      height: 170px;
      padding: 10px;
    }
  }

  .copyright {
    height: 50px;
    background: #125688;
    text-align: center;

    span {
      color: #fff;
      line-height: 50px;
    }
  }
}
</style>
