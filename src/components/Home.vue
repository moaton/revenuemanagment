<template>
  <div class="container">
    <div class="row justify-content-lg-center align-items-lg-center">
      <div class="col-12 col-lg-6">
        <div class="home" v-if="revenues.length != 0">
          <div class="col-12 col-lg-10 offset-lg-1"><input type="number" min="5" class="login px-3 py-2" v-model="number" placeholder="Доход"></div>
          <div class="col-12 col-lg-10 offset-lg-1 d-flex justify-content-between mt-4 mb-4">
            <button class="main__btn btn__border" @click="newRevenue">Новый доход</button>
            <button class="main__btn" @click="addRevenue" :disabled="number<=0">Добавить</button>
          </div>
          <div class="col-12 text-center d-flex align-items-center justify-content-center" style="position:relative;">
            <div class="spinner-grow spinner-grow-sm" role="status" v-if="isLoading" style="position: absolute; left: -27px;">
              <span class="sr-only">Loading...</span>
            </div>
            <p id="revenue" class="revenue"><vue3-autocounter ref='counter' :startAmount='start' :endAmount='end' :duration='3' prefix='' suffix=' тенге' separator=',' decimalSeparator='.' :decimals='2' :autoinit='true' @finished='finished' /></p>
          </div>
          <hr>
          <div class="revenue__content col-12 col-lg-10 offset-lg-1" v-if="revenues.expenses.length > 0">
            <div class="wrapper">
              <div v-for="(item, index) in displayExpenses" :key="index">
                <p class="date__title" v-if="item.datetime === new Date().getDate() + '.' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '.' + new Date().getFullYear()">
                  Сегодня
                </p>
                <p class="date__title" v-else>
                  {{item.datetime}}
                </p>
                <div class="revenue__card mb-4" style="position: relative;" :style="getStyle(exp.type) + 'max-height: 123px;'" v-for="(exp, index) in item.exp" :key="index">
                  <div class="col-12 d-flex justify-content-between align-items-center">
                    <div class="revenue__card--title">{{ exp.title }}</div>
                    <i class="far fa-times-circle" @click="deleteExpense(exp)"></i>
                  </div>
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.3;"><i :class="getIconClass(exp.type)" style="font-size: 65px;"></i></div>
                  <div class="revenue__card--cost"><span>{{getSymbol(exp.type)}}</span> {{ exp.cost }} тенге</div>
                  <template v-if="exp.type === 'repayment'">
                    <div style="max-height: 16px; overflow: scroll;">
                      <div v-for="(repayment, key) in exp.repayments" :key="key">
                        <span>{{repayment.name}}: {{repayment.value}} тенге</span>
                      </div>
                    </div>
                  </template>
                  <div class="revenue__card--date text-end">{{getDate(exp.date)}}</div>
              </div>
              </div>
            </div>
          </div>
          <div class="col-12 text-center" v-else>
            <p>У вас нет расходов</p>
          </div>
          <i class="add__btn fas fa-plus-circle" @click="expenseModal = true"></i>
        </div>
      </div>
      <NewExpense v-if="expenseModal" @add="add" :isIncome="isIncome" :number="number" @close="expenseModal = false" />
    </div>
  </div>
</template>

<script>
  import NewExpense from './NewExpense.vue'

  const URL = 'http://195.49.212.34:8080/api/'
  export default {
    components: {
      NewExpense,
    },
    data() {
      return {
        revenues: [],
        number: null,
        userId: parseInt(localStorage.getItem('userId')),
        expenseModal: false,
        isIncome: false,
        start: 0,
        end: 0,
        isLoading: false,
      }
    },
    computed: {
      displayExpenses() {
        return this.revenues.expenses
      }
    },
    async mounted() {
      await this.getRevenues()
    },
    methods: {
      getStyle(type){
        switch (type) {
          case 'salary':
            return 'background: #2a9d8f;color: #fff;'
          case 'meal':
            return 'background: #ffd166;color: #fff;'
          case 'debt':
            return 'background: #ef476f;color: #fff;'
          case 'debtFrom':
            return 'background: #6096ba;color: #fff;'
          case 'gift':
            return 'background: #ef476f;color: #fff;'
          case 'repayment':
            return 'background: #90caf9;color: #fff;'
          default:
            return 'background: transparent;';
        }
      },
      getIconClass(type){
        switch (type) {
          case 'salary':
            return 'fa fa-wallet'
          case 'meal':
            return 'fa fa-drumstick-bite'
          case 'debt':
            return 'fa fa-arrow-right'
          case 'debtFrom':
            return 'fa fa-arrow-left'
          case 'gift':
            return 'fa fa-gift'
          case 'repayment':
            return 'fa fa-credit-card'
          default:
            return '';
        }
      },
      getDate(date){
        let dateTime = new Date(date)
        return dateTime.getDate() + '.' + (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)) + '.' + dateTime.getFullYear()
      },
      getSymbol(type){
        if(type === 'salary' || type === 'debtFrom' || type === 'gift' || type === 'otherFrom'){
          return '+'
        }
        return '-'
      },
      async add(data) {
        this.isLoading = true
        setTimeout(async () => {
          this.start = this.revenues.revenue
          this.end = !data.isIncome ? this.revenues.revenue - data.obj.cost : this.revenues.revenue + data.obj.cost

          if(!data.isIncome)
            this.revenues.revenue -= data.obj.cost
          else
            this.revenues.revenue += data.obj.cost
          // this.revenues.expenses.unshift(data.obj)
          let date = new Date()
          if(this.revenues.expenses.length !== 0){
            this.revenues.expenses[0].exp.unshift(data.obj)
          } else {
            let dateTime = new Date(data.obj.date).getDate() + '.' + (new Date(data.obj.date).getMonth() + 1 < 10 ? '0' + (new Date(data.obj.date).getMonth() + 1) : (new Date(data.obj.date).getMonth() + 1)) + '.' + new Date(data.obj.date).getFullYear()
            let exp = []
            exp.push(data.obj)
            this.revenues.expenses.push({exp: exp, datetime: dateTime})
          }
          let expenses = []
          this.revenues.expenses.map(item => {
            expenses = [...expenses, ...item.exp]
          })
          let params = {
            id: this.userId,
            revenue: this.revenues.revenue,
            expenses: JSON.stringify(expenses)
          }
          await this.axios.put(URL + 'revenues/' + this.userId, params)
          this.number = null
          this.isIncome = false
          this.startCounter()
        }, 1000)
      },
      async deleteExpense(item) {
        let dateTime = new Date(item.date)
        let index = this.revenues.expenses.findIndex(el => el.datetime === dateTime.getDate() + '.' + (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)) + '.' + dateTime.getFullYear())
        if(index === -1)
          return
        let indexExp = this.revenues.expenses[index].exp.findIndex(el => el === item)
        this.isLoading = true
        if (indexExp != -1) {
          this.revenues.expenses[index].exp.splice(indexExp, 1)
          setTimeout(async () => {
            var count = this.revenues.revenue;
            var number = !item.isIncome ? this.revenues.revenue + item.cost : this.revenues.revenue - item.cost 
            this.start = count
            this.end = number
            if(item.type === 'salary' || item.type === 'debtFrom' || item.type === 'gift' || item.type === 'otherFrom')
              this.revenues.revenue -= item.cost
            else
              this.revenues.revenue += item.cost
            let expenses = []
            this.revenues.expenses.map(data => {
              expenses = [...expenses, ...data.exp]
            })
            let params = {
              id: this.userId,
              revenue: this.revenues.revenue,
              expenses: JSON.stringify(expenses)
            }
            await this.axios.put(URL + 'revenues/' + this.userId, params).then(() => {
              this.startCounter()
            })
          }, 1000)
        }
      },
      async addRevenue() {
        if (this.number > 0) {
          this.isIncome = true
          this.expenseModal = true
        }
      },
      async newRevenue() {
        this.isLoading = true
        if (this.number > 0) {
          let params = {
            id: this.userId,
            revenue: this.number,
          }
          await this.axios.put(URL + 'revenues/' + this.userId, params).then(res => {
            this.revenues.revenue = +res.data.revenue,
            this.number = null
            this.end = this.revenues.revenue
            this.startCounter()
          })
        }
      },
      async getRevenues() {
        this.isLoading = true
        this.revenues = []
        await this.axios.get(URL + 'revenues/' + this.userId).then(res => {
          let dates = []
          let date = new Date()
          if(res.data.expenses !== null){
            JSON.parse(res.data.expenses).map(item => {
              let dateTime = new Date(item.date).getDate() + '.' + (new Date(item.date).getMonth() + 1 < 10 ? '0' + (new Date(item.date).getMonth() + 1) : (new Date(item.date).getMonth() + 1)) + '.' + new Date(item.date).getFullYear()
              if(dates.findIndex(date => date.datetime === dateTime) === -1){
                let exp = JSON.parse(res.data.expenses).filter(item => (new Date(item.date).getDate() + '.' + (new Date(item.date).getMonth() + 1 < 10 ? '0' + (new Date(item.date).getMonth() + 1) : (new Date(item.date).getMonth() + 1)) + '.' + new Date(item.date).getFullYear()) === dateTime)
                dates.push({ exp: exp, datetime: dateTime })
              }
            })
          }
          this.revenues = {...res.data, revenue: +res.data.revenue, expenses: res.data.expenses ? dates : []}
          if(this.revenues.revenue > 0){
            this.end = +this.revenues.revenue
          }
          this.startCounter(this.revenues.revenue)
        })
      },
      startCounter(){
        setTimeout(() => {
          this.$refs.counter.start();
        }, 0)
      },
      finished(){
        this.start = this.end
        this.isLoading = false
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