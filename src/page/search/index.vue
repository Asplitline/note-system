<template>
  <div class="plist">
    <el-row :gutter="60" class="w">
      <el-col :span="18" class="list">
        <postList :list="list" @handle="gotoDetail" />
      </el-col>
      <el-col :span="6">
        <Asider />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Asider from '@/page/components/asider.vue'
import { API, getPageList } from '@/api'
import { aMixin } from '@/mixin'
import postList from '@/page/components/postList.vue'
import { mapMutations } from 'vuex'
import * as types from '@/store/mutation_types'
export default {
  components: {
    Asider,
    postList
  },
  mixins: [aMixin],
  props: ['id'],
  data() {
    return {
      list: []
    }
  },
  watch: {
    id(val) {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapMutations('post', [types.SET_CURRENT_POST]),
    async getList() {
      console.log(this.id)
      const { list } = await getPageList(API.NOTE, { keyword: this.id })
      this.list = list
    },
    gotoDetail(i) {
      this[types.SET_CURRENT_POST](i)
      this.$router.push({ name: 'pArticle', params: { id: i.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.plist {
  @include base_layout;
  /* .list  */
  .aside {
    height: 100%;
    /* background-color: #fff; */
  }
}
</style>
