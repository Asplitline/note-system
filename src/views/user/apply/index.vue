<template>
	<el-card class="tag">
		<!-- <TableHeader @add="handleAdd" v-model="query.keyword" @search="getList"
			@clear="getList" /> -->
		<el-table v-loading=" listLoading" :data="list" element-loading-text="Loading" border
			style="width: 100%" fit highlight-current-row>

			<el-table-column align="center" label="申请用户" min-width="95">
				<template v-slot={row}>
					{{row.user && row.user.userName}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="申请用户" min-width="95">
				<template v-slot={row}>
					<el-tag :type="APPLY_STATE_RE[row.status].type">
						{{APPLY_STATE_RE[row.status].text}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="申请时间" min-width="95">
				<template v-slot={row}>
					{{row.createTime | formatDate}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="处理时间" min-width="95">
				<template v-slot={row}>
					{{row.createTime | formatDate}}
				</template>
			</el-table-column>

			<el-table-column align="center" class-name="t-btns" label="操作" min-width="140">
				<template v-slot={row}>
					<el-link class="t-btn" type="success" icon="el-icon-check"
						:disabled="row.status != 0" @click="handleApply(row,1)">
						同意申请
					</el-link>
					<el-link class="t-btn" type="info" icon="el-icon-close"
						:disabled="row.status != 0" @click="handleApply(row,1)">
						拒绝申请
					</el-link>
					<el-link slot="reference" class="t-btn" type="danger" icon="el-icon-delete"
						@click="deleteById(row.id)">
						删除记录
					</el-link>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange"
			@current-change="handleCurrentChange($event,getList)" class="t-pagination"
			:current-page.sync="query.page" :page-size="query.size"
			layout="prev, pager, next, jumper" :total="total">
		</el-pagination>

	</el-card>
</template>

<script>
import { editUser, editApply, deleteApply, applyList } from '@/api'
import { USER_STATE, APPLY_STATE_RE } from '@/utils/global'
import { aMixin } from '@/mixin'
import * as type from '@/store/mutation_types'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	data() {
		return {
			USER_STATE,
			key: '',
			list: [],
			listLoading: false,
			APPLY_STATE_RE
		}
	},
	mixins: [aMixin],
	mounted() {
		this[type.FETCH_USER]()
		this.getList()
	},
	computed: {
		...mapGetters('user', [type.GET_USER])
	},
	methods: {
		...mapActions('user', [type.FETCH_USER]),
		async getList() {
			this.listLoading = true
			const { total, list } = await applyList(this.query)
			this.total = total
			this.list = list.map((i) => {
				const user = this[type.GET_USER](i.userId)
				return { ...i, user }
			})
			console.log(this.list)
			this.listLoading = false
		},
		async deleteById(id) {
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'error'
			})
				.then(async () => {
					const { success, message } = await deleteApply({ id })
					this.$message[success ? 'success' : 'error'](message)
					this.getList()
				})
				.catch(() => {})
		},
		async handleApply(row, status) {
			const { success, message } = await editApply({
				id: row.id,
				status,
				updateTime: Date.now()
			})
			await editUser({
				id: row.userId,
				state: 2
			})
			if (success) {
				this.getList()
			}
			this.$message[success ? 'success' : 'error'](message)
		},
		async handleChange(evt, v) {
			const { success, message } = await editUser({
				...v,
				state: evt,
				updateTime: Date.now()
			})
			message && this.$message[success ? 'success' : 'error'](message)
		}
	}
}
</script>

<style lang="scss" scoped>
.tag {
	/* background-color: #000; */
}
.t-btns {
	.t-btn {
		margin-right: 10px;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>	