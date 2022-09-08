<template>
  <Modal @entered="entered" v-if="isEntered" />
  <Layout v-else />
</template>

<script>
  import Modal from './components/Modal.vue'
  import Layout from './components/Layout.vue'

  import './assets/css/null.css'
  import './assets/css/all.css'
  import './assets/css/style.css'

  export default {
    name: 'App',
    components: {
      Modal,
      Layout
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
    cursor: pointer;
    transition: all .5s ease;
  }
  .main__btn:disabled{
    background: #5a5858;
    cursor: not-allowed;
  }
  .btn__border{
    border: 1px solid #000;
    color: #000;
    background: transparent;
  }
</style>