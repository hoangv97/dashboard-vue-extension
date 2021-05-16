import Vue from 'vue'
import App from './App'
import helpers from './lib/helper'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })

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