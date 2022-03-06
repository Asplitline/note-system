<template>
	<div class="index">
		<el-row :gutter="60" class="w">
			<el-col :span="18" class="list">
				<postList :list="list" @handle="gotoDetail"></postList>
				<el-pagination @size-change="handleSizeChange"
					@current-change="handleCurrentChange($event,getList)" class="t-pagination"
					:current-page.sync="query.page" :page-size="query.size"
					layout="prev, pager, next, jumper" :total="total" v-if="notEmpty(list)">
				</el-pagination>
			</el-col>
			<el-col :span="6">
				<Asider></Asider>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Asider from '@/page/components/asider.vue'
import { API, getPageList } from '@/api'
import { aMixin } from '@/mixin'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { notEmpty } from '@/utils'
import * as type from '@/store/mutation_types'
import postList from '@/page/components/postList.vue'
export default {
	mixins: [aMixin],
	data() {
		return {
			list: []
		}
	},
	components: {
		Asider,
		postList
	},
	mounted() {
		this[type.FETCH_USER]()
		this.getList()
	},
	computed: {
		...mapGetters('user', [type.GET_USER])
	},
	methods: {
		notEmpty,
		...mapMutations('post', [type.SET_CURRENT_POST]),
		...mapActions('user', [type.FETCH_USER]),
		async getList() {
			const { total, list } = await getPageList(API.NOTE, {
				...this.query,
				type: 2
			})
			this.total = total
			this.list = list.map((i) => {
				const user = this[type.GET_USER](i.userId)
				console.log(user)
				return { ...i, user }
			})
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
