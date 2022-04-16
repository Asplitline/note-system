<template>
  <div class="index">
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
import { API, getPageList } from '@/api'
import { aMixin } from '@/mixin'
import { mapMutations } from 'vuex'
import { notEmpty } from '@/utils'
import * as type from '@/store/mutation_types'
import postList from '@/page/components/postList.vue'
export default {
  components: {
    Asider,
    postList
  },
  mixins: [aMixin],
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getList()
  },

  methods: {
    notEmpty,
    ...mapMutations('post', [type.SET_CURRENT_POST]),
    async getList() {
      const { total, list } = await getPageList(API.NOTE, {
        ...this.query,
        type: 2
      })
      this.total = total
      this.list = list
      console.log(this.list)
    },
    gotoDetail(i) {
      this[type.SET_CURRENT_POST](i)
      this.$router.push({ name: 'pArticle', params: { id: i.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  @include base_layout;
  .aside {
    height: 100%;
    /* background-color: #fff; */
  }
}
</style>
