import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
require('@/assets/main.scss');

Vue.config.productionTip = false
Vue.use(vuetify)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.use(VueAxios, axios);