import Vue from 'vue'
import App from './App.vue'
import jQuery from 'jquery';
window.$ = jQuery;
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faCog } from '@fortawesome/free-solid-svg-icons'

library.add(faCog);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
