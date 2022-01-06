<template>
	<el-row class="note-page" :gutter="30">
		<el-col class="header" :lg="6" :xs="24">
			<el-form :model="postForm" :rules="postRules" status-icon ref="postForm"
				label-width="0" class="form">
				<div class="img">
					<el-form-item prop="coverImage">
						<el-upload class="avatar-uploader" :action="UPLOAD_URL+'file/uploadFile'"
							:show-file-list="false" :on-success="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload" name="files" :data="{owerId:userId}">
							<img v-if="postForm.coverImage" :src="_url(postForm.coverImage)"
								class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</div>
				<div class="ipt">
					<el-form-item prop="lx">
						<el-select v-model="postForm.lx" placeholder="请选择所属分类" filterable>
							<el-option-group v-for="type in _types" :key="type.id" :label="type.name">
								<el-option v-for="item in type.children" :key="item.id" :label="item.name"
									:value="item.id">
								</el-option>
							</el-option-group>
						</el-select>
					</el-form-item>
					<el-form-item prop="type">
						<el-radio-group v-model="postForm.type">
							<el-radio :label="i.type" v-for="i in POST_STATE" :key="i.type">
								{{i.text}}
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item prop="title">
						<el-input v-model="postForm.title" placeholder="请输入文章标题"></el-input>
					</el-form-item>
				</div>
			</el-form>

		</el-col>
		<el-col class="content" :lg="18" :xs="24">
			<div class="wrapper">
				<div class="wangEditor"></div>
				<div class="t-btns">
					<el-button type="info" class="t-btn" @click="back">返回</el-button>
					<el-button type="primary" class="t-btn" @click="sendPost('postForm')">发布
					</el-button>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import E from 'wangeditor'
import { mapActions, mapGetters, mapState } from 'vuex'
import { aMixin } from '@/mixin'
import { notEmpty, deepClone } from '@/utils'
import * as type from '@/store/mutation_types'
import { POST_STATE, UPLOAD_URL } from '@/utils/global'
import { insertOne, API, editOne } from '@/api'
export default {
	props: ['id'],
	data() {
		return {
			title: '',
			editor: null,
			postForm: {},
			postRules: {
				coverImage: [
					{ required: true, message: '请选择文章封面', trigger: 'blur' }
				],
				lx: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
				type: [{ required: true, message: '请选择文章状态', trigger: 'blur' }],
				title: [{ required: true, message: '请输入文章状态', trigger: 'blur' }]
			},
			POST_STATE,
			UPLOAD_URL
		}
	},
	mixins: [aMixin],
	mounted() {
		this[type.FETCH_TYPE]()
		const editor = new E('.wangEditor')
		editor.config.height = 500
		editor.create()
		if (this.isEdit) {
			this.postForm = deepClone(this.currentPost)
			editor.txt.html(this.currentPost?.htmlContent)
		}
		this.editor = editor
	},
	computed: {
		...mapState(['userId']),
		...mapGetters(['types', 'currentPost']),
		_types() {
			const parent = this.types.filter((i) => i.pid === null)
			return parent.map((i) => {
				const children = this.types.filter((j) => j.pid === i.id)
				return {
					...i,
					// hasChildren: children.length !== 0,
					children
				}
			})
		},
		isEdit() {
			return notEmpty(this.id)
		}
	},
	methods: {
		notEmpty,
		...mapActions('post', [type.FETCH_TYPE]),
		getVal() {
			console.log(this.editor.txt.html())
			console.log(this.editor.txt.text())
		},
		setVal() {
			this.editor.txt.html('<p>sss</p>')
		},
		sendPost(formName) {
			const htmlContent = this.editor.txt.html()
			if (!notEmpty(htmlContent)) {
				return this.$message.warning({ message: '文章内容不能为空' })
			}
			this.$refs[formName].validate(async (valid) => {
				if (!valid) return
				if (this.isEdit) {
					const { success, message } = await editOne(API.NOTE, {
						...this[formName],
						htmlContent
					})
					this.$message[success ? 'success' : 'error']({ message })
					success && this.back()
				} else {
					const { success, message } = await insertOne(API.NOTE, {
						...this[formName],
						htmlContent
					})
					this.$message[success ? 'success' : 'error']({ message })
					success && this.back()
				}
			})
		},
		handleAvatarSuccess(res, file) {
			this.$set(this.postForm, 'coverImage', res)
			// console.log('res :>> ', res)
			// console.log('file :>> ', file)
		},
		beforeAvatarUpload() {}
	},
	beforeDestroy() {
		// 调用销毁 API 对当前编辑器实例进行销毁
		this.editor.destroy()
		this.editor = null
	}
}
</script>

<style lang="scss" scoped>
.note-page {
}
.header {
	.form {
		flex-direction: column;
		justify-content: center;
		display: flex;
		background-color: #fefefe;
		padding: 4rem 2rem;
		border-radius: 1rem;
		.ipt {
			display: flex;
			flex-direction: column;
			.el-form-item {
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
}
.content {
	.wrapper {
		background-color: #fefefe;
		padding: 3rem 2rem;
		border-radius: 1rem;
		.wangEditor {
			width: 100%;
			/* margin-top: 1.25rem; */
		}
		.t-btns {
			text-align: center;
			margin-top: 2rem;
			.t-btn {
				width: 40%;
				height: 2rem;
			}
		}
	}
}
.avatar-uploader {
	text-align: center;
	margin-bottom: rem;
}
</style>