<template>
  <Modal @entered="entered" v-if="isEntered" />
  <Home v-else />
</template>

<script>
  import Home from './components/Home.vue'
  import Modal from './components/Modal.vue'

  import './assets/css/null.css'
  import './assets/css/all.css'
  import './assets/css/style.css'

  export default {
    name: 'App',
    components: {
      Modal,
      Home
    },
    data() {
      return {
        isEntered: true,
      }
    },
    methods: {
      entered(id){
        this.isEntered = false
      }
    },
  }
</script>

<style lang="scss">
  .login {
    width: 100%;
    padding: 7px 10px;
    background: #DFDFDF;
    border: 1px solid #DFDFDF;
    border-radius: 6px;
    transition: all .4s ease;
  }

  .main__btn {
    padding: 7px 10px;
    border: none;
    border-radius: 6px;
    color: #fff;
    background: #000;
    transition: all .5s ease;
  }
  .btn{
     border: 1px solid #000;
     color: #000;
     background: transparent;
  }
</style>