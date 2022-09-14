<template>
  <div class="">
    <div>
      <treeselect v-model="take" :options="options" :clearable="false" :searchable="false" />
    </div>
    <div v-if="!loading">
      <apexchart
        type="bar"
        :options="getChartOptions"
        :series="getChartSeries"
        :key="getChartSeries"
      ></apexchart>
      <apexchart
        type="area"
        :options="getChartOptions"
        :series="getChartSeries"
        :key="getChartSeries"
      ></apexchart>
    </div>
    <div v-else>
      <apexchart
        type="bar"
        :options="fakeChartOptions"
        :series="fakeSeries"
      ></apexchart>
      <apexchart
        type="area"
        :options="fakeChartOptions"
        :series="fakeSeries"
      ></apexchart>
    </div>
    <div class="btn btn-primary" @click="key++">GET</div>
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
          this.chartOptions.xaxis.categories = [...res.data.categories]
          this.series[0].data = [...res.data.series]
          this.loading = false
        })
      }
    },
  }
</script>

<style lang="scss">
</style>