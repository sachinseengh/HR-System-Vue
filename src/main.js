import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import "vue3-toastify/dist/index.css";
import Vue3Toastify from "vue3-toastify";
import { createPinia } from 'pinia';

import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'




createApp(App)
  .use(router)
  .use(createPinia())
  .component('VueDatePicker', VueDatePicker)
  .component(Vue3Toastify, {
    autoClose: 10000,
    position: "top-right",
  }, 'VueToast')
  .mount('#app')
