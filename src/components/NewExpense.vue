<template>
  <div class="add__modal--backdrop" @click="close"></div>
  <div class="add__modal d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="add__modal--content">
            <div class="text-center">Новый расход</div>
            <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Наименование">
            <input type="number" class="login" v-model="value" placeholder="Сумма">
            <div class="d-flex justify-content-end mt-4">
              <button class="main__btn" :class="{ not__clickable: value === '' }" @click="add">Добавить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const URL = 'http://localhost:3000/'
  export default {
    emits: ['close', 'add'],
    data() {
      return {
        title: "",
        value: "",
        userId: parseInt(localStorage.getItem('userId'))
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      async add() {
        let obj
        await this.axios.get(URL + 'revenues/' + this.userId).then(res => {
          let date = new Date()
          obj = {
            "title": this.title,
            "cost": this.value,
            "date": date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date
              .getMonth() + 1)) + '.' + date.getFullYear()
          }
          res.data.expenses.push(obj)
          this.$emit('add', obj)
          this.axios.patch(URL + 'revenues/' + this.userId, {
            "revenue": res.data.revenue - obj.cost,
            "expenses": res.data.expenses
          })
          this.title = this.value = ""
          this.close()

        })
      }
    },
  }
</script>

<style lang="scss">
  .not__clickable {
    opacity: .5;
    pointer-events: none;
    transition: all .5s ease;
  }

  .add__modal--backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    backdrop-filter: blur(2px);
  }

  .add__modal {
    position: absolute;
    margin-top: 100px;
    z-index: 10;

    .add__modal--content {
      padding: 15px;
      border-radius: 7px;
      border: 1px solid #000;
      background: #fff;
    }
  }
</style>