<template>
  <div class="row justify-content-lg-center align-items-lg-center">
    <div class="col-12">
      <div class="" v-if="revenues.length != 0">
        <div class="col-11 offset-1 col-lg-10">
          <input type="text" min="5" class="login px-3 py-2" v-model="modelNumber" placeholder="Доход">
        </div>
        <div class="col-12 col-lg-10 offset-lg-1 d-flex justify-content-end mt-2 mb-4">
          <button class="main__btn btn__border" @click="newRevenue">Обновить цифру</button>
          <!-- <button class="main__btn" @click="addRevenue" :disabled="number<=0">Добавить</button> -->
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
                Сегодня <sup v-html="getTotal(item.exp)"></sup>
              </p>
              <p class="date__title" v-else>
                {{item.datetime}} <sup v-html="getTotal(item.exp)"></sup>
              </p>
              <div class="revenue__card mb-4" style="position: relative;" :style="getStyle(exp.type) + 'max-height: 155px;'" v-for="(exp, index) in item.exp" :key="index">
                <div class="col-12 d-flex justify-content-between align-items-center">
                  <div class="revenue__card--title">{{ exp.title }}</div>
                  <i class="far fa-times-circle" @click="deleteExpense(exp)" style="cursor:pointer;"></i>
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.3;">
                  <i :class="getIconClass(exp.type)" style="font-size: 60px;"></i>
                </div>
                <div class="revenue__card--cost"><span>{{getSymbol(exp.type)}}</span> {{ getMoneyFormat(exp.cost) }} тенге</div>
                <template v-if="exp.type === 'repayment'">
                  <div style="max-height: 16px;overflow-y: scroll;">
                    <div v-for="(repayment, key) in exp.repayments" :key="key">
                      <span>{{repayment.name}}: {{getMoneyFormat(repayment.value)}} тенге</span>
                    </div>
                  </div>
                </template>
                <template v-if="exp.type === 'airticket'">
                  <div style="max-height: 16px;overflow-y: scroll;">
                    <div v-for="(airticket, key) in exp.airtickets" :key="key">
                      <span>{{airticket.from}}-{{airticket.to}}: {{getMoneyFormat(airticket.value)}} тенге</span>
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
        <!-- <i class="add__btn fas fa-plus-circle" @click="expenseModal = true"></i> -->
        <div class="add__btn" @click="openModalExpense" style="height: 39px; display: flex; align-items: center; background: #ffffff; border-radius: 50%; color: #000;cursor: pointer;">
          <i class="bi bi-plus-circle"></i>
        </div>
      </div>
    </div>
    <NewExpense v-if="expenseModal" @add="add" :isIncome="isIncome" :number="number" @close="expenseModal = false" />
  </div>
</template>

<script>
  import NewExpense from './NewExpense.vue'
  const URL = 'http://195.49.212.34:8080/api/'
  // const URL = 'http://localhost:8080/api/'
  export default {
    components: {
      NewExpense,
    },
    data() {
      return {
        revenues: [],
        number: '',
        userId: parseInt(localStorage.getItem('userId')),
        expenseModal: false,
        isIncome: false,
        start: 0,
        end: 0,
        isLoading: false,
        sidebar: false,
      }
    },
    computed: {
      displayExpenses() {
        return this.revenues.expenses
      },
      modelNumber: {
        get() {
          if(this.number !== '' && +this.number !== 0){
            return this.getMoneyFormat(+this.number)
          } else {
            return ''
          }
        },
        set(value) {
          let val = ''
          value.split('').map(letter => {
            if(letter.charCodeAt() !== 160){
              val += letter
            }
          })
          this.number = +val
        },
      }
    },
    async mounted() {
      await this.getRevenues()
    },
    methods: {
      openModalExpense(){
        setTimeout(() => {
          this.expenseModal = true
        }, 0)
      },
      getMoneyFormat(money){
        return new Intl.NumberFormat().format(money)
      },
      getTotal(exp){
        let total = 0
        exp.map(item => {
          if(item.isIncome){
            total -= item.cost
          } else {
            total += item.cost
          }
        })
        let html = '<small class="$1">$2</small>'
        let text = total > 0 ? `-${this.getMoneyFormat(total)} тг` : total < 0 ? `+${Math.abs(total)} тг` : '0'
        let className = total > 0 ? 'text-danger' : total < 0 ? 'text-success' : ''
        return html.replace('$1', className).replace('$2', text)
      },
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
          case 'onay':
            return 'background: #f8b413;color: #fff;'
          case 'taxi':
            return 'background: #2f4858;color: #fff;'
          case 'products':
            return 'background: #0e9594;color: #fff;'
          case 'snacks':
            return 'background: #fef9ef;'
          case 'airticket':
            return 'background: #508991;color: #fff;'
          case 'mobile':
            return 'background: #172a3a;color: #fff;'
          case 'internet':
            return 'background: #0353a4;color: #fff;'
          case 'deposit':
            return 'background: #e07a5f;color: #fff;'
          case 'depositFrom':
            return 'background: #ef957d;color: #fff;'
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
          case 'onay':
            return 'fa fa-bus'
          case 'taxi':
            return 'fa fa-taxi'
          case 'products':
            return 'fa fa-shopping-cart'
          case 'snacks':
            return 'fa fa-ice-cream'
          case 'airticket':
            return 'fa fa-plane-departure'
          case 'mobile':
            return 'fa fa-mobile'
          case 'internet':
            return 'fa fa-wifi'
          case 'deposit':
            return 'fa fa-money-bill'
          case 'depositFrom':
            return 'fa fa-money-bill-alt'
          default:
            return '';
        }
      },
      getDate(date){
        let dateTime = new Date(date)
        return dateTime.getDate() + '.' + (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1)) + '.' + dateTime.getFullYear()
      },
      getSymbol(type){
        if(type === 'salary' || type === 'debtFrom' || type === 'gift' || type === 'otherFrom' || type === 'depositFrom'){
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
          let dateTime = new Date(data.obj.date).getDate() + '.' + (new Date(data.obj.date).getMonth() + 1 < 10 ? '0' + (new Date(data.obj.date).getMonth() + 1) : (new Date(data.obj.date).getMonth() + 1)) + '.' + new Date(data.obj.date).getFullYear()
          if(this.revenues.expenses.length !== 0){
            if(this.revenues.expenses[0].datetime === dateTime){
              this.revenues.expenses[0].exp.unshift(data.obj)
            } else {
              let exp = []
              exp.push(data.obj)
              this.revenues.expenses.unshift({exp: exp, datetime: dateTime})
            }
          } else {
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
          if(this.revenues.expenses[index].exp.length === 0){
            this.revenues.expenses.splice(index, 1)
          }
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
</style>