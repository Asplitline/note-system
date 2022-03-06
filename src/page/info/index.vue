<template>
	<div class="info">
		<div class="top-banner">
			<div class="brief">
				<div class="img-box mask">
					<img :src="file_url(user.fileUrl)" alt=""
						onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
					<el-upload class="icon" :action="UPLOAD_URL+'file/uploadFile'"
						:show-file-list="false" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload" name="files" :data="{owerId:user.userId}">
						<i class="fa fa-camera-retro"></i>
						<p>修改我的头像</p>
					</el-upload>

				</div>
				<div class="content ">
					<span class="title">{{user.userName}}</span>
					<span class="desc">{{user.description || '这个人太懒了，没有简介'}}</span>
				</div>
				<div class="auth-btn" @click="apply" v-if="user.state == 0">
					<svg-icon iconClass="auth-article"></svg-icon>
					申请成为导师
				</div>
			</div>
		</div>
		<div class="bottom-container">
			<el-tabs tab-position="left" class="my-tabs" v-model="activeTab">
				<el-tab-pane label="个人资料" :lazy="true" name="myInfo" key="myInfo">
					<myInfo :user="user" @updateUser="updateUser"></myInfo>
				</el-tab-pane>
				<el-tab-pane label="账号设置" :lazy="true" name="setting" key="setting">
					<setting :user="user"></setting>
				</el-tab-pane>
				<el-tab-pane label="我的文章" :lazy="true" name="myNote" key="myNote">
					<myNote :id="user.id"></myNote>
				</el-tab-pane>
				<el-tab-pane label="我的购买" :lazy="true" name="myPay" key="myPay">
					<myPay :id="user.id"></myPay>
				</el-tab-pane>
				<el-tab-pane label="收藏文章" :lazy="true" name="starNote" key="starNote">
					<starNote :user="user" :userlist="userlist"></starNote>
				</el-tab-pane>
				<el-tab-pane label="我的关注" :lazy="true" name="myFollow" key="myFollow">
					<myFollow :user="user"></myFollow>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import myInfo from './myInfo'
import setting from './setting'
import myNote from './myNote'
import payList from './payList'
import starNote from './starNote'
import myPay from './myPay'
import myFollow from './myFollow'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { deepClone, file_url, handleMsg } from '@/utils'
import { BASE_URL, UPLOAD_URL } from '@/utils/global'
import { API, editUser, addApply, applyAllList } from '@/api'
import * as types from '@/store/mutation_types'
export default {
	components: {
		myInfo,
		setting,
		myNote,
		payList,
		starNote,
		myFollow,
		myPay
	},
	data() {
		return {
			activeTab: 'myInfo',
			BASE_URL,
			user: {},
			UPLOAD_URL,
			currentApply: {}
		}
	},
	computed: {
		...mapGetters(['currentUser', 'userlist'])
	},
	mounted() {
		// this.fetchApply()
		this.user = deepClone(this.currentUser)
		this[types.FETCH_USER]()
		this.getInfo(this.user.id)
	},
	watch: {
		currentUser(val) {
			this.user = deepClone(val)
		}
	},
	methods: {
		...mapMutations('user', [types.SET_CRTUSER]),
		...mapActions('user', [types.FETCH_USER, 'getInfo']),
		file_url,
		async handleAvatarSuccess(res, file) {
			this.$set(this.user, 'fileUrl', res)
			// this._avatar = res
			const { success, message } = await editUser(this.user)
			handleMsg(success, '', () => {
				this.updateUser(this.user)
			})
		},
		updateUser(user) {
			this[types.SET_CRTUSER](user)
		},
		beforeAvatarUpload() {},
		async apply() {
			const { success } = await addApply({
				createTime: Date.now(),
				status: 0,
				updateTime: Date.now(),
				userId: this.user.id
			})
			handleMsg(success, '申请已提交，等待审核', () => {})
		}
		// async fetchApply() {
		// 	const { data } = await applyAllList()
		// 	console.log(data)
		// 	this.currentApply = data
		// }
	}
}
</script>

<style lang="scss" scoped>
.info {
	width: 1000px;
	margin: 0 auto;

	.top-banner {
		margin-top: 10px;
		height: 250px;
		background-color: #999999;
		box-shadow: 0 1px 3px rgb(18 18 18 / 10%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		.brief {
			height: 125px;
			background-color: #fff;
			display: flex;
			padding-left: 20px;
			position: relative;
			.img-box {
				position: relative;
				border-radius: 8px;
				border: 4px solid #fff;
				width: 170px;
				height: 170px;
				transform: translateY(-50%);
				.icon {
					display: none;
					cursor: pointer;
					position: absolute;
					flex-direction: column;
					align-items: center;
					content: '';
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: #f0f0f0;
					font-size: 30px;
					p {
						white-space: nowrap;
						margin-top: 10px;
						font-size: 14px;
					}
					.fa-upload {
						font-size: 30px;
					}
				}
				&.mask {
					&:hover:before {
						cursor: pointer;
						position: absolute;
						content: '';
						background-color: rgba(0, 0, 0, 0.5);
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
					}
				}
				&:hover {
					.icon {
						display: flex;
					}
				}
				img {
					width: 100%;
					height: 100%;
				}
			}
			.content {
				padding-top: 16px;
				padding-left: 32px;
				.title {
					font-size: 26px;
					font-weight: 600;
				}
				.desc {
					margin-left: 12px;
					font-size: 18px;
					white-space: nowrap;
				}
				/* &.mask {
				
				} */
			}
			.auth-btn {
				position: absolute;
				top: 20px;
				right: 20px;
				height: 36px;
				line-height: 36px;
				padding: 0 10px;
				border: 1px solid rgba($main-blue, 0.6);
				background-color: rgba($main-blue, 0.6);
				border-radius: 8px;
				color: #fff;
				cursor: pointer;
				&:hover {
					opacity: 0.7;
				}
			}
		}
	}
	::v-deep.my-tabs {
		margin-top: 8px;
		padding: 8px;
		.el-tabs__nav {
			width: 190px;
		}
		.el-tabs__active-bar {
			background-color: transparent;
		}
		.el-tabs__nav-wrap::after {
			background-color: transparent;
		}
		.el-tabs__item {
			height: 48px;
			width: 100%;
			background-color: #fff;
			color: $main-black;
			text-align: center;
			&:hover {
				background: #f0f0f0;
				font-weight: 500;
				color: #222226;
			}
			&.is-active {
				border-color: transparent;
				background: #f0f0f5;
				font-weight: 500;
				color: #222226;
			}
		}
	}
}
</style>