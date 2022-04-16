<template>
  <div class="plist">
    <el-row :gutter="60" class="w">
      <el-col :span="18" class="list">
        <postList :list="list" @handle="gotoDetail" />
        <el-pagination
          class="t-pagination"
          v-if="notEmpty(list)"
          :current-page.sync="query.page"
          :page-size="query.size"
          layout="prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange($event, getList)"
        />
      </el-col>
      <el-col :span="6">
        <Asider />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Asider from '@/page/components/asider.vue'
import { API, getPageList, getListByType } from '@/api'
import { aMixin } from '@/mixin'
import { notEmpty } from '@/utils'
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
    id() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    notEmpty,
    ...mapMutations('post', [types.SET_CURRENT_POST]),
    async getList() {
      const { list, total } = await getListByType({
        lx: this.id,
        type: 2,
        ...this.query
      })
      this.list = list
      this.total = total
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
