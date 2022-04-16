<template>
  <el-card class="tag">
    <TableHeader v-model="query.keyword" :show-left="false" @search="getList" @clear="getList" />
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border style="width: 100%" fit highlight-current-row>
      <el-table-column align="center" label="键" min-width="95">
        <template v-slot="{ row }">
          {{ row.configKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="值" min-width="95">
        <template v-slot="{ row }">
          <div class="t-ellipsis">
            {{ row.configValue }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="95">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新事件" min-width="95">
        <template v-slot="{ row }">
          {{ row.updateTime | formatDate }}
        </template>
      </el-table-column>
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
import { deleteOne, getPageList, API } from '@/api'
import { aMixin } from '@/mixin'

export default {
  mixins: [aMixin],
  data() {
    return {
      key: '',
      list: [],
      listLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { total, list } = await getPageList(API.CONFIG, this.query)
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
          const { success, message } = await deleteOne(API.CONFIG, { id })
          this.$message[success ? 'success' : 'error'](message)
          this.getList()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  /* background-color: #000; */
}
</style>
