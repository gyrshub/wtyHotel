import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import { post, get, loginpost } from 'api/index.js';
import API from 'api/index.js';

// 全局分享
const $x = {}
Vue.prototype.$x = $x;
let share = require('api/share.js');
Vue.mixin(share)

Vue.use(uView)
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$loginpost = loginpost;
Vue.prototype.$API = API
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif