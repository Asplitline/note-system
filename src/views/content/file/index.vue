<template>
  <el-card class="tag">
    <TableHeader v-model="query.keyword" @add="handleAdd" @search="getList" @clear="getList" />

    <el-pagination
      class="t-pagination"
      :current-page.sync="query.page"
      :page-size="query.size"
      layout="prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange($event, getList)"
    />

    <!-- 分类处理 -->
    <el-dialog
      key="tagForm"
      :title="isEdit ? '修改' : '添加' + '标签'"
      width="30%"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="t-dialog"
      @close="resetForm('tagForm')"
    >
      <el-form ref="tagForm" :model="tagForm" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="标签描述" prop="description">
          <el-input v-model="tagForm.description" type="textarea" autocomplete="off" resize="none" :autosize="{ minRows: 3, maxRows: 4 }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-btns">
        <el-button type="info" class="t-btn" @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="success" class="t-btn" @click="submitForm('tagForm')">
          {{ isEdit ? '修 改' : '添 加' }}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { insertOne, editOne, deleteOne, getPageList, API } from '@/api'

import { hashID, deepClone } from '@/utils'
import { aMixin } from '@/mixin'

export default {
  mixins: [aMixin],
  data() {
    return {
      key: '',
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      tagForm: {},
      rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
      },
      isEdit: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.isEdit = false
      this.dialogFormVisible = true
      this.tagForm = {}
    },
    async getList() {
      this.listLoading = true
      const { total, list } = await getPageList(API.TAG, this.query)
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
          const { success, message } = await deleteOne(API.TAG, { id })
          this.$message[success ? 'success' : 'error'](message)
          this.getList()
        })
        .catch(() => {})
    },
    editById(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.tagForm = deepClone(row)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        console.log(this[formName])
        console.log(this.isEdit)
        if (this.isEdit === false) {
          const { success, message } = await insertOne(API.TAG, {
            ...this[formName],
            id: hashID()
          })
          this.dialogFormVisible = false
          success && this.getList()
        } else {
          const { success, message } = await editOne(API.TAG, {
            ...this[formName]
          })
          this.dialogFormVisible = false
          success && this.getList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  /* background-color: #000; */
}
</style>
