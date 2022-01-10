<template>
	<div class="asider">
		<myCard title="关于我" icon="fa-user">
			<div class="about">
				<div class="qr-code">
					<img :src="file_url(currentUser.fileUrl)" alt=""
						onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
				</div>
				<div class="author">
					{{currentUser.userName}}
				</div>
				<div class="link">
					<i class="fa fa-weixin"></i>
					<i class="fa fa-qq"></i>
					<i class="fa fa-weibo"></i>
					<i class="fa fa-github"></i>
				</div>
			</div>
		</myCard>
		<myCard title="目录" icon="fa-book" class="toc-card" v-if="notEmpty(toc)">
			<ul class="toc">
				<li class="toc-item" v-for="i in toc" :key="i.id"><a href="javascript:;"
						class="link" @click="anchor(i)">{{i.text}}</a></li>
			</ul>
		</myCard>
		<myCard title="标签云" icon="fa-tag">
			<div class="tag">
				<router-link :to="{name:'pTag',params:{id:i.id}}" v-for="i in tagList" :key="i.id"
					class="tag-link">{{i.name}}
				</router-link>
			</div>
		</myCard>
		<myCard title="近期评论" icon="fa-comment">
			<ul class="comment">
				<li class="comment-item" v-for="i in commentList" :key="i.id">
					<img :src="file_url(i.extend1)" alt="" class="img"
						onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
					<span class="author">{{i.userId}} :</span>
					<span class="text">{{i.content}}</span>
				</li>
			</ul>
		</myCard>
		<myCard title="近期文章" icon="fa-book">
			<ul class="note-list">
				<li class="note-item" v-for="i in noteList" :key="i.id" @click="gotoArticle(i)"><i
						class="fa fa-book"></i>{{i.title}}
				</li>
			</ul>
		</myCard>
		<!-- <myCard title="网站信息" icon="fa-info"></myCard> -->
	</div>
</template>

<script>
import myCard from '@/page/components/myCard.vue'
import { notEmpty, file_url } from '@/utils'
import { API, getAllList, getOther, API_OTHER } from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import * as type from '@/store/mutation_types'
export default {
	props: ['toc'],
	data() {
		return {
			tagList: [],
			commentList: [],
			noteList: []
		}
	},
	components: {
		myCard
	},
	mounted() {
		this.getTagList()
		this.getLastComment()
		this.getLastNotes()
	},
	methods: {
		...mapMutations('post', [type.SET_CURRENT_POST]),
		notEmpty,
		file_url,
		anchor(el) {
			const element = document.getElementById(el.id)
			element.scrollIntoView({ behavior: 'smooth' })
		},
		async getTagList() {
			const { data } = await getAllList(API.TAG)
			// console.log(res)
			this.tagList = data
		},
		async getLastComment() {
			const { data } = await getOther(API_OTHER.NEW_COMMENT)
			this.commentList = data
		},
		async getLastNotes() {
			const { data } = await getOther(API_OTHER.NEW_NOTES)
			this.noteList = data
		},
		gotoArticle(item) {
			this[type.SET_CURRENT_POST](item)
			this.$router.push({ name: 'pArticle', params: { id: item.id } })
		}
	},
	computed: {
		...mapGetters(['currentUser'])
	}
}
</script>
<style lang="scss" scoped>
.asider {
	height: 100%;
}
.my-card {
	margin-bottom: 1rem;
	.about {
		.qr-code {
			text-align: center;
			padding: 8px;
			img {
				height: 7.5rem;
				width: 7.5rem;
				border: 1px solid #eee;
				/* width: 60%; */
				/* margin: 0 auto; */
			}
		}
		.author {
			text-align: center;
			font-size: 1.125rem;
			line-height: 1.875rem;
			height: 1.875rem;
		}
		.link {
			display: flex;
			justify-content: space-evenly;
			margin-top: 0.625rem;
			.fa {
				position: relative;
				border: 1px solid #f0f0f0;
				padding: 0.625rem;
				border-radius: 0.625rem;
				/* &::after {
					position: absolute;
					top: -0.5rem;
					bottom: -0.5rem;
					left: -0.5rem;
					right: -0.5rem;
					border-radius: 50%;
					content: '';
					border: 1px solid;
				} */
				&:hover {
					cursor: pointer;
					transform: scale(1.2);
				}
				&.fa-weibo:hover {
					color: #fc3c31;
				}
				&.fa-qq:hover {
					color: #4e91d1;
				}
				&.fa-github:hover {
					color: #060606;
				}
				&.fa-weixin:hover {
					color: #248a34;
				}
			}
		}
	}
	.tag {
		display: flex;
		flex-wrap: wrap;
		/* align-items: center; */
		/* align-content: center; */
		justify-content: center;
		&-link {
			font-size: 1.125rem;
			padding: 0.25rem 0.5rem;
			font-weight: 700;
			color: $main-green-dark;
			border-bottom: 1px solid transparent;
			transition: all 0.5 linear;
			&:hover {
				color: $main-green;
				border-color: $main-green;
			}
		}
	}
	.comment {
		display: flex;
		flex-direction: column;
		&-item {
			display: flex;
			align-items: center;
			padding: 0.625rem 0;
			border-bottom: 1px dashed #f0f0f0;

			.img {
				width: 24px;
				height: 24px;
			}
			.author {
				text-indent: 0.5em;
				font-size: 14px;
				color: #666;
			}
			.text {
				text-indent: 0.2em;
				font-size: 14px;
				color: $main-grey-dark;
			}
		}
	}
	.note-list {
		.note-item {
			line-height: 1.875rem;
			font-size: 14px;
			@include ellipsis;
			&:hover {
				cursor: pointer;
				color: $main-red;
				/* background-color: rgba($main-blue, 0.2); */
			}
			.fa {
				&::before {
					margin-right: 0.5rem;
				}
			}
		}
	}
	&.toc-card {
		position: sticky;
		top: 1rem;
		z-index: 999;
		.toc {
			.toc-item {
				padding: 6px 0;
			}
		}
	}
}
</style>


