import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import Vue3Autocounter from 'vue3-autocounter';

createApp(App).use(VueAxios, axios).component('vue3-autocounter', Vue3Autocounter).component('treeselect', Treeselect).mount('#app')
