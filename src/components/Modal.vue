<template>
  <div class="auth__modal d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="modal__content">
            <div class="col-12 text-center"><p class="title">Вход</p></div>
            <div class="col-12 mt-4 mb-4"><input type="text" class="login" :class="{ error: empty}" v-model="username" placeholder="Логин"></div>
            <div class="col-12 d-flex justify-content-end"><button class="main__btn" @click="getAccounts">Войти</button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const URL = 'http://localhost:3000/'
export default {
  emits: ['entered'],
  data() {
    return {
      username: "",
      empty: false,
    }
  },
  methods: {
    async getAccounts(){
      if(this.username.length > 0){
        await this.axios.get(URL + 'accounts/').then(res => {
          let index = res.data.findIndex(el => el.username === this.username)
          if(index != -1){
            this.username = ""
            localStorage.setItem('userId', res.data[index].id)
            this.$emit('entered')            
          }else{
            this.axios.get(URL + 'accounts/').then(res => {
              if(res.data.length === 0){
                this.axios.post(URL + 'accounts/',{
                  "id": 1000,
                  "username": this.username
                }).then(()=>{
                  this.axios.post(URL + 'revenues/', {
                    "id": 1000,
                    "revenue": 0,
                    "expenses": []
                  }).then(()=>{
                    localStorage.setItem('userId', 1000)
                    this.$emit('entered')
                  })
                })
              }else{
                this.axios.post(URL + 'accounts/',{
                  "username": this.username
                }).then(res =>{
                  this.axios.post(URL + 'revenues/', {
                    "id": res.data.id,
                    "revenue": 0,
                    "expenses": []
                  }).then(res =>{
                    localStorage.setItem('userId', res.data.id)
                    this.$emit('entered')
                  })
                })
              }
            })
            
          }
        })
        this.empty = false
      }else{
        this.empty = true
      }
      
    }
  },
}
</script>

<style lang="scss">
  .auth__modal{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .modal__content{
      margin: 0 auto;
      max-width: 300px;
      padding: 15px 20px;
      background: #fff;
      border: 1px solid #000;
      border-radius: 12px;
      
      .title{
        font-size: 16px;
        font-weight: 300;
      }
      .error{
        border: 1px solid tomato;
      }
      
    }
  }
</style>