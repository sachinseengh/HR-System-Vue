import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

 
 
import { createPinia } from 'pinia';

import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import VueToastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'





createApp(App)
  .use(router)
  .use(createPinia())
  .component('VueDatePicker', VueDatePicker)
  .mount('#app')
