<template>
	<div class="post-list">
		<template v-if="notEmpty(list)">
			<div class="item" v-for="i in list" :key="i.id">
				<div class="cover">
					<span class="ribbon orange">{{getName(i.lx)}}</span>
					<img :src="_url(i.coverImage)" alt="" class="img"
						onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
				</div>
				<div class="info">
					<div class="title">{{i.title}}</div>
					<div class="desc">{{i.title}}</div>
					<div class="other">
						<div class="date"><i class="fa fa-clock-o"></i>{{i.createTime | formatDate}}
						</div>
						<div class="view"><i class="fa fa-eye"></i>浏览({{i.view || 0}})</div>
						<div class="view"><i class="fa fa-thumbs-o-up"></i>点赞({{i.likeNum || 0}})
						</div>
						<div class="comment"><i class="fa fa-commenting-o"></i>评论({{i.replyNum || 0}})
						</div>
					</div>
				</div>
				<div class="btns">
					<button class="btn" @click="handleClick(i)">查看文章</button>
				</div>
			</div>
		</template>
		<template v-else>
			<myEmpty desc="暂无文章" />
		</template>
	</div>

</template>

<script>
import { notEmpty } from '@/utils'
import myEmpty from '@/page/components/myEmpty.vue'
import { mapGetters, mapActions } from 'vuex'
import * as type from '@/store/mutation_types'
export default {
	name: 'postList',
	props: {
		list: {
			type: Array,
			default: []
		}
	},
	components: {
		myEmpty
	},
	computed: {
		...mapGetters('post', [type.GET_TYPE])
	},
	methods: {
		...mapActions('post', [type.FETCH_TYPE]),
		notEmpty,
		_url(path) {
			return this.IMG_URL + path
		},
		handleClick(e) {
			this.$emit('handle', e)
		},
		getName(id) {
			return this[type.GET_TYPE](id)?.name || '杂项'
		}
	},
	mounted() {
		this[type.FETCH_TYPE]()
	}
}
</script>

<style lang="scss" scoped>
.list {
	height: 100%;
	/* background-color: #fff; */
	.item {
		position: relative;
		padding: 1rem;
		background-color: #fff;
		margin-bottom: 1.25rem;
		display: flex;
		border-radius: 0.125rem;
		@include box_shadow; /* box-shadow: 1px 2px 2px 2px #0002; */
		.cover {
			margin: 0.625rem;
			width: 8rem;
			overflow: hidden;
			.img {
				width: auto;
				height: 8rem;
				overflow: hidden;
				&:hover {
					transform: scale(1.05);
				}
			}
		}
		.info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			padding-left: 1rem;
			.title {
				color: #303030;
				font-size: 1.4rem;
				/* font-weight: 700; */
			}
			.desc {
				font-size: 1rem;
				color: #808080;
			}
			.other {
				display: flex;
				& > div {
					color: #a0a0a0;
					margin-right: 10px;
					font-size: 0.875rem;
				}
				.fa {
					margin-right: 0.2rem;
				}
			}
		}
		.btns {
			display: flex;
			align-items: flex-end;
			/* justify-content: flex-end; */
			.btn {
				cursor: pointer;
				width: 6.25rem;
				height: 1.875rem;
				border: 1px solid $main-blue;
				/* border-radius: 0.375rem; */
				background-color: transparent;
				color: $main-blue-dark;
				transition: all 0.5;
				&:hover {
					color: #fff;
					background-color: $main-blue;
				}
			}
		}
	}
}
</style>