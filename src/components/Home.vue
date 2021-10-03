<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="home" v-if="revenues.length != 0">
          <div class="col-12"><input type="number" min="5" class="login" v-model="number" placeholder="Доход"></div>
          <div class="col-12 d-flex justify-content-between mt-4 mb-4">
            <button class="main__btn btn" @click="newRevenue">Новый доход</button>
            <button class="main__btn" @click="addRevenue">Добавить</button>
          </div>
          <div class="col-12 text-center">
            <p id="revenue" class="revenue">{{ revenues.revenue }}</p>
          </div>
          <hr>
          <div class="revenue__content col-12" v-if="revenues.expenses.length > 0">
            <div class="wrapper">
              <div class="revenue__card mb-4" v-for="(item, index) in displayExpenses" :key="index">
                <div class="col-12 d-flex justify-content-between align-items-center">
                  <div class="revenue__card--title">{{ item.title }}</div>
                  <i class="far fa-times-circle" @click="deleteExpense(item)"></i>
                </div>
                <div class="revenue__card--cost">{{ item.cost }} тенге</div>
                <div class="revenue__card--date text-end">{{item.date }}</div>
              </div>
            </div>
          </div>
          <div class="col-12 text-center" v-else>
            <p>У вас нет расходов</p>
          </div>
          <i class="add__btn fas fa-plus-circle" @click="expenseModal = true"></i>
        </div>
      </div>
      <NewExpense v-if="expenseModal" @add="add" @close="expenseModal = false" />
    </div>
  </div>
</template>

<script>
  import NewExpense from './NewExpense.vue'
  const URL = 'http://localhost:3000/'
  export default {
    components: {
      NewExpense
    },
    data() {
      return {
        revenues: [],
        number: null,
        userId: parseInt(localStorage.getItem('userId')),
        expenseModal: false
      }
    },
    computed: {
      displayExpenses() {
        return this.revenues.expenses.reverse()
      }
    },
    mounted() {
      this.getRevenues()
    },
    methods: {
      add(obj) {
        setTimeout(() => {
          var count = this.revenues.revenue;
          var number = this.revenues.revenue - obj.cost;
          var interval = setInterval(() => {
            document.getElementById('revenue').innerHTML = --count;

            if (count === number) {
              clearInterval(interval)
              this.revenues.revenue -= obj.cost
            }
          }, 10);
        }, 1000)

        this.revenues.expenses.push(obj)
      },
      async deleteExpense(item) {

        let index = this.revenues.expenses.findIndex(el => el === item)
        if (index != -1) {
          this.revenues.expenses.splice(index, 1)
          setTimeout(() => {
            var count = this.revenues.revenue;
            var number = this.revenues.revenue + item.cost;
            var interval = setInterval(() => {
              document.getElementById('revenue').innerHTML = ++count;

              if (count === number) {
                clearInterval(interval)
                this.revenues.revenue += item.cost
              }
            }, 10);
          }, 1000)
          await this.axios.patch(URL + 'revenues/' + this.userId, {
            "revenue": this.revenues.revenue + item.cost,
            "expenses": this.revenues.expenses
          })
        }
      },
      async addRevenue() {
        if (this.number > 0) {
          await this.axios.patch(URL + 'revenues/' + this.userId, {
            "revenue": this.revenues.revenue + this.number
          }).then(

            this.revenues.revenue += this.number,
            this.number = null
          )
        }
      },
      async newRevenue() {
        if (this.number > 0) {
          await this.axios.patch(URL + 'revenues/' + this.userId, {
            "revenue": this.number
          }).then(() => {
            this.revenues.revenue = this.number,
              this.number = null
          })
        }
      },
      async getRevenues() {
        this.revenues = []
        await this.axios.get(URL + 'revenues/' + this.userId).then(res => {
          this.revenues = res.data
        })
      }
    },
  }
</script>

<style lang="scss">
  .home {
    position: relative;
    margin-top: 40px;
    margin-bottom: 60px;
    border: 1px solid #000;
    border-radius: 12px;
    padding: 20px 40px 40px;
    background: #fff;

    .add__btn {
      position: absolute;
      bottom: 20px;
      right: 30px;
      font-size: 42px;
      color: rgb(0, 0, 0, .6);
    }

    .revenue {
      font-size: 24px;
    }

    .revenue::after {
      content: "тенге";
      margin-left: 5px;
    }

    .revenue__content {
      height: 300px;
      overflow: hidden;
      position: relative;

      .wrapper {
        height: 100%;
        overflow: scroll;
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

          &--cost::before {
            content: "-";
            margin-right: 5px;
          }

          &--date {
            font-size: 10px;
            color: rgb(0, 0, 0, .5);
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
</style>