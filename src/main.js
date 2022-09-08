import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import Vue3Autocounter from 'vue3-autocounter';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import VueApexCharts from "vue3-apexcharts";

createApp(App).directive('click-outside', {
  mounted(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
}).use(VueAxios, axios).use(VueApexCharts).component('vue3-autocounter', Vue3Autocounter).component('treeselect', Treeselect).component('Datepicker', Datepicker).mount('#app')
