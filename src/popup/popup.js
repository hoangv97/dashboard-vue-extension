import Vue from 'vue'
import App from './App'
import helpers from './lib/helper'

const plugin = {
    install () {
      Vue.helpers = helpers
      Vue.prototype.$helpers = helpers
    }
}
Vue.use(plugin)

new Vue({
    el: '#app',
    render: h => h(App)
})