<template>
  <div class="add__modal--backdrop" @click="close"></div>
  <div class="add__modal d-flex justify-content-center align-items-center" v-click-outside="close">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="add__modal--content">
            <div class="text-center mb-4" style="font-size:16px;font-weight:500">Создать карточку</div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center">
                <input type="radio" name="card_type" style="margin-right: 7px;" v-model="cardType" :value="false" id="income">
                <label for="income">Доход</label>
              </div>
              <div class="d-flex align-items-center">
                <input type="radio" name="card_type" style="margin-right: 7px;" v-model="cardType" :value="true" checked id="expense">
                <label for="expense">Расход</label>
              </div>
            </div>
            <div class="d-flex justify-content-center align-items-center mb-3">
              <Datepicker v-model="date" />
            </div>
            <treeselect v-model="type" :options="options" :clearable="false" :searchable="false" />
            <!-- <treeselect v-model="type" :options="optionsIncome" :clearable="false" v-else /> -->
            <div v-if="type === 'other' || type === 'otherFrom' || type === 'snacks'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Наименование">
              <input type="text" class="login" v-model="modelNumber" placeholder="Сумма">
            </div>
            <div v-if="type === 'debt' || type === 'gift'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Кому">
              <input type="text" class="login" v-model="modelNumber" placeholder="Сумма">
            </div>
            <div v-if="type === 'repayment'" class="mt-2" style="height: 265px;max-height: 265px;overflow-y: scroll;">
              <div v-for="(input, key) in inputs" :key="key" class="mb-3 p-2 pt-3 border" style="border-radius: 0.25rem;position:relative">
                <div class="d-flex justify-content-between mb-2" style="position: absolute;right: 3px;top: 3px;left: 6px">
                  <span>#{{key+1}}</span>
                  <i class="add__btn far fa-times-circle text-secondary" style="font-size: 14px;right: 5px" @click="removeRepayment(key)" v-if="inputs.length !== 1"></i>
                </div>
                <input type="text" class="login mb-2 mt-1" v-model="input.name" placeholder="Название">
                <input type="number" class="login mb-2" v-model="input.value" placeholder="Сумма">
              </div>
            </div>
            <button v-if="type === 'repayment'" class="main__btn mt-1" @click="addRepayment()">Еще</button>
            <div v-if="type === 'meal'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Название">
              <input type="text" class="login" v-model="modelNumber" placeholder="Общий счет">
            </div>
            <div v-if="type === 'airticket'" class="mt-2" style="height: 265px;max-height: 265px;overflow: scroll;">
              <div v-for="(input, key) in airtickets" :key="key" class="mb-2 p-2 pt-3 border" style="border-radius: 0.25rem;position:relative">
                <div class="d-flex justify-content-between mb-2" style="position: absolute;right: 3px;top: 3px;left: 6px">
                  <span>#{{key+1}}</span>
                  <i class="add__btn far fa-times-circle text-secondary" style="font-size: 14px" @click="removeAirTicket(key)" v-if="inputs.length !== 1"></i>
                </div>
                <input type="text" class="login mt-4" v-model="input.from" placeholder="Откуда">
                <input type="text" class="login mt-2 mb-4" v-model="input.to" placeholder="Куда">
                <input type="text" class="login mb-2" v-model="input.value" placeholder="Сумма">
              </div>
            </div>
            <div v-if="type === 'airticket'" >
              <button class="main__btn mt-1" @click="addAirTicket()">Добавить авиабилет</button>
              <div class="mt-3 text-right">Общий счет: <b>{{getAirTicketsAmount()}} тенге</b></div>
            </div>
            <div v-if="type === 'onay' || type === 'taxi' || type === 'mobile' || type === 'internet' || type === 'products'">
              <input type="text" class="login mt-4" v-model="modelNumber" placeholder="Общий счет">
            </div>
            <div v-if="type === 'debtFrom' || type === 'giftFrom'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="От кого">
              <input type="text" class="login" v-model="modelNumber" placeholder="Сумма">
            </div>
            <div v-if="type === 'salary' || type === 'depositFrom' || type === 'deposit'">
              <input type="text" class="login mt-4" v-model="modelNumber" placeholder="Сумма">
            </div>
            <div class="d-flex justify-content-end mt-4">
              <button class="main__btn" :class="{ not__clickable: !isDone }" @click="add">Добавить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const URL = 'http://195.49.212.34:8080/api/'
  // const URL = 'http://localhost:8080/api/'
  export default {
    emits: ['close', 'add'],
    props: ['isIncome', 'number'],
    data() {
      return {
        title: "",
        value: "",
        date: new Date(),
        userId: parseInt(localStorage.getItem('userId')),
        type: 'other',
        options: [
          {id: 'other', label: 'Другое'},
          {id: 'deposit', label: 'Пополнение депозита'},
          {id: 'debt', label: 'В долг'},
          {id: 'repayment', label: 'Погашение кредита'},
          {id: 'meal', label: 'Еда'},
          {id: 'snacks', label: 'Десерт, снеки'},
          {id: 'taxi', label: 'Такси'},
          {id: 'products', label: 'Продукты'},
          {id: 'onay', label: 'Пополнение Onay'},
          {id: 'mobile', label: 'Пополнение телефона'},
          {id: 'internet', label: 'Оплата за интернета'},
          {id: 'gift', label: 'Подарок'},
          {id: 'airticket', label: 'Покупка авиабилета'},
        ],
        inputs: [{name: '', value: ''}],
        airtickets: [{from: '', to: '', value: ''}],
        isDone: false,
        cardType: true,
      }
    },
    mounted() {
      if(this.isIncome){
        this.value = this.number
        this.type = 'otherFrom'
        // optionsIncome: [
        //   {id: 'otherFrom', label: 'Другое'},
        //   {id: 'debtFrom', label: 'Долг'},
        //   {id: 'salary', label: 'Зарплата'},
        //   {id: 'gift', label: 'Подарок'},
        // ],
        this.options = [
          {id: 'otherFrom', label: 'Другое'},
          {id: 'debtFrom', label: 'Долг'},
          {id: 'salary', label: 'Зарплата'},
          {id: 'giftFrom', label: 'Подарок'},
        ]
      }
    },
    watch: {
      cardType(){
        if(this.cardType){
          this.options = [
            {id: 'other', label: 'Другое'},
            {id: 'deposit', label: 'Пополнение депозита'},
            {id: 'debt', label: 'В долг'},
            {id: 'repayment', label: 'Погашение кредита'},
            {id: 'meal', label: 'Еда'},
            {id: 'snacks', label: 'Десерт, снеки'},
            {id: 'taxi', label: 'Такси'},
            {id: 'products', label: 'Продукты'},
            {id: 'onay', label: 'Пополнение Onay'},
            {id: 'mobile', label: 'Пополнение телефона'},
            {id: 'internet', label: 'Оплата за интернета'},
            {id: 'gift', label: 'Подарок'},
            {id: 'airticket', label: 'Покупка авиабилета'},
          ]
        } else {
          this.options = [
            {id: 'otherFrom', label: 'Другое'},
            {id: 'depositFrom', label: 'Снятия с депозита'},
            {id: 'debtFrom', label: 'Возвращение долга'},
            {id: 'salary', label: 'Зарплата'},
            {id: 'giftFrom', label: 'Подарок'},
          ]
        }
      }
    },
    computed: {
      isDone(){
        if(this.type === 'repayment'){
          return this.inputs.filter(item => typeof item.value === 'number' && item.name !== '').length === this.inputs.length
        } else if(this.type === 'salary' || 
          this.type === 'onay' || this.type === 'products' || 
          this.type === 'mobile' || this.type === 'internet' ||
          this.type === 'taxi' || this.type === 'depositFrom' || this.type === 'deposit'
        ){
          return this.value !== ''
        } else if(this.type === 'airticket') {
          return this.airtickets.filter(item => item.value !== '' && typeof +item.value === 'number' && item.from !== '' && item.to !== '').length === this.airtickets.length
        } else{
          return this.title !== "" && this.value !== ""
        }
        

      },
      modelNumber: {
        get() {
          if(this.value !== ''){
            return this.getMoneyFormat(+this.value)
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
          this.value = +val
        },
      }
    },
    methods: {
      getMoneyFormat(money){
        return new Intl.NumberFormat().format(money)
      },
      close() {
        this.$emit('close')
      },
      getAirTicketsAmount(){
        let cost = 0
        this.airtickets.map(item => cost += +item.value)
        return this.getMoneyFormat(cost)
      },
      addAirTicket(){
        this.airtickets.push({from: '', to: '', value: ''})
      },
      removeAirTicket(id){
        this.airtickets.splice(id, 1)
      },
      addRepayment(){
        this.inputs.push({name: '', value: ''})
      },
      removeRepayment(id){
        this.inputs.splice(id, 1)
      },
      async add() {
        let obj
        obj = {
          type: this.type,
          isIncome: this.cardType ? false : true ,
          date: this.date
        }
        switch (this.type) {
          case 'onay':
            obj.title = 'Пополнение Onay'
            break;
          case 'salary':
            obj.title = this.title === '' ? 'Зарплата' : this.title
          case 'depositFrom':
            obj.title = 'Снятия с депозита'
          case 'deposit':
            obj.title = 'Пополнение депозита'
            break
          case 'snacks':
            obj.title = this.title === '' ? 'Десерты, снеки' : this.title
            break
          case 'repayment':
            obj.title = 'Погашение кредита'
            obj.repayments = []
            this.inputs.map(item => {
              obj.repayments.push({
                name: item.name,
                value: +item.value
              })
            })
            break
          case 'airticket':
            obj.title = 'Покупка авиабилета'
            obj.airtickets = []
            this.airtickets.map(item => {
              obj.airtickets.push({
                from: item.from,
                to: item.to,
                value: +item.value
              })
            })
            break
          case 'taxi':
            obj.title = 'Такси'
            break
          case 'products':
            obj.title = 'Покупка продуктов'
            break
          case 'mobile':
            obj.title = 'Пополнение телефона'
            break
          case 'internet':
            obj.title = 'Оплата за интернет'
            break
          default:
            obj.title = this.title
            break
        }

        if(this.type === 'repayment'){
          let cost = 0
          this.inputs.map(item => cost += item.value)
          obj.cost = cost
        } else if(this.type === 'airticket') {
          let cost = 0
          this.airtickets.map(item => cost += +item.value)
          obj.cost = cost
        } else {
          obj.cost = this.value
        }
        
        this.$emit('add', {obj, isIncome: this.cardType ? false : true})
        
        this.title = this.value = ""
        this.close()
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
    margin-top: 25px;
    left: 0;
    z-index: 10;

    .add__modal--content {
      padding: 15px;
      border-radius: 7px;
      border: 1px solid #000;
      background: #fff;
      max-width: 960px; 
      margin: 0 auto;
    }
  }
</style>