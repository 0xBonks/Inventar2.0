import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faBox, 
  faExclamationCircle, 
  faDollarSign, 
  faShoppingCart,
  faBoxOpen,
  faEye,
  faEyeSlash,
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faArrowUp,
  faArrowDown,
  faMinus,
  faExclamationTriangle,
  faWarehouse,
  faSearch,
  faSync,
  faChartBar,
  faDownload,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import Bootstrap styles
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Import common styles
import './assets/styles/common.scss'

// Add Font Awesome icons
library.add(
  faBox, 
  faExclamationCircle, 
  faDollarSign, 
  faShoppingCart,
  faBoxOpen,
  faEye,
  faEyeSlash,
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faArrowUp,
  faArrowDown,
  faMinus,
  faExclamationTriangle,
  faWarehouse,
  faSearch,
  faSync,
  faChartBar,
  faDownload,
  faSignOutAlt
)

// Register Font Awesome component
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)
Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 