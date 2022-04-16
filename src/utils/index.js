import { Message } from 'element-ui'
import { IMG_URL, BASE_URL } from '@/utils/global'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
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
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
/**
 *
 * @param {object} obj
 * @returns {string}
 */
export function obj2Params(obj) {
  let arr = []
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      arr.push(`${key}=${obj[key]}`)
    }
  }
  return arr.length ? '?' + arr.join('&') : ''
}
/**
 * @param {number} length
 * @returns {string}
 */

export function hashID(length = 32) {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
}
/**
 *
 * @param { any } source
 * @returns any
 */
export function deepClone(source) {
  // const type = Object.prototype.toString.call(source).slice(8, -1).toLocaleLowerCase()
  if (typeof source !== 'object' || source == null) return source
  let res
  if (Array.isArray(source)) {
    res = []
  } else {
    res = {}
  }
  for (const key in source) {
    if (Object.hasOwnProperty.call(source, key)) {
      // const element = object[key];
      res[key] = deepClone(source[key])
    }
  }
  return res
}

export function validatePhone(val) {
  return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(val)
}

export function validateEmail(val) {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(val)
}

export function setVal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getVal(key) {
  const val = localStorage.getItem(key)
  return notEmpty(val) && JSON.parse(val)
}

export function removeVal(key) {
  localStorage.removeItem(key)
}

export function setVals(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

export function getVals(key) {
  // debugger
  const val = sessionStorage.getItem(key)
  return notEmpty(val) && JSON.parse(val)
}

export function removeVals(key) {
  sessionStorage.removeItem(key)
}
export function getToken(key) {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
        '$1'
      )
    ) || null
  )
}

/**
 *
 * @param {any} val
 * @returns {boolean}
 */
export function notEmpty(val) {
  const types = {
    STRING: 'string',
    OBJECT: 'object',
    NULL: 'null',
    UNDEFINED: 'undefined',
    ARRAY: 'array'
  }
  const type = Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLocaleLowerCase()
  switch (type) {
    case types.STRING:
    case types.ARRAY:
      return !!val.length
    case types.NULL:
    case types.UNDEFINED:
      return !!val
    case types.OBJECT:
      return !!Object.keys(val).length
    default:
      // console.log('type :>> ', type);
      // console.log('val :>> ', val);
      return !!val
  }
}

export function handleMsg(success, message, callback) {
  notEmpty(message) && Message[success ? 'success' : 'error'](message)
  success && callback?.()
}

export function file_url(path) {
  return IMG_URL + path
}

export function copy(text) {
  const ipt = document.createElement('input')
  document.body.appendChild(ipt)
  ipt.setAttribute('value', text)
  ipt.select()
  console.log(ipt)
  try {
    // 'document.execCommand' is deprecated
    document.execCommand('copy')
    Message({
      message: '链接复制成功~',
      center: true
    })
  } catch (error) {
    console.log(error)
  } finally {
    document.body.removeChild(ipt)
  }
}
