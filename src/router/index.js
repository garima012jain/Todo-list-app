import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Addtodo from '@/components/Addtodo'
import Index from '@/components/Index'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/add-todo',
      name: 'Addtodo',
      component: Addtodo
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})

/*const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})*/

//export default router
