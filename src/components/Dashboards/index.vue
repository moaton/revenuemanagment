<template>
  <div>
    <div style="margin-left:50px">
      <treeselect v-model="take" :options="options" :clearable="false" :searchable="false" />
    </div>
    <div v-if="!loading">
      <apexchart
        type="bar"
        :options="getChartOptions"
        :series="getChartSeries"
        :key="getChartSeries"
        :height="350"
      ></apexchart>
      <apexchart
        type="area"
        :options="getChartOptions"
        :series="getChartSeries"
        :key="getChartSeries"
        :height="350"
      ></apexchart>
    </div>
    <div v-else>
      <apexchart
        type="bar"
        :options="fakeChartOptions"
        :series="fakeSeries"
        :height="350"
      ></apexchart>
      <apexchart
        type="area"
        :options="fakeChartOptions"
        :series="fakeSeries"
        :height="350"
      ></apexchart>
    </div>
  </div>
</template>

<script>
const URL = 'http://195.49.212.34:8080/api'
// const URL = 'http://localhost:8080/api'
  export default {
    data() {
      return {
        loading: true,
        fakeChartOptions: {
          chart: {
            id: "fake",
          },
          xaxis: {
            categories: [1, 2, 3, 4],
          },
        },
        fakeSeries: [
          {
            name: "fake",
            data: [0, 0, 0, 0],
          },
        ],
        chartOptions: {
          chart: {
            id: "vuechart-example",
            height: 600
          },
          xaxis: {
            categories: [1, 2, 3, 4],
          },
        },
        series: [
          {
            name: 'Cost',
            data: [0, 0, 0, 0],
          },
        ],
        take: 'six_month',
        options: [
          {id: 'day', label: 'День'},
          {id: 'week', label: '7 дней'},
          {id: 'month', label: '30 дней'},
          {id: 'three_month', label: '60 дней'},
          {id: 'six_month', label: 'Пол года'},
          {id: 'year', label: 'Год'},
        ],
        userId: parseInt(localStorage.getItem('userId')),
        itemsOptions: [
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
          {id: 'otherFrom', label: 'Другое'},
          {id: 'depositFrom', label: 'Снятия с депозита'},
          {id: 'debtFrom', label: 'Возвращение долга'},
          {id: 'salary', label: 'Зарплата'},
          {id: 'giftFrom', label: 'Подарок'},
        ]
      }
    },
    watch: {
      take(){
        this.getChartData()
      }
    },
    computed: {
      getChartOptions(){
        return this.chartOptions
      },
      getChartSeries(){
        return this.series
      }
    },
    async mounted() {
      await this.getChartData()
    },
    methods: {
      check(){
        console.log('check');
      },
      async getChartData(){
        this.loading = true
        await this.axios.get(`${URL}/revenues/chart-data/${this.userId}?take=${this.take}`).then(res => {
          let categories = []
          res.data.categories.map(item => {
            categories.push(this.itemsOptions.find(fItem => fItem.id === item).label)
          })
          this.chartOptions.xaxis.categories = [...categories]
          this.series[0].data = [...res.data.series]
          this.loading = false
        })
      }
    },
  }
</script>

<style lang="scss">
</style>