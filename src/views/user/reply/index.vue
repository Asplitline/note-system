<template>
	<el-card class="reply">
		<TableHeader v-model="query.keyword" @search="getList" :showLeft="false"
			@clear="getList" />
		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border
			style="width: 100%" fit highlight-current-row>
			<el-table-column align="center" label="文章标题" min-width="95">
				<template v-slot={row}>
					<div class="t-ellipsis" v-if="notEmpty(row.note)">{{row.note.title}}</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="文章作者" min-width="95">
				<template v-slot={row}>
					<div class="t-ellipsis" v-if="notEmpty(row.author)">
						{{row.author.userName }}
					</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="评论用户" min-width="95">
				<template v-slot={row}>
					<div class="t-ellipsis" v-if="notEmpty(row.commentAuthor)">
						{{row.commentAuthor.userName }}</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="回复用户" min-width="95">
				<template v-slot={row}>
					<div class="t-ellipsis" v-if="notEmpty(row.replyAuthor)">
						{{row.replyAuthor.userName }}
					</div>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" "center" label="回复" min-width="95">
				<template v-slot={row}>
					{{row.createTime | formatDate}}
				</template>
			</el-table-column> -->
			<el-table-column align="center" class-name="t-btns" label="操作" min-width="95">
				<template v-slot={row}>
					<el-button slot="reference" class="t-btn" type="danger" icon="el-icon-delete"
						@click="deleteById(row.id)">
					</el-button>
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
import { deleteOne, getPageList, API, getAllList } from '@/api'
import { aMixin } from '@/mixin'
import { mapGetters, mapActions } from 'vuex'
import * as types from '@/store/mutation_types'
import { notEmpty } from '@/utils'

export default {
	data() {
		return {
			key: '',
			list: [{}],
			listLoading: false,
			dialogFormVisible: false,
			isEdit: false,
			notelist: [],
			commentlist: []
		}
	},
	async mounted() {
		await this[`user/${types.FETCH_USER}`]()
		await this.getNotes()
		await this.getComments()
		this.getList()
	},
	mixins: [aMixin],
	computed: { ...mapGetters([`user/${types.GET_USER}`]) },
	methods: {
		notEmpty,
		...mapActions([`user/${types.FETCH_USER}`]),
		async getList() {
			this.listLoading = true
			const { total, list } = await getPageList(API.REPLY, this.query)
			console.log(list)
			this.list = list.map((i) => {
				const author = this.findUserById(i.authorId)
				const replyAuthor = this.findUserById(i.userId)
				const note = this.findNoteById(i.notesId)
				const comment = this.findCommentById(i.commentId)
				const commentAuthor = this.findUserById(comment?.userId)
				return { ...i, author, replyAuthor, note, commentAuthor }
			})
			this.listLoading = false
			this.total = total
		},
		async deleteById(id) {
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'error'
			})
				.then(async () => {
					const { success, message } = await deleteOne(API.REPLY, { id })
					this.$message[success ? 'success' : 'error'](message)
					this.getList()
				})
				.catch(() => {})
		},
		async getNotes() {
			const { data } = await getAllList(API.NOTE)
			this.notelist = data
		},
		async getComments() {
			const { data } = await getAllList(API.COMMENT)
			this.commentlist = data
		},
		findNoteById(id) {
			return this.notelist.find((i) => i.id === id)
		},
		findCommentById(id) {
			console.log(
				this.commentlist.find((i) => {
					console.log(id, i.id, i.id === id)
					return i.id === id
				})
			)
			return this.commentlist.find((i) => i.id === id)
		},
		findUserById(id) {
			return this[`user/${types.GET_USER}`](id)
		}
	}
}
</script>

<style lang="scss" scoped>
.reply {
	/* background-color: #000; */
}
</style>	