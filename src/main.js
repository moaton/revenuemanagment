import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import Vue3Autocounter from 'vue3-autocounter';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

createApp(App).use(VueAxios, axios).component('vue3-autocounter', Vue3Autocounter).component('treeselect', Treeselect).component('Datepicker', Datepicker).mount('#app')
