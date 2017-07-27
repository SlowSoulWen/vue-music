import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import {store} from './store/store'

import vAudio from '@/components/audio/audio'
import '@/assets/css/reset.css'
import '@/assets/css/basic.css'
import '@/assets/js/iconfont.js'


Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  mode:'hash',
  routes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: {
    vAudio
  }
})
