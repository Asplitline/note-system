<template>
	<div class="pay">
		<div class="w pay-box">
			<h3>付费专区</h3>
			<ul class="pay-list">
				<li class="pay-item" v-for="i in list" :key="i.id">
					<div class="pay-item-box">
						<div class="img-box">
							<img :src="file_url(i.coverImage)" alt="" @click="gotoDetail(i)"
								onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
						</div>
						<div class="content-box">
							<p class="title" @click="gotoDetail(i)">{{i.title}}</p>
							<div class="info">
								<span class="date">日期：{{i.createTime | formatDate}}</span>
								<span class="author">作者：{{findUserById(i.userId)}}</span>
							</div>
							<div class="pay-price">
								<span><em class="fa fa-jpy"></em>{{i.price | toX}}</span>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { API, getPageList } from '@/api'
import { file_url } from '@/utils'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import * as type from '@/store/mutation_types'
export default {
	data() {
		return {
			list: []
		}
	},
	mounted() {
		this[type.FETCH_USER]()
		this.getPaylist()
	},
	computed: {
		...mapGetters(['userlist', `user/${type.GET_USER}`])
	},
	methods: {
		file_url,
		...mapMutations('post', [type.SET_CURRENT_POST]),
		...mapActions('user', [type.FETCH_USER]),
		async getPaylist() {
			const { list, total } = await getPageList(API.NOTE, {
				type: '1',
				size: 999
			})
			this.list = list
			// console.log(res)
		},
		findUserById(id) {
			const user = this[`user/${type.GET_USER}`](id)
			return user?.userName ?? 'default'
		},
		gotoDetail(item) {
			this[type.SET_CURRENT_POST](item)
			this.$router.push({ name: 'pPayDetail', params: { id: item.id } })
		}
	}
}
</script>

<style lang="scss" scoped>
.pay-box {
	h3 {
		font-size: 24px;
		color: #333;
		height: 31px;
		line-height: 31px;
	}
	.pay-list {
		display: flex;
		flex-wrap: wrap;
		padding: 1rem 0;
		width: 100%;

		.pay-item {
			overflow: hidden;
			width: 24%;
			padding: 0 0.5%;
			.pay-item-box {
				background-color: #fff;
				margin-bottom: 1rem;
				border-radius: 0.625rem;
				overflow: hidden;
				.img-box {
					width: 100%;
					height: 160px;
					/* max-height: 12.5rem; */
					overflow: hidden;
					img {
						height: 100%;
						width: 100%;
						&:hover {
							cursor: pointer;
							transform: scale(1.2);
						}
						/* margin: 0 -0.625rem; */
					}
				}
				.content-box {
					padding: 0 14px;
					.title {
						font-size: 16px;
						color: #333;
						margin-bottom: 10px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						&:hover {
							cursor: pointer;
							color: $main-red;
						}
					}
					.info {
						display: flex;
						flex-direction: column;
						padding: 8px 0;
						color: #666;
						height: 17px;
						font-size: 12px;
						span {
							margin-bottom: 6px;
						}
					}
					.pay-price {
						color: #ff1d00;
						text-align: right;
						padding: 32px 0 16px;
						margin-right: 10px;
						font-size: 22px;
					}
				}
			}
			&:last-child {
				margin-right: auto;
			}
		}
	}
}
</style>