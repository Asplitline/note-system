import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { notEmpty } from '@/utils'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  const user = store.getters.currentUser
  const isAuth = user.state === 1
  if (notEmpty(user)) {
    console.log(user)
    console.log('to :>> ', to)
    console.log('from :>> ', from)
    // if (user.state === 1) next()
    // else {
    //   if (from.name === 'pIndex') next()
    //   else {
    //     next({ name: 'pIndex' })
    //   }
    // }
    // if(to.meta.page )
    if (!isAuth) {
      if (to.meta.page) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
    NProgress.done()
    // if (to.name === 'login') {
    //   next()
    // } else {
    //   if (user.state !== 1 && from.name !== 'login') {
    //     next({ name: 'pIndex' })
    //     NProgress.done()
    //     console.log(222);
    //   } else if (user.state === 1 && from.name === 'login') {
    //     next({ name: 'Home' })
    //     console.log(333);
    //     NProgress.done()
    //   } else {
    //     next()
    //   }
    // }
  } else {
    if (to.name === 'login') {
      next()
    } else {
      next({ name: 'login' })
    }
    // next({ path: '/login' })
    NProgress.done()
  }
  // return next()
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const isAdmin = store.getters.role === 1
  //     // const hasGetUserInfo = store.getters.name
  //     if (isAdmin) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         // await store.dispatch('user/getInfo')
  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
