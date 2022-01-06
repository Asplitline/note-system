<template>
	<div class="my-note">
		<Card title="收藏文章">
			<template v-if="notEmpty(list)">

				<div class="box" v-for="i in list" :key="i.id">
					<div class="note-brief">
						<h3 @click="gotoDetail(i)">{{i.title}}</h3>
						<p>{{i.title}}</p>
						<div class="other" v-if="notEmpty(i)">
							<span class="fa fa-star" @click="handleStar(i)">已收藏</span>
							<span class="fa fa-user"
								v-if="notEmpty(i.author)">{{i.author.userName}}</span>
							<span class=" fa fa-eye">浏览({{i.view || 0}})</span>
							<span class="fa fa-commenting-o">评论({{i.replyNum || 0}})</span>
							<span class="fa fa-thumbs-o-up">点赞({{i.likeNum || 0}})</span>
						</div>
					</div>
					<div class="cover-box">
						<img :src="file_url(i.coverImage)" alt=""
							onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
					</div>
				</div>
			</template>
			<myEmpty v-else></myEmpty>
		</Card>
	</div>
</template>

<script>
import Card from './card.vue'
import { API, starNoteList, deleteOne } from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutation_types'
import { notEmpty, file_url, handleMsg } from '@/utils'
export default {
	props: ['user', 'userlist'],
	components: {
		Card
	},
	data() {
		return {
			list: []
		}
	},
	computed: {
		...mapGetters([`user/${types.GET_USER}`])
	},
	methods: {
		notEmpty,
		file_url,
		...mapMutations('post', [types.SET_CURRENT_POST]),
		findUserById(id) {
			return this[`user/${types.GET_USER}`](id)
		},
		async getList() {
			const { data } = await starNoteList({ id: this.user.id, type: 1 })
			this.list = data.map((i) => {
				const pwd = Object.entries(i)
				const [key, value] = pwd[0]
				const author = this.findUserById(i.id)
				return { ...value, key, author }
			})
		},
		gotoDetail(i) {
			this.$router.push({ name: 'pArticle', params: { id: i.id } })
			this[types.SET_CURRENT_POST](i)
		},
		async handleStar(i) {
			const { success, message } = await deleteOne(API.FOCUSON, { id: i.key })
			handleMsg(success, message, () => {
				this.getList()
			})
		}
	},
	mounted() {
		this.getList()
	}
}
</script>

<style lang="scss" scoped>
.my-note {
	::v-deep.card-content {
		align-items: center;
		flex-direction: column;
	}
	.box {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.note-brief {
		flex: 1;
		h3 {
			color: #666;
			font-size: 18px;
			&:hover {
				cursor: pointer;
				text-decoration: underline;
			}
		}
		p {
			font-size: 13px;
			line-height: 24px;
			color: #333;
		}
		.other {
			span {
				font-size: 13px;
				color: #888;
				margin-right: 12px;
			}
			.fa-star {
				color: $main-red-dark;
				&:hover {
					cursor: pointer;
				}
			}
		}
	}
	.cover-box {
		display: flex;
		height: 100px;
		width: auto;
		overflow: hidden;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>