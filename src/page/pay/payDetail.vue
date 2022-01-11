<template>
	<div class="pay-detail w">
		<div class="top-box">
			<div class="cover">
				<img :src="file_url(currentPost.coverImage)" alt=""
					onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
			</div>
			<div class="info" v-if="notEmpty(currentPost) && notEmpty(currentUser) ">
				<h3 class="title">{{currentPost.title}}</h3>
				<p class="author">作者：{{currentUser.userName}}</p>
				<p class="price"><i class="fa fa-jpy"></i>{{currentPost.price | toX}}</p>
				<div class="btns">
					<button class="btn" @click="pay" v-if="!isPurchase">立即购买</button>
					<button class="btn detail" @click="goto" v-else>查看详情</button>
				</div>
			</div>
		</div>
		<div class="alipay-box"></div>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { file_url, hashID, notEmpty } from '@/utils'
import * as type from '@/store/mutation_types'
import { alipay, insertOne, API } from '@/api'
export default {
	props: ['id'],
	data() {
		return {}
	},
	computed: {
		...mapGetters({
			currentPost: 'currentPost',
			userlist: 'userlist',
			userId: 'userId',
			filterRecord: 'post/' + type.FILTER_RECORD
		}),
		currentUser() {
			return this.userlist.find((i) => i.id === this.currentPost.userId)
		},
		isPurchase() {
			debugger
			return (
				this.filterRecord(this.id, this.userId, 2).flag ||
				this.currentPost.userId === this.userId
			)
		}
	},
	mounted() {
		this[type.FETCH_USER]()
		this[type.FETCH_RECORD]()
	},
	methods: {
		file_url,
		notEmpty,
		...mapActions({
			[type.FETCH_USER]: 'user/' + type.FETCH_USER,
			[type.FETCH_RECORD]: 'post/' + type.FETCH_RECORD
		}),
		...mapMutations({
			[type.SET_CURRENT_POST]: 'post/' + type.SET_CURRENT_POST
		}),
		async pay() {
			const html = await alipay({
				out_trade_no: hashID(32),
				total_amount: this.currentPost.price,
				subject: 'sadsad'
			})
			// this.$message.success('购买成功')
			const div = document.createElement('div')
			div.innerHTML = html

			document.body.appendChild(div)
			const forms = document.forms
			let len = forms.length - 1
			document.forms[len].setAttribute('target', '_blank')
			document.forms[len].submit()
			document.body.removeChild(div)

			const result = await insertOne(API.FOCUSON, {
				createTime: new Date(),
				memberId: this.id,
				type: 2,
				userId: this.userId
			})
		},
		goto() {
			this[type.SET_CURRENT_POST](this.currentPost)
			this.$router.push({ name: 'pArticle', params: { id: this.id } })
		}
	}
}
</script>

<style lang="scss" scoped>
.pay-detail {
	padding-top: 20px;
	.top-box {
		display: flex;
		padding: 20px;
		background-color: #fff;
		.cover {
			img {
				height: 240px;
				width: 400px;
				/* height: 100%; */
			}
		}
		.info {
			padding-left: 20px;
			flex: 1;
			display: flex;
			flex-direction: column;
			.title {
				font-size: 24px;
				color: #333;
				line-height: 1.2;
				font-weight: normal;
				margin: 0;
			}
			.author {
				font-size: 14px;
				color: #666;
			}
			.price {
				margin-bottom: auto;
				color: #333;
				font-size: 28px;
				font-family: '微软雅黑';
			}
			.btns {
				.btn {
					color: white;
					font-size: 20px;
					line-height: 40px;
					line-height: 40px;
					width: 140px;
					text-align: center;
					outline: none;
					border: none;
					background-color: $main-red;
					vertical-align: middle;
					display: inline-block;
					cursor: pointer;
					&.detail {
						background-color: $main-blue;
					}
					&:hover {
						opacity: 0.7;
					}
				}
			}
		}
	}
}
</style>