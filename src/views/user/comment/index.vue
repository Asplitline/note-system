<template>
  <el-card class="comment">
    <TableHeader v-model="query.keyword" :show-left="false" @search="getList" @clear="getList" />
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border style="width: 100%" fit highlight-current-row>
      <el-table-column align="center" label="笔记标题" min-width="95">
        <template v-slot="{ row }">
          <div v-if="notEmpty(row.note)" class="t-ellipsis">
            {{ row.note.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论用户" min-width="95">
        <template v-slot="{ row }">
          <div v-if="notEmpty(row.author)" class="t-ellipsis">
            {{ row.author.userName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容" min-width="95">
        <template v-slot="{ row }">
          <div class="t-ellipsis">
            {{ row.content }}
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" "center" label="评论时间" min-width="95">
				<template v-slot={row}>
					{{row.createTime | formatDate}}
				</template>
			</el-table-column> -->
      <el-table-column align="center" class-name="t-btns" label="操作" min-width="95">
        <template v-slot="{ row }">
          <el-button slot="reference" class="t-btn" type="danger" icon="el-icon-delete" @click="deleteById(row.id)" />
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
import { deleteOne, getPageList, getAllList, API } from '@/api'

import { aMixin } from '@/mixin'
import * as types from '@/store/mutation_types'
import { mapActions, mapGetters } from 'vuex'
import { notEmpty } from '@/utils'
export default {
  mixins: [aMixin],
  data() {
    return {
      key: '',
      list: [],
      listLoading: false,
      isEdit: false,
      notelist: []
    }
  },
  async mounted() {
    await this[`user/${types.FETCH_USER}`]()
    await this.getNotes()
    this.getList()
  },
  computed: {
    ...mapGetters([`user/${types.GET_USER}`])
  },
  methods: {
    notEmpty,
    ...mapActions([`user/${types.FETCH_USER}`]),
    async getList() {
      this.listLoading = true
      const { total, list } = await getPageList(API.COMMENT, this.query)
      this.listLoading = false
      this.total = total
      this.list = list.map((i) => {
        const note = this.findNoteById(i.notesId)
        const author = this.findUserById(i.userId)
        return { ...i, author, note }
      })
    },
    async deleteById(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(async () => {
          const { success, message } = await deleteOne(API.COMMENT, { id })
          this.$message[success ? 'success' : 'error'](message)
          this.getList()
        })
        .catch(() => {})
    },
    async getNotes() {
      const { data } = await getAllList(API.NOTE)
      this.notelist = data
    },
    findNoteById(id) {
      return this.notelist.find((i) => i.id === id)
    },
    findUserById(id) {
      return this[`user/${types.GET_USER}`](id)
    }
  }
}
</script>

<style lang="scss" scoped>
.comment {
  /* background-color: #000; */
}
</style>
