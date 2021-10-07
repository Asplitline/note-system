import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Page from '@/page'
// import moduleName from 'module';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/note',
    meta: {
      title: '内容管理', icon: 'el-icon-s-management'
    },
    children: [
      {
        path: 'note',
        name: 'Note',
        component: () => import('@/views/content/note'),
        meta: { title: '笔记列表', icon: 'dashboard', actvieMenu: '/content/note' }
      },
      {
        hidden: true,
        path: 'noteDetail/:id?',
        name: 'NoteDetail',
        component: () => import('@/views/content/note/notePage'),
        props: true,
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/content/category'),
        meta: { title: '分类列表', icon: 'dashboard', actvieMenu: '/content/category' }
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('@/views/content/tag'),
        meta: { title: '标签列表', icon: 'dashboard', actvieMenu: '/content/tag' }
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/content/file'),
        meta: { title: '文件列表', icon: 'dashboard', actvieMenu: '/content/file' }
      },

    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    meta: {
      title: '用户管理', icon: 'el-icon-s-management'
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/user'),
        meta: { title: '用户列表', icon: 'dashboard', actvieMenu: '/user/user' }
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/user/comment'),
        meta: { title: '评论管理', icon: 'dashboard', actvieMenu: '/user/comment' }
      },
      {
        path: 'reply',
        name: 'Reply',
        component: () => import('@/views/user/reply'),
        meta: { title: '回复管理', icon: 'dashboard', actvieMenu: '/user/reply' }
      },
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/config',
    meta: {
      title: '系统管理', icon: 'el-icon-s-management'
    },
    children: [
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/setting/config'),
        meta: { title: '系统配置', icon: 'dashboard', actvieMenu: '/setting/config' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/setting/log'),
        meta: { title: '系统日志', icon: 'dashboard', actvieMenu: '/setting/log' }
      },
      {
        path: 'oss',
        name: 'Oss',
        component: () => import('@/views/setting/oss'),
        meta: { title: '阿里云OSS', icon: 'dashboard', actvieMenu: '/setting/oss' }
      },
    ]
  },
  {
    path: '/page',
    component: Page,
    hidden: true,
    hasPage: true,
    children: [
      {
        path: 'index',
        name: 'pIndex',
        component: () => import('@/page/index/index.vue'),
        meta: { title: '首页', icon: 'dashboard', actvieMenu: '/page/index', page: true }
      },
      {
        path: 'list',
        name: 'pList',
        component: () => import('@/page/list'),
        meta: { title: '分类', icon: 'dashboard', actvieMenu: '/page/list', page: true }
      },
      {
        path: 'tag',
        name: 'pTag',
        component: () => import('@/page/tag'),
        meta: { title: '标签', icon: 'dashboard', actvieMenu: '/page/tag', page: true }
      },
      {
        path: 'music',
        name: 'pMusic',
        component: () => import('@/page/music'),
        meta: { title: '音乐盒', icon: 'dashboard', actvieMenu: '/page/music', page: true }
      },
      {
        path: 'article/:id',
        name: 'pArticle',
        component: () => import('@/page/article'),
        meta: { page: true }
      },
      {
        path: 'search/:id',
        name: 'pSearch',
        component: () => import('@/page/search'),
        meta: { page: true }
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '/test', component: () => import('@/views/test') },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
