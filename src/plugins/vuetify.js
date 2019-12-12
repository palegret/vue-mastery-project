import Vue from 'vue'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#002151',
    accent: '#002151',
    error: '#721c24',
    info: '#0c5460',
    success: '#155724',
    warning: '#856404'
  }
})

export default new Vuetify()
