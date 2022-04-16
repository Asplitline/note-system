<template>
  <el-card class="note">
    <TableHeader v-model="query.keyword" :show-left="false" @add="handleAdd" @search="getList" @clear="getList" />
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      tooltip-effect="dark"
      style="width: 100%"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="封面图" min-width="95">
        <template v-slot="{ row }">
          <el-avatar v-if="row.coverImage" shape="square" :size="80" :src="_url(row.coverImage)" />
          <el-avatar v-else shape="square" :size="80" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" min-width="120">
        <template v-slot="{ row }">
          <div class="t-ellipsis">
            {{ row.title }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="笔记分类" min-width="95">
        <template v-slot="{ row }">
          <el-tag type="warning">
            {{ getName(row.lx) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标记类型" min-width="95">
        <template v-slot="{ row }">
          <el-tag :type="['danger', 'primary', 'success'][row.type]" effect="dark">
            {{ findStateById(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="回复数量" min-width="95">
        <template v-slot="{ row }">
          {{ row.replyNum || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="点赞数量" min-width="95">
        <template v-slot="{ row }">
          {{ row.likeNum || 0 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="120">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100">
        <template v-slot="{ row }">
          <div class="t-btns">
            <el-button class="t-btn" type="success" icon="el-icon-edit" @click="editById(row)" />
            <el-button slot="reference" class="t-btn" type="danger" icon="el-icon-delete" @click="deleteById(row.id)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="t-pagination"
      :current-page.sync="query.page"
      :page-size="query.size"
      layout="prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange($event, getList)"
    />
  </el-card>
</template>

<script>
import { insertOne, editOne, deleteOne, getAllList, getPageList, API } from '@/api'
import { aMixin } from '@/mixin'
import { POST_STATE } from '@/utils/global'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import * as type from '@/store/mutation_types'
export default {
  mixins: [aMixin],
  data() {
    return {
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      form: {}
    }
  },
  computed: {
    ...mapGetters('post', [type.GET_TYPE])
  },
  methods: {
    ...mapActions('post', [type.FETCH_TYPE]),
    ...mapMutations('post', [type.SET_CURRENT_POST]),
    getName(id) {
      return this[type.GET_TYPE](id)?.name ?? 'unkonw'
    },
    findStateById(type) {
      return POST_STATE.find((i) => i.type === type)?.text ?? 'unkown'
    },
    async getList() {
      this.listLoading = true
      const { total, list } = await getPageList(API.NOTE, this.query)
      this.listLoading = false
      this.total = total
      this.list = list
    },
    async deleteById(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(async () => {
          const { success, message } = await deleteOne(API.NOTE, { id })
          this.$message[success ? 'success' : 'error'](message)
          this.getList()
        })
        .catch(() => {})
    },
    editById(row) {
      this.SET_CURRENT_POST(row)
      this.$router.push({ name: 'NoteDetail', params: { id: row.id } })
    },
    handleAdd() {
      this.$router.push({ name: 'NoteDetail' })
    }
  },
  mounted() {
    this[type.FETCH_TYPE]()
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.note {
  /* background-color: #000; */
}
</style>
