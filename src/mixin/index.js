export const aMixin = {
  data() {
    return {
      query: {
        size: 10,
        page: 1,
        keyword: ''
      },
      total: 10
    }
  },
  methods: {
    handleSizeChange(e) {
      console.log(e)
    },
    handleCurrentChange(e, callback) {
      // console.log(e)
      this.query.page = e
      callback && callback()
    },
    test(val) {
      console.log('val :>> ', val)
    },
    back() {
      // return
      console.log(window.history)
      return window.history.length > 1 ? this.$router.go(-1) : this.$router.replace('/')
    },
    _url(path) {
      return this.IMG_URL + path
    }
  }
}
