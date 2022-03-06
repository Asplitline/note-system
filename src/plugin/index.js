
import { Message } from 'element-ui';
import hljs from 'highlight.js';
import 'highlight.js/styles/androidstudio.css';
import { IMG_URL, BASE_URL } from '@/utils/global'
import * as utils from '@/utils'
const MyPlugins = {}
MyPlugins.install = function (Vue, options) {
  Vue.prototype.BASE_URL = BASE_URL
  Vue.prototype.IMG_URL = IMG_URL
  Vue.prototype.$message = Message
  Vue.prototype.$utils = utils
  Vue.filter('formatDate', (time, cFormat) => {
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    const date = new Date(time)
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  })
  Vue.filter('toX', (val, dig = 2) => {
    return (val || 0).toFixed(dig)
  })
  Vue.directive('hljs', {
    inserted (el) {
      let blocks = el.querySelectorAll('pre code');
      blocks.forEach((block) => {
        hljs.highlightElement(block)
      })

    }
  });
}
export default MyPlugins