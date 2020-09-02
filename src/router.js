import Vue from "vue"
import Router from "vue-router"
// 登录页面组件
import Login from "./components/login/Login.vue"
// 主页页面组件
import Home from "./components/home/Home.vue"
import Welcome from "./components/home/Welcome.vue"
import Users from "./components/home/user/Users.vue"
import Rights from "./components/home/power/Rights.vue"
import Roles from "./components/home/power/Roles.vue"
import Cate from "./components/home/goods/Cate.vue"
import Params from "./components/home/goods/Params.vue"
import List from "./components/home/goods/List.vue"
import Add from "./components/home/goods/Add.vue"
import Order from "./components/home/order/Order.vue"

Vue.use(Router)

const router = new Router({
    routes:[
        {path:"/",redirect:"/login"},
        {path:"/login",component: Login},
        {path:"/home",component: Home,
         redirect:"/welcome",
         children:[
             {path:"/welcome",component: Welcome},
             {path:"/users",component: Users},
             {path:"/rights",component: Rights},
             {path:"/roles",component: Roles},
             {path:"/categories",component: Cate},
             {path:"/params",component: Params},
             {path:"/goods",component: List},
             {path:"/goods/add",component: Add},
             {path:"/orders",component: Order}
         ]
        }
    ],
    mode: 'history',
    base: process.env.BASE_URL
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) =>{
    //to将要访问的路径，from代表从哪个路径跳转而来
    // next()放行    next("/login")强制跳转到哪个路径
    if(to.path === "/login") return next()
    // 获取token值
    const tokenStr = window.sessionStorage.getItem("token")
    if(!tokenStr) return next("/login")
    next()
})

export default router