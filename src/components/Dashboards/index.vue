<template>
  <div class="">
    <div>
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
      <apexchart
        type="area"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chartOptions: {
          chart: {
            id: "vuechart-example",
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994],
          },
        },
        series: [
          {
            name: "series-1",
            data: [30, 40, 35, 50],
          },
        ],
      }
    },
    computed: {
    },
    async mounted() {
    },
    methods: {

    },
  }
</script>

<style lang="scss">
</style>