import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import {firestorePlugin} from 'vuefire'



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.use(firestorePlugin)
