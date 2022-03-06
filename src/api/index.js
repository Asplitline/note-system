import request from '@/utils/request'
// 
// /apiStatistical/statisticalTags
// /apiStatistical/statistical
// /apiStatistical/notesTopTen
// /apiStatistical/newNotes
// /apiStatistical/newComment
export const API = {
  LOG: 'apiLogs',
  REPLY: 'apiReply',
  TAG: 'apiNoteTags',
  TAG_OPERATE: 'apiNotesTagsOperate',
  NOTE: 'apiNotes',
  LOG: 'apiLogs',
  CONFIG: 'apiSysConfig',
  USER: 'apiUser',
  NOTE_TYPE: 'apiNoteType',
  COMMENT: 'apiComment',
  STATISTICAL: 'apiStatistical',
  FOCUSON: 'apiFocusOn'
}
export const API_OTHER = {
  STATISTICAL_TAGS: 'statisticalTags',
  STATISTICAL_NOTES: 'statisticalNotes  ',
  STATISTICAL: 'statistical',
  NOTES_TOP_TEN: 'notesTopTen',
  NEW_NOTES: 'newNotes',
  NEW_COMMENT: 'newComment',
}
/*
  common
*/
export function getAllList (path) {
  return request({
    url: `/${path}/list`,
    method: 'get'
  })
}
export function getPageList (path, params) {
  return request({
    url: `/${path}/pageList`,
    method: 'get',
    params
  })
}
export function getById (path, params) {
  return request({
    url: `/${path}/getById`,
    method: 'get',
    params
  })
}
export function insertOne (path, data) {
  return request({
    url: `/${path}/insert`,
    method: 'post',
    data
  })
}
export function editOne (path, data) {
  return request({
    url: `/${path}/update`,
    method: 'put',
    data
  })
}
export function deleteOne (path, params) {
  return request({
    url: `/${path}/delete`,
    method: 'delete',
    params
  })
}
/*
  user 
 */
export function getUserById (params) {
  return request({
    url: `/apiUser/getById`,
    method: 'get',
    params
  })
}
export function getUser (path, params) {
  return request({
    url: `/${path}/pageUser`,
    method: 'get',
    params
  })
}

export function editUser (data) {
  console.log(data);
  return request({
    url: `/apiUser/updateIgnoreNull`,
    method: 'put',
    data
  })
}

export function changePassword (params) {
  return request({
    url: '/apiUser/changePassword',
    method: 'get',
    params
  })
}

export function login (data) {
  return request({
    url: '/apiUser/api/login' + data,
    method: 'post',
  })
}
export function logout (params) {
  return request({
    url: '/apiUser/logout',
    method: 'get',
    params
  })
}

export function register (data) {
  return request({
    url: '/apiUser/login',
    method: 'post',
    data
  })
}
/**
 * tag
 */

export function getTagById (params) {
  return request({
    url: '/apiNotes/getListByTags',
    method: 'get',
    params
  })
}

/**
 * static
 */
export function getOther (path, params) {
  return request({
    url: `/${API.STATISTICAL}/${path}`,
    method: 'get',
    params
  })
}

/*
 * other 
 */
export function uploadFile (data) {
  return request({
    url: `/file/uploadFile`,
    method: 'post',
    data
  })
}
export function alipay (data) {
  return request({
    url: `/alipay/alipay`,
    method: 'post',
    data
  })
}
export function notesLike (params) {
  return request({
    url: `/apiNotes/notesLike`,
    method: 'get',
    params
  })
}
export function commentLike (params) {
  return request({
    url: `/apiComment/commentLike`,
    method: 'get',
    params
  })
}

/**
 * star
 */

// export function likeNote (params) {
//   return request({
//     url: `/apiNotes/notesLike`,
//     method: 'get',
//     params
//   })
// }


export function starNoteList (params) {
  return request({
    url: `/apiUser/findNotesById`,
    method: 'get',
    params
  })
}
export function starUserList (params) {
  return request({
    url: `/apiUser/findFocusId`,
    method: 'get',
    params
  })
}

/**
 *  apply
 */
export function applyAllList () {
  return request({
    url: `/apiUserVip/list`,
    method: 'get',
  })
}

export function applyList (params) {
  return request({
    url: `/apiUserVip/pageList`,
    method: 'get',
    params
  })
}

export function addApply (data) {
  return request({
    url: `/apiUserVip/insert`,
    method: 'post',
    data
  })
}
export function editApply (data) {
  return request({
    url: `/apiUserVip/update`,
    method: 'put',
    data
  })
}
export function deleteApply (params) {
  return request({
    url: `/apiUserVip/delete`,
    method: 'delete',
    params
  })
}


/**
 * comment
 */
export function getComment (params) {
  return request({
    url: `/apiComment/getCommentByNotesId`,
    method: 'get',
    params
  })
}

export function addViews (params) {
  return request({
    url: `/apiNotes/addViews`,
    method: 'get',
    params
  })
}


export function getListByType (params) {
  return request({
    url: `/apiNotes/selectNotesBylxAndType`,
    method: 'get',
    params
  })
}