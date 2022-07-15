<template>
  <div class="add__modal--backdrop" @click="close"></div>
  <div class="add__modal d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="add__modal--content">
            <div class="text-center mb-2">Новый <span v-if="!isIncome">расход</span><span v-else>доход</span></div>
            <treeselect v-model="type" :options="options" :clearable="false" />
            <!-- <treeselect v-model="type" :options="optionsIncome" :clearable="false" v-else /> -->
            <div v-if="type === 'other' || type === 'otherFrom'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Наименование">
              <input type="number" class="login" v-model="value" placeholder="Сумма">
            </div>
            <div v-if="type === 'debt'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Кому">
              <input type="number" class="login" v-model="value" placeholder="Сумма">
            </div>
            <div v-if="type === 'repayment'" class="mt-2" style="height: 265px;max-height: 265px;overflow: scroll;">
              <div v-for="(input, key) in inputs" :key="key" class="mb-2 p-2 pt-3 border" style="border-radius: 0.25rem;position:relative">
                <div class="d-flex justify-content-between mb-2" style="position: absolute;right: 3px;top: 3px;left: 6px">
                  <span>#{{key+1}}</span>
                  <i class="add__btn far fa-times-circle text-secondary" style="font-size: 14px" @click="removeRepayment(key)" v-if="inputs.length !== 1"></i>
                </div>
                <input type="text" class="login mb-2 mt-1" v-model="input.name" placeholder="Название">
                <input type="number" class="login mb-2" v-model="input.value" placeholder="Сумма">
              </div>
            </div>
            <div v-if="type === 'meal'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Название">
              <input type="number" class="login" v-model="value" placeholder="Общий счет">
            </div>
            <div v-if="type === 'debtFrom' || type === 'gift'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="От кого">
              <input type="number" class="login" v-model="value" placeholder="Сумма">
            </div>
            <div v-if="type === 'salary'">
              <input type="text" class="login mt-4 mb-4" v-model="title" placeholder="Зарплата">
              <input type="number" class="login" v-model="value" placeholder="Сумма">
            </div>
            <button v-if="type === 'repayment'" class="main__btn mt-1" @click="addRepayment()">Еще</button>
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
  export default {
    emits: ['close', 'add'],
    props: ['isIncome', 'number'],
    data() {
      return {
        title: "",
        value: "",
        userId: parseInt(localStorage.getItem('userId')),
        type: 'other',
        options: [
          {id: 'other', label: 'Другое'},
          {id: 'debt', label: 'В долг'},
          {id: 'repayment', label: 'Погашение кредита'},
          {id: 'meal', label: 'Еда'},
        ],
        inputs: [{name: '', value: ''}],
        isDone: false,
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
          {id: 'gift', label: 'Подарок'},
        ]
      }
    },
    computed: {
      isDone(){
        if(this.type === 'repayment'){
          return this.inputs.filter(item => typeof item.value === 'number' && item.name !== '').length === this.inputs.length
        } else if(this.type === 'salary'){
          return this.value !== ''
        } else{
          return this.title !== "" && this.value !== ""
        }
        
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      addRepayment(){
        this.inputs.push({name: '', value: ''})
      },
      removeRepayment(id){
        this.inputs.splice(id, 1)
      },
      async add() {
        let obj
        // await this.axios.get(URL + 'revenues/' + this.userId).then(res => {
          // let date = new Date()
          // obj = {
          //   type: this.type,
          //   isIncome: this.isIncome,
          //   date: date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date
          //     .getMonth() + 1)) + '.' + date.getFullYear()
          // }
          // if(this.type === 'repayment'){
          //   let cost = 0
          //   this.inputs.map(item => cost += item.value)
          //   obj.title = 'Погашение кредита'
          //   obj.repayments = this.inputs
          //   obj.cost = cost
          // } else {
          //   obj.title = this.title
          //   if(this.type === 'salary' && this.title === ''){
          //     obj.title = 'Зарплата'
          //   }
          //   obj.cost = this.value
          // }
          // res.data.expenses.push(obj)
          // this.$emit('add', {obj, isIncome: this.isIncome})
          // let params = {
          //   id: this.userId,
          //   revenue: this.revenues.revenue + item.cost,
          //   expenses: json.stringify(this.revenues.expenses)
          // }
          // this.axios.put(URL + 'revenues/' + this.userId, {
          //   "revenue": !this.isIncome ? res.data.revenue - obj.cost : res.data.revenue + obj.cost,
          //   "expenses": res.data.expenses
          // })
          // this.title = this.value = ""
          // this.close()
        // })
        let date = new Date()
        obj = {
          type: this.type,
          isIncome: this.isIncome,
          date: date.getDate() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date
            .getMonth() + 1)) + '.' + date.getFullYear()
        }
        if(this.type === 'repayment'){
          let cost = 0
          this.inputs.map(item => cost += item.value)
          obj.title = 'Погашение кредита'
          obj.repayments = this.inputs
          obj.cost = cost
        } else {
          obj.title = this.title
          if(this.type === 'salary' && this.title === ''){
            obj.title = 'Зарплата'
          }
          obj.cost = this.value
        }
        
        this.$emit('add', {obj, isIncome: this.isIncome})
        
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