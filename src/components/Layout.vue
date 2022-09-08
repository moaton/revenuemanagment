<template>
  <div class="container">
    <div class="home">
      <Home v-if="home" />
      <Dashboard v-if="dashboard" />
      <div @click="sidebar = !sidebar" style="font-size: 42px; position: absolute; top: 14%; left: 4%;cursor: pointer;">
        <i class="bi bi-list"></i>
      </div>
      <div class="sidebar" :class="{'sidebar-close': sidebar}" v-click-outside="sidebarClose">
        <div class="title p-3 text-center">RevenueManagment</div>
        <div class="pt-3">
          <div class="p-3 sidebar-nav" :class="{'active': home}" @click="home = true, dashboard = false, sidebar = false">Главная</div>
          <div class="p-3 sidebar-nav" :class="{'active': dashboard}" @click="home = false, dashboard = true, sidebar = false">Дашборды</div>
        </div>
        <div class="p-2 text-center" style="position: absolute; bottom: 0; left: 0; width: 100%;font-size: 12px">
          <p class="text-secondary">
            Developed by Anet Zhuban, 2022 <br> @moaton
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Home from './Home'
  import Dashboard from './Dashboards'
  const URL = 'http://195.49.212.34:8080/api/'
  // const URL = 'http://localhost:8080/api/'
  export default {
    components: {
      Home,
      Dashboard
    },
    data() {
      return {
        sidebar: false,
        isOpen: false,
        dashboard: false,
        home: true,
      }
    },
    computed: {
    },
    async mounted() {
    },
    methods: {
      sidebarClose(){
        // if(this.isOpen){
        //   this.sidebar = false
        //   this.isOpen = false
        // }
        // if(this.sidebar){
        //   this.isOpen = true
        // }
        this.isOpen = !this.isOpen
      },
    },
  }
</script>

<style lang="scss">
  .home {
    position: relative;
    min-height: 550px;
    margin-top: 40px;
    margin-bottom: 60px;
    border: 1px solid #000;
    border-radius: 12px;
    padding: 20px 40px 40px;
    background: #fff;
    overflow: hidden;

    .add__btn {
      position: absolute;
      bottom: 20px;
      right: 30px;
      font-size: 42px;
      color: rgb(0, 0, 0, .6);
    }
    .sidebar{
      position: absolute;
      top: 0;
      left: -1000px;
      height: 100%;
      width: 60%;
      background: #fff;
      border-right: 1px solid #000;
      transition: all .5s ease;
      .title{
        font-weight: 700;
      }
      .sidebar-nav{
        user-select: none;
        font-weight: 600;
        cursor: pointer;
        transition: all .5s ease;
      }
      .active{
        background: #eee;
      }
      .sidebar-nav:hover{
        background: rgb(219, 218, 218);
      }
    }
    .sidebar-close{
      left: 0
    }
    .revenue {
      font-size: 24px;
    }

    // .revenue::after {
    //   content: "тенге";
    //   margin-left: 5px;
    // }

    .revenue__content {
      height: 300px;
      overflow: hidden;
      position: relative;

      .wrapper {
        height: 100%;
        overflow-y: scroll;
        .revenue__card {
          padding: 10px;
          border-radius: 6px;
          background: #DFDFDF;
          border: 1px solid #000;

          i {
            font-size: 18px;
          }

          &--title {
            font-weight: 300;
          }

          &--cost {
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 16px;
          }

          // &--cost::before {
          //   content: "-";
          //   margin-right: 5px;
          // }

          &--date {
            font-size: 10px;
            // color: rgb(0, 0, 0, .5);
          }
        }
      }

    }
    .revenue__content::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #000;
      height: 6px;
      filter: blur(5px);
    }
  }
  .date__title{
    overflow: hidden;
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .date__title:before,
  .date__title:after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: 1px;
    background-color: #212529;
    position: relative;
  }
  .date__title:before {
    margin-left: -100%;
    left: -14px;
  }
  .date__title:after {
    margin-right: -100%;
    right: -14px;
  }
  @media (max-width: 320px){
    body{
      font-size: 11px !important;
    }
  }
  @media (min-width: 768px){
    .revenue{
      font-size: 36px !important;
    }
  }
</style>