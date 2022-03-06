<template>
	<el-card class="tag">
		<TableHeader @add="handleAdd" v-model="query.keyword" @search="getList"
			@clear="getList" />
		<el-table v-loading=" listLoading" :data="list" element-loading-text="Loading" border
			style="width: 100%" fit highlight-current-row>
			<el-table-column align="center" label="头像" min-width="95">
				<template v-slot={row}>
					<el-avatar shape="square" :size="80" :src="_url(row.fileUrl)"
						v-if="row.fileUrl"></el-avatar>
					<el-avatar shape="square" :size="80" v-else></el-avatar>
				</template>
			</el-table-column>
			<el-table-column align="center" label="用户名" min-width="95">
				<template v-slot={row}>
					{{row.userName}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="邮箱" min-width="95">
				<template v-slot={row}>
					<div class="t-ellipsis">{{row.email}}</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="手机号" min-width="95">
				<template v-slot={row}>
					<div>{{row.phone}}</div>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" label="状态" min-width="95">
				<template v-slot={row}>
					<el-switch v-model="row.state" active-text="管理员" inactive-text="普通"
						:active-value="1" :inactive-value="0" @change="modifyState($event,row)">
					</el-switch>
				</template>
			</el-table-column> -->
			<el-table-column align="center" label="注册时间" min-width="95">
				<template v-slot={row}>
					{{row.createTime | formatDate}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="身份" min-width="95">
				<template v-slot={row}>
					<el-radio-group v-model="row.state" size="mini"
						@change="handleChange($event,row)">
						<el-radio-button :label="i.id" v-for="i in USER_STATE" :key="i.id">
							{{i.text}}
						</el-radio-button>
					</el-radio-group>
				</template>
			</el-table-column>
			<el-table-column align="center" class-name="t-btns" label="操作" min-width="95">
				<template v-slot={row}>
					<!-- {{ scope.$index }} -->
					<el-button class="t-btn" type="success" icon="el-icon-edit"
						@click="editById(row)">
					</el-button>
					<el-button slot="reference" class="t-btn" type="danger" icon="el-icon-delete"
						@click="deleteById(row.id)">
					</el-button>
					<el-button slot="reference" class="t-btn" type="primary" icon="el-icon-refresh-right
" @click="resetPassword(row.id)">
					</el-button>

				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange"
			@current-change="handleCurrentChange($event,getList)" class="t-pagination"
			:current-page.sync="query.page" :page-size="query.size"
			layout="prev, pager, next, jumper" :total="total">
		</el-pagination>

		<!-- 分类处理 -->
		<el-dialog :title="isEdit?'修改':'添加'+'用户'" width="30%"
			:visible.sync="dialogFormVisible" @close="resetForm('userForm')"
			:close-on-click-modal="false" class="t-dialog" key="userForm">
			<el-form :model="userForm" :hide-required-asterisk="true" status-icon :rules="rules"
				label-width="80px" ref="userForm">
				<el-form-item label="用户头像" prop="file_url" v-if="isEdit">
					<!-- <el-input v-model="userForm.file_url" autocomplete="off"></el-input> -->

					<el-upload class="avatar-uploader" :action="UPLOAD_URL+'file/uploadFile'"
						:show-file-list="false" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload" name="files" :data="{owerId:userForm.id}">
						<img v-if="userForm.fileUrl" :src="_url(userForm.fileUrl)" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="账号" prop="userName">
					<el-input v-model="userForm.userName" :readonly="isEdit">
					</el-input>
				</el-form-item>
				<!-- <el-form-item label="用户密码" prop="passWord">
					<el-input type="password" v-model="userForm.passWord">
					</el-input>
				</el-form-item> -->
				<el-form-item label="用户邮箱" prop="email">
					<el-input v-model="userForm.email">
					</el-input>
				</el-form-item>
				<el-form-item label="用户电话" prop="phone">
					<el-input v-model="userForm.phone">
					</el-input>
				</el-form-item>
				<el-form-item label="用户年龄" prop="age">
					<el-input type="number" v-model="userForm.age">
					</el-input>
				</el-form-item>
				<el-form-item label="个人简介" prop="description">
					<el-input v-model="userForm.description" type="textarea" autocomplete="off"
						resize="none" :autosize="{ minRows: 3, maxRows: 4}" F>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer t-btns">
				<el-button type="info" @click="dialogFormVisible = false" class="t-btn">取 消
				</el-button>
				<el-button type="success" @click="submitForm('userForm')" class="t-btn">
					{{isEdit?'修 改':'添 加'}}
				</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
import {
	API,
	insertOne,
	deleteOne,
	getUser,
	changePassword,
	editUser
} from '@/api'
import { UPLOAD_URL, USER_STATE } from '@/utils/global'
import { hashID, deepClone, validateEmail, validatePhone } from '@/utils'
import { aMixin } from '@/mixin'

export default {
	data() {
		const validEmail = (rule, value, callback) => {
			if (!value?.trim().length) {
				callback(new Error('请输入电子邮箱'))
			} else if (!validateEmail(value)) {
				callback(new Error('电子邮箱格式错误'))
			} else {
				callback()
			}
		}
		const validPhone = (rule, value, callback) => {
			if (!value?.trim().length) {
				callback(new Error('请输入手机号码'))
			} else if (!validatePhone(value)) {
				callback(new Error('手机号码格式错误'))
			} else {
				callback()
			}
		}
		const validAge = (rule, value, callback) => {
			if (value < 0 || value > 120) callback(new Error('年龄应该在1-120之间'))
			else {
				callback()
			}
		}
		return {
			USER_STATE,
			key: '',
			list: [],
			listLoading: false,
			dialogFormVisible: false,
			userForm: {},
			UPLOAD_URL,
			rules: {
				userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
				email: [{ validator: validEmail, trigger: 'blur' }],
				phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
				age: [{ trigger: 'blur', validator: validAge }]
			},
			isEdit: false,
			radio: ''
		}
	},
	mixins: [aMixin],
	mounted() {
		this.getList()
	},
	methods: {
		handleAdd() {
			this.isEdit = false
			this.dialogFormVisible = true
			this.userForm = {}
		},
		async getList() {
			this.listLoading = true
			const { total, list } = await getUser(API.USER, this.query)
			this.listLoading = false
			this.total = total
			this.list = list
		},
		async deleteById(id) {
			this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'error'
			})
				.then(async () => {
					const { success, message } = await deleteOne(API.USER, { id })
					this.$message[success ? 'success' : 'error'](message)
					this.getList()
				})
				.catch(() => {})
		},
		async modifyState(state, { id }) {
			const { success, message } = await editUser({
				id,
				state
			})
			this.$message[success ? 'success' : 'error'](message)
			this.getList()
		},
		editById(row) {
			this.isEdit = true
			this.dialogFormVisible = true
			this.userForm = deepClone(row)
		},
		resetForm(formName) {
			this.$refs[formName].resetFields()
		},
		submitForm(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (!valid) return
				console.log(this[formName])
				console.log(this.isEdit)
				if (this.isEdit === false) {
					const { success, message } = await insertOne(API.USER, {
						...this[formName],
						id: hashID(),
						createTime: Date.now()
					})
					this.dialogFormVisible = false
					success && this.getList()
				} else {
					const { success, message } = await editUser({
						...this[formName],
						updateTime: Date.now()
					})
					this.dialogFormVisible = false
					success && this.getList()
				}
			})
		},
		async handleChange(evt, v) {
			const { success, message } = await editUser({
				...v,
				state: evt,
				updateTime: Date.now()
			})
			message && this.$message[success ? 'success' : 'error'](message)
		},
		async resetPassword(id) {
			this.$confirm('此操作将密码重置为：123456, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'error'
			})
				.then(async () => {
					const { success, message } = await changePassword({
						id,
						password: 123456
					})
					message && this.$message[success ? 'success' : 'error'](message)
					// this.getList()
				})
				.catch((e) => {
					console.log(e)
				})
		},
		handleAvatarSuccess(res, file) {
			// this.fileUrl = res
			this.$set(this.userForm, 'fileUrl', res)
		},
		beforeAvatarUpload(file) {
			console.log(file)
			// const isJPG = file.type === 'image/jpeg'
			// const isLt2M = file.size / 1024 / 1024 < 2
			// if (!isJPG) {
			// 	this.$message.error('上传头像图片只能是 JPG 格式!')
			// }
			// if (!isLt2M) {
			// 	this.$message.error('上传头像图片大小不能超过 2MB!')
			// }
			// return isJPG && isLt2M
		}
	}
}
</script>

<style lang="scss" scoped>
.tag {
	/* background-color: #000; */
}
</style>	