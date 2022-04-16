<template>
  <el-card class="category">
    <TableHeader v-model="query.keyword" @add="handleAdd" @search="getList" @clear="getList" />
    <el-table
      v-loading="listLoading"
      :data="fliterList"
      element-loading-text="Loading"
      border
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column align="center" label="分类名称" min-width="95">
        <template v-slot="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类描述" min-width="95">
        <template v-slot="{ row }">
          <div class="t-ellipsis">
            {{ row.description }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类图标" min-width="95">
        <template v-slot="{ row }">
          <i v-if="row.icon" :class="'fa fa-2x ' + row.icon" />
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类状态" min-width="95">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.available"
            active-text="开启"
            inactive-text="关闭"
            :active-value="1"
            :inactive-value="0"
            @change="modifyState($event, row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="95">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="t-btns" label="操作" min-width="95">
        <template v-slot="{ row }">
          <!-- {{ scope.$index }} -->
          <el-button class="t-btn" type="success" icon="el-icon-edit" @click="editById(row)" />

          <el-button slot="reference" class="t-btn" type="danger" icon="el-icon-delete" @click="deleteById(row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="handleSizeChange"
			@current-change="handleCurrentChange($event,getList)" class="t-pagination"
			:current-page.sync="query.page" :page-size="query.size"
			layout="prev, pager, next, jumper" :total="total">
		</el-pagination> -->

    <!-- 分类处理 -->
    <el-dialog
      :key="isEdit ? 'edit' : 'add' + 'categoryForm'"
      :title="isEdit ? '修改' : '添加' + '分类'"
      width="30%"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      class="t-dialog"
      @close="resetForm('categoryForm')"
    >
      <el-form ref="categoryForm" :model="categoryForm" :rules="rules" label-width="80px">
        <el-form-item label="父级分类" prop="pid">
          <!-- <el-input v-model="categoryForm.name" autocomplete="off"></el-input>
					 -->
          <el-select v-model="categoryForm.pid" placeholder="选择父级分类" clearable>
            <el-option v-for="item in fliterList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            autocomplete="off"
            resize="none"
            :autosize="{ minRows: 3, maxRows: 4 }"
          />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-input v-model="categoryForm.icon" autocomplete="off">
            <i slot="suffix" :class="'fa fa-2x ' + categoryForm.icon" />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-btns">
        <el-button type="info" class="t-btn" @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="success" class="t-btn" @click="submitForm('categoryForm')">
          {{ isEdit ? '修 改' : '添 加' }}
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { insertOne, editOne, deleteOne, getAllList, API } from '@/api'
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
      categoryForm: {},
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入分类图标', trigger: 'blur' }]
      },
      isEdit: false
    }
  },
  computed: {
    fliterList() {
      const parent = this.list.filter((i) => i.pid === null)
      const all = parent.map((i) => {
        const children = this.list.filter((j) => j.pid === i.id)
        return {
          ...i,
          // hasChildren: children.length !== 0,
          children
        }
      })
      return all
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.isEdit = false
      this.dialogFormVisible = true
      this.categoryForm = {}
    },
    async getList() {
      this.listLoading = true
      const { data } = await getAllList(API.NOTE_TYPE)
      console.log(data)
      this.listLoading = false
      this.list = data
    },
    async deleteById(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(async () => {
          const { success, message } = await deleteOne(API.NOTE_TYPE, {
            id
          })
          this.$message[success ? 'success' : 'error'](message)
          this.getList()
        })
        .catch(() => {})
    },
    async modifyState(available, { id }) {
      const { success, message } = await editOne(API.NOTE_TYPE, {
        id,
        available
      })
      this.$message[success ? 'success' : 'error'](message)
      this.getList()
    },
    editById(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.categoryForm = deepClone(row)
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
          const { success, message } = await insertOne(API.NOTE_TYPE, {
            ...this[formName],
            id: hashID()
          })
          this.dialogFormVisible = false
          success && this.getList()
        } else {
          const { success, message } = await editOne(API.NOTE_TYPE, {
            // id: hashID(),
            ...this[formName]
          })
          this.dialogFormVisible = false
          success && this.getList()
        }

        // console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  /* background-color: #000; */
}
</style>
