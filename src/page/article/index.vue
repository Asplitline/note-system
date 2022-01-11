<template>
	<div class="aritcle">
		<el-row :gutter="60" class="w">
			<div class="tools">
				<a href="javascript:;" class="fa fa-angle-double-up"
					@click="anchor({id:'article-title'})"></a>
				<a v-if="isPermission" href="javascript:;" class="fa fa-thumbs-o-up"
					:class="{like:isLike}" @click="likeArticle"></a>
				<a v-if="isPermission" href="javascript:;" class="fa fa-heart"
					:class="{star:isStar}" @click="starArticle"></a>
				<a href="javascript:;" class="fa fa-share-alt" @click="share"></a>
				<a href="javascript:;" class="fa fa-comments-o"
					@click="anchor({id:'all-comment'})"></a>
			</div>
			<el-col :span="18" class="detail">
				<div class="main">

					<div class="content">
						<h1 class="title" id="article-title">{{currentPost.title}}</h1>
						<div class="top-info">
							<div class="img-box" v-if="notEmpty(currentAuthor)">
								<img :src="file_url(currentAuthor.fileUrl)" alt=""
									v-if="notEmpty(currentAuthor)"
									onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
							</div>
							<div class="info" v-if="notEmpty(currentAuthor)">
								<div class="author-info">
									<span class="author">{{currentAuthor.userName}} </span>
									<button class="btn" :class="{focus:isFocus}"
										@click="focusUser">{{isFocus?'已关注':'关注Ta'}}</button>
								</div>
								<div class="other">
									<div class="date"><i
											class="fa fa-clock-o"></i>{{currentPost.createTime | formatDate}}
									</div>
									<div class="view"><i class="fa fa-eye"></i>浏览({{currentPost.view || 0}})
									</div>
									<div class="view"><i
											class="fa fa-thumbs-o-up"></i>点赞({{currentPost.likeNum || 0}})
									</div>
									<div class="comment"><i
											class="fa fa-commenting-o"></i>评论({{currentPost.replyNum || 0}})
									</div>
								</div>
							</div>

						</div>
						<div v-html="currentPost.htmlContent" class="html" v-hljs ref="html"
							v-if="isPermission"></div>
						<div class="article-lock" v-else>
							<i class="fa fa-lock"></i>
							<div>付费后才能观看</div>
							<a href="javascript:;" @click="goto">前往付费</a>
						</div>
					</div>
					<el-divider>本文完</el-divider>
					<div class="note">
						<p v-if="notEmpty(currentType)">所属分类：<span class="category"
								@click="gotoList(currentType.id)">{{currentType.name}}</span></p>
						<!-- <p>本文标签：<span class="tag" v-for="i in 4">javascript</span></p> -->
					</div>
				</div>
				<div class="footer">
					<div class="goto" v-if="false">
						<div class="pre">
							<p><i class="fa fa-angle-left"></i>上一篇</p>
							<p>阿斯顿萨达</p>
						</div>
						<div class="next">
							<p>下一篇<i class="fa fa-angle-right"></i></p>
							<p>阿斯顿萨达</p>
						</div>
					</div>
					<myCard :shadow="false" title="热门推荐" class="hots" icon="fa-fire">
						<ul class="hot-list">
							<li class="hot-item" v-for="i in randNotes" :key="i.id">
								<div class="cover">
									<img :src="file_url(i.coverImage)" alt=""
										onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
								</div>
								<div class="info">
									<div class="title" @click="gotoDetail(i)">{{i.title}}</div>
									<div class="other">
										<span class="fa fa-eye">浏览({{i.view || 0}})</span>
										<span class="fa fa-thumbs-o-up">点赞({{i.likeNum || 0}})</span>
										<span class="fa fa-commenting-o">评论({{i.replyNum || 0}})</span>
									</div>
								</div>
							</li>
						</ul>
					</myCard>
					<myCard :shadow="false" title="相关文章" class="related" icon="fa-bookmark-o"
						v-if="false">
						<ul class="related-list">
							<li class="related-item" v-for="i in 4">
								<i class="fa fa-book"></i>132123
							</li>
						</ul>
					</myCard>
					<myCard :shadow="false" title="评论" class="comment" icon="fa-commenting-o">
						<commentBox v-model="comment" @handle="addComment" />
						<div class="comment-list">
							<h3 class="comment-title" id="all-comment">全部评论
								({{notEmpty(commentList)?commentList.length:0}})</h3>
							<template v-if="notEmpty(commentList)">
								<div class="comment-item" v-for="i in commentList" :key="i.id">
									<div class="header">
										<img :src="file_url(i.author.fileUrl)" alt=""
											onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
										<div class="info">
											<span class="author">{{i.author.userName}}</span><span
												class="date fa fa-clock-o">{{i.createTime | formatDate}}</span>
										</div>
									</div>
									<div class="content">
										<div class="reply">
											<p class="reply-content fa">
												{{i.content}}
											</p>
											<ul class="reply-list">
												<li class="reply-item" v-for="reply in getReplyById(i.id)"
													:key="reply.id">
													<div class="reply-header">
														<div class="img-box">
															<img :src="file_url(reply.author.fileUrl)" alt=""
																onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
														</div>
														<span class="author">{{reply.author.userName}}</span>
														<span
															class="date fa fa-clock-o">{{reply.createTime| formatDate}}</span>
													</div>
													<div class="reply-text">{{reply.content}}</div>
												</li>
											</ul>
										</div>
									</div>
									<div class="footer">
										<span class="fa fa-thumbs-o-up"
											@click="likeComment(i)">赞({{i.extend2 || 0}})</span>
										<span class="fa fa-reply" @click="setCurrent(i)">回复</span>
									</div>
									<commentBox v-if="current === i" v-model="reply" :isReply="true"
										@handle="addReply(i)" />
								</div>
							</template>
							<myEmpty desc="还没有评论" v-else></myEmpty>
						</div>
					</myCard>
				</div>
			</el-col>
			<el-col :span="6">
				<Asider :toc="this.headlist"></Asider>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Asider from '@/page/components/asider.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import myCard from '../components/myCard'
import commentBox from '../components/commentBox'
import {
	API,
	deleteOne,
	getAllList,
	getById,
	getPageList,
	insertOne,
	notesLike,
	starNoteList,
	starUserList,
	getComment,
	commentLike,
	addViews
} from '@/api'
import * as type from '@/store/mutation_types'
import { notEmpty, handleMsg, file_url, copy, anchor } from '@/utils'
export default {
	props: ['id'],
	data() {
		return {
			headlist: [],
			show: false,
			comment: '',
			current: '',
			reply: '',
			commentList: [],
			replyList: [],
			isLike: false,
			isStar: false,
			isFocus: false,
			focusText: '关注',
			starInfo: {},
			notes: [],
			starInfo: {},
			focusInfo: {}
		}
	},
	components: {
		Asider,
		myCard,
		commentBox
	},
	methods: {
		...mapActions({
			[type.FETCH_USER]: `user/${type.FETCH_USER}`,
			[type.FETCH_TYPE]: `post/${type.FETCH_TYPE}`,
			[type.FETCH_RECORD]: `post/${type.FETCH_RECORD}`
		}),
		...mapMutations('post', [type.SET_CURRENT_POST]),
		notEmpty,
		file_url,
		anchor,
		setCurrent(i) {
			// console.log(i)
			this.current = i
		},
		share() {
			copy(window.location.href)
		},
		async fetchComment() {
			const list = await getComment({ notesId: this.id })
			this.commentList = list?.map((i) => {
				const author = this.getUserById(i.userId)
				return { ...i, author }
			})
			console.log(this.commentList)
		},
		getUserById(id) {
			return this[`user/${type.GET_USER}`](id)
		},
		getReplyById(id) {
			return this.replyList.filter((i) => i.commentId === id)
		},
		getNoteTypeById(id) {
			return this.noteTypeList.find((i) => i.id)
		},
		async likeComment({ id }) {
			const { success, message } = await commentLike({ id })
			handleMsg(success, message, () => {
				this.fetchComment()
			})
		},
		async addComment() {
			const content = this.comment.trim()
			const payload = {
				authorId: this.currentPost.userId,
				notesId: this.id,
				userId: this.currentUser.id,
				createTime: new Date(),
				content
			}
			const { success, message } = await insertOne(API.COMMENT, payload)
			handleMsg(success, message, () => {
				this.comment = ''
				this.fetchComment()
			})
		},
		async addReply(item) {
			const content = this.reply.trim()
			const payload = {
				authorId: this.currentPost.userId,
				commentId: item.id,
				notesId: this.id,
				userId: this.currentUser.id,
				createTime: new Date(),
				content
			}
			const { success, message } = await insertOne(API.REPLY, payload)
			handleMsg(success, message, () => {
				this.reply = ''
				this.fetchReply()
			})
		},
		async fetchReply() {
			const { data } = await getAllList(API.REPLY)
			this.replyList = data?.map((i) => {
				const author = this.getUserById(i.userId)
				return { ...i, author }
			})
			console.log(this.replyList)
		},
		genarateTOC() {
			const headList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
			const h = [...this.$refs.html.childNodes].filter((i) =>
				headList.includes(i.localName)
			)
			this.headlist = h.map((i, key) => {
				i.setAttribute('id', `${i.localName}_${key}`)
				return {
					id: `${i.localName}_${key}`,
					text: i.innerText,
					tag: i.nodeName,
					class: `${i.localName}_title`
				}
			})
		},
		async likeArticle() {
			if (this.isLike) return this.$message.warning('点赞太频繁了 ~ ~')
			const { success, message } = await notesLike({ id: this.currentPost.id })
			handleMsg(success, message, () => {
				this.updateArticle()
			})
			this.isLike = success
		},
		async starArticle() {
			if (this.isStar === false) {
				const { success, message } = await insertOne(API.FOCUSON, {
					createTime: new Date(),
					memberId: this.id,
					type: 1,
					userId: this.userId
				})
				handleMsg(success, message, () => {
					this.handleStarArticle()
				})
			} else {
				const { success, message } = await deleteOne(API.FOCUSON, {
					id: this.starInfo.id
				})
				handleMsg(success, message, () => {
					this.handleStarArticle()
				})
			}
		},
		async handleStarArticle() {
			await this[[type.FETCH_RECORD]]()

			const { flag, res } = this[type.FILTER_RECORD](this.id, this.userId, 1)
			this.starInfo = res?.[0]
			this.isStar = flag
		},
		async handleStarUser() {
			await this[[type.FETCH_RECORD]]()

			const { flag, res } = this[type.FILTER_RECORD](
				this.currentAuthor.id,
				this.userId,
				0
			)
			this.focusInfo = res?.[0]
			this.isFocus = flag
		},
		async focusUser() {
			if (this.isFocus) {
				const { success, message } = await deleteOne(API.FOCUSON, {
					id: this.focusInfo.id
				})
				handleMsg(success, message, () => {
					this.handleStarUser()
				})
			} else {
				if (this.currentPost.userId === this.userId) {
					return this.$message.error('不能关注自己')
				}
				const { success, message } = await insertOne(API.FOCUSON, {
					createTime: new Date(),
					memberId: this.currentPost.userId,
					type: 0,
					userId: this.userId
				})
				handleMsg(success, message, () => {
					this.handleStarUser()
				})
			}
		},
		async fetchNotes() {
			const { data } = await getAllList(API.NOTE)
			this.notes = data
		},
		gotoDetail(i) {
			this[type.SET_CURRENT_POST](i)
			this.$router.push({ name: 'pArticle', params: { id: i.id } })
		},
		gotoList(id) {
			this.$router.push({ name: 'pList', params: { id } })
		},
		async readOver() {
			const { success } = await addViews({ id: this.currentPost.id })
			window.removeEventListener('scroll', this.handleScroll)
			success && this.updateArticle()
		},
		handleScroll() {
			const ele = document.documentElement
			const body = document.body
			// 距离顶部距离
			const scrollTop = ele.scrollTop || body.scrollTop
			// 可视区高度
			const windowHeight = ele.clientHeight || body.clientHeight
			// 滚动条总高度
			const scrollHeight = ele.scrollHeight || body.scrollHeight
			if (scrollTop + windowHeight == scrollHeight) {
				this.readOver()
				console.log('到了底部')
			}
		},
		async updateArticle() {
			const { data } = await getById(API.NOTE, { id: this.currentPost.id })
			this[type.SET_CURRENT_POST](data)
		},
		goto() {
			this[type.SET_CURRENT_POST](this.currentPost)
			this.$router.push({
				name: 'pPayDetail',
				query: { id: this.currentPost.id }
			})
		}
	},
	computed: {
		...mapGetters({
			currentPost: 'currentPost',
			userlist: 'userlist',
			currentUser: 'currentUser',
			types: 'types',
			userId: 'userId',
			[`user/${type.GET_USER}`]: `user/${type.GET_USER}`,
			[type.FILTER_RECORD]: `post/${type.FILTER_RECORD}`
		}),
		currentAuthor() {
			return this.getUserById(this.currentPost.userId)
		},
		currentType() {
			return this.types.find((i) => i.id === this.currentPost.lx)
		},
		randNotes() {
			const notes = this.notes.filter((i) => i.id !== this.id)
			return notes.slice(0, 8).sort(() => 0.5 - Math.random())
		},
		isPermission() {
			return (
				this.currentPost.type !== 1 ||
				this[type.FILTER_RECORD](this.id, this.userId, 2).flag ||
				this.currentPost.userId === this.userId
			)
		}
	},

	async mounted() {
		window.addEventListener('scroll', this.handleScroll)
		await this[[type.FETCH_RECORD]]()
		await this[type.FETCH_USER]()
		this.isPermission && this.genarateTOC()
		this[type.FETCH_TYPE]()
		// comment
		this.fetchReply()
		this.fetchComment()
		// star
		this.handleStarArticle()
		this.handleStarUser()
		// randNotes
		this.fetchNotes()
	},
	destroyed() {
		window.removeEventListener('scroll', this.handleScroll)
	}
}
</script>

<style lang="scss" scoped>
.aritcle {
	@include base_layout;
	.w {
		display: flex;
	}
	.detail {
		padding: 0 !important;
		.main {
			@include box_shadow(#0001);
			padding: 0.9375rem 2rem;
			background-color: #fff;
			margin-bottom: 2rem;
			.top-info {
				display: flex;
				align-items: center;
				padding: 0 0 20px;
				.img-box {
					width: 50px;
					height: 50px;
					margin-right: 10px;
					img {
						border-radius: 50%;
						width: 100%;
						height: 100%;
					}
				}
				.info {
					display: flex;
					height: 60px;
					width: 100%;
					justify-content: space-between;
					flex-direction: column;
					.author-info {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.author {
							color: $main-black;
							font-size: 16px;
						}
						.btn {
							font-size: 14px;
							border-radius: 4px;
							border: 1px solid;
							cursor: pointer;
							height: 32px;
							width: 80px;
							margin-left: auto;
							background-color: transparent;
							color: #06f;
							&:hover {
								opacity: 0.7;
								/* background-color: $main-blue; */
							}
							&.focus {
								color: #fff;
								background-color: #06f;
							}
						}
					}
					.other {
						display: flex;
						@include icons;
					}
				}
			}

			.title {
				margin: 0;
				padding: 0.5rem 0 1.2rem;
			}
			.content {
				::v-deep .html {
					:not(pre) > code {
						color: #e74c3c;
						border: solid 1px #e1e4e5;
						background-color: #f3f5f9aa;
						padding: 0 0.5rem;
						border-radius: 0.3rem;
						display: inline-block;
						margin: 0 0.5rem;
					}
					p {
						line-height: 1.8rem;
					}
					code {
						border-radius: 0.8rem;
						line-height: 1.5rem;
						/* padding: 0.625rem; */
					}
					img {
						width: 100%;
					}
				}
			}

			.note {
				font-size: 0.875rem;

				p {
					margin-bottom: 0;
				}
				.category,
				.tag {
					/* display: inline-block; */
					/* padding: 0.5rem 0; */
					cursor: pointer;
					color: $main-blue-dark;
					font-size: 0.875rem;
					margin-right: 1rem;
					border-bottom: 1px solid transparent;
					&:hover {
						border-bottom: 1px dashed $main-blue-dark;
					}
				}
			}
		}
		.footer {
			.goto {
				@include box_shadow(#6661);
				padding: 0.5rem 0;
				margin-bottom: 1rem;
				display: flex;
				align-items: center;
				background-color: #fff;
				.pre,
				.next {
					flex: 1;
					text-align: center;
					cursor: pointer;
					.fa {
						padding: 0 1rem;
					}
					:first-child {
						color: $main-blue;
					}
				}
			}
			.my-card {
				/* padding: 0.5rem 0.5rem; */
				margin-bottom: 1rem;
				::v-deep.my-card-title {
					height: 3rem;
					line-height: 3rem;
				}
			}
			.hots {
				.hot-list {
					display: flex;
					/* flex-direction: column; */
					flex-wrap: wrap;
					.hot-item {
						flex: 0 0 50%;
						padding: 0.5rem 0;
						display: flex;
						.cover {
							padding: 0 0.625rem;
							img {
								width: 100px;
								height: 60px;
								transition: all 0.5s linear;
								&:hover {
									/* scale: 1.5; */
									transform: scale(1.2);
								}
							}
						}
						.info {
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							.title {
								font-size: 16px;
								color: $main-blue-dark;
								cursor: pointer;
							}
							.other {
								@include icon_base;
								span {
									margin-right: 0.5rem;
									&:last-child {
										margin-right: 0;
									}
								}
							}
						}
					}
				}
			}

			.related {
				.related-list {
					padding: 0 1rem;
					display: flex;
					flex-wrap: wrap;
					.related-item {
						flex-basis: 50%;
						color: $main-black;
						cursor: pointer;
						height: 1.5rem;
						line-height: 1.5rem;
						.fa {
							margin-right: 0.5rem;
						}
					}
				}
			}
			.comment {
				.comment-list {
					.comment-item {
						padding-top: 1.2rem;
						&:first-of-type {
							padding-top: 0;
						}
						.header {
							display: flex;
							& > img {
								width: 3rem;
								height: 3rem;
								border-radius: 50%;
							}
							.info {
								@include icon_base;
								padding-left: 0.5rem;
								display: flex;
								flex-direction: column;
								justify-content: space-between;

								.author {
									font-size: 1rem;
									color: $main-blue-dark;
									/* cursor: pointer; */
								}
							}
						}
						.content {
							/* padding-top: 1rem; */
							.reply {
								display: flex;
								flex-direction: column;
								.reply-content {
									margin: 0;
									padding: 1rem;
									color: #666;
									font-size: 0.875rem;
									&::before {
										font-size: 0.875rem;
										color: $main-black-dark;
										content: '\f10d';
									}
									&::after {
										font-size: 0.875rem;
										color: $main-black-dark;
										content: '\f10e';
									}
								}
								.reply-list {
									padding: 0 0 1rem;
									.reply-item {
										padding: 0.625rem;
										display: flex;
										flex-direction: column;
										flex-wrap: wrap;
										background-color: #f5f5f5;

										.reply-header {
											display: flex;
											align-items: center;
											color: #666;
											font-size: 0.875rem;
											.img-box {
												img {
													border-radius: 50%;
													width: 30px;
													height: 30px;
												}
											}
											.author {
												color: $main-blue-dark;
												font-size: 1rem;
												padding: 0 0.5rem;
											}
										}
										.reply-text {
											padding: 0.5rem 0;
										}
									}
								}
							}
						}
						.footer {
							padding: 0.2rem 0 0.5rem;
							color: $main-blue-dark;
							.fa {
								cursor: pointer;
								margin-left: 0.5rem;
								&:first-child {
									margin: 0;
								}
							}
						}
					}
				}
			}
		}
	}

	.article-lock {
		width: 100%;
		height: 400px;
		background-color: #0001;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		i {
			font-size: 60px;
			color: $main-red-dark;
		}
		div {
			font-size: 24px;
			color: $main-red;
			margin: 20px 0;
		}
		a {
			display: inline-block;
			padding: 6px 12px;
			border-radius: 6px;
			background-color: $main-green;
			color: $main-white;
		}
	}
	.tools {
		position: fixed;
		top: 80px;
		left: 50%;
		padding: 20px 10px;
		transform: translateX(-680px);
		display: flex;
		justify-content: center;
		flex-direction: column;
		background-color: #fff;
		border-radius: 4px;
		.fa {
			margin-bottom: 10px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26px;
			padding: 0.5rem;
			border-radius: 4px;
			transition: transform 0.1s linear;
			&:hover {
				transform: scale(1.2);
			}
			&:last-child {
				margin-bottom: 0;
			}
			&::before {
				margin-right: 0;
			}
			&.fa-thumbs-o-up {
				color: $main-blue;
				border-color: $main-blue;
				&.like {
					border-color: transparent;
					background-color: rgba($color: $main-blue, $alpha: 0.8);
					color: $main-white;
				}
			}
			&.fa-heart {
				color: $main-red;
				border-color: $main-red;
				&.star {
					border-color: transparent;
					background-color: rgba($color: $main-red, $alpha: 0.8);
					color: $main-white;
				}
			}
			&.fa-share-alt {
				color: $main-green;
				border-color: $main-green;
			}
			&:last-child {
				margin-right: 0;
			}
			&:hover {
				opacity: 0.7;
			}
		}
	}
}
</style>