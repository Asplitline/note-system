const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.currenUser?.fileUrl,
  currentUser: state => state.user.currentUser,
  userlist: state => state.user?.userlist,
  name: state => state.user.currentUser?.userName,
  userId: state => state.user.currentUser?.id,
  types: state => state.post.types,
  records: state => state.post.records,
  tags: state => state.post.tags,
  currentPost: state => state.post.currentPost,
  role: state => state.currenUser?.state,
}
export default getters
