import Vue from 'vue'
import App from './App.vue'
import router from './router.js'

// 导入element-ui库
import ElementUI from 'element-ui';
// 导入element-ui样式
import 'element-ui/lib/theme-chalk/index.css';

import axios from "axios"
// 配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
//通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config =>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 必须return
  return config
});

// 把axios挂载在Vue原型对象中，组件可以直接this.$http来访问axios
Vue.prototype.$http = axios;

// 导入字体图标
import "./assets/fonts/iconfont.css"
// 导入css样式
import "./assets/css/base.css"

//第三方插件
import TreeTable from "vue-table-with-tree-grid"
//tree-table标签名
Vue.component("tree-table",TreeTable)

//时间过滤器
Vue.filter('dateFormat',function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 +'').padStart(2,'0')
  const d = (dt.getDate() +'').padStart(2,'0')
  const hh = (dt.getHours() +'').padStart(2,'0')
  const mm = (dt.getMinutes() +'').padStart(2,'0')
  const ss = (dt.getSeconds() +'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
