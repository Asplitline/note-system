// export const IMG_URL = 'http://120.24.30.105:8001/'
export const IMG_URL = 'http://127.0.0.1:8088/'
export const BASE_URL = 'http://120.24.30.105:8088/'
export const UPLOAD_URL = 'http://127.0.0.1:8088/'
export const POST_STATE = [
  // { type: 0, text: '私密' },
  { type: 1, text: '付费' },
  { type: 2, text: '公开' }
]

export const USER_STATE = [
  { id: 0, text: '用户', type: 'success' },
  { id: 1, text: '管理员', type: 'danger' },
  { id: 2, text: '导师', type: 'primary' }
]
export const USER_STATE_RE = {
  0: { text: '用户', type: 'success' },
  1: { text: '管理员', type: 'danger' },
  2: { text: '导师', type: 'primary' }
}

export const APPLY_STATE_RE = {
  0: { text: '处理中', type: 'primary' },
  1: { text: '通过', type: 'success' },
  2: { text: '失败', type: 'danger' }
}