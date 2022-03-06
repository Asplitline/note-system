<template>
	<div class="my-info">
		<Card title="个人资料">
			<div class="left">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small"
					label-width="80px" class="ruleForm">
					<el-form-item label="用户名称" prop="userName">
						<el-input v-model="ruleForm.userName" readonly></el-input>
					</el-form-item>
					<el-form-item label="电子邮箱" prop="email">
						<el-input v-model="ruleForm.email"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="phone">
						<el-input v-model="ruleForm.phone"></el-input>
					</el-form-item>
					<el-form-item label="年龄" prop="age">
						<el-input v-model="ruleForm.age" type="number"></el-input>
					</el-form-item>
					<el-form-item label="身份">
						<el-tag :type="USER_STATE_RE[ruleForm.state].type" v-if="ruleForm.state">
							{{USER_STATE_RE[ruleForm.state].text}}
						</el-tag>
					</el-form-item>
					<el-form-item label="个人简介" prop="description">
						<el-input type="textarea" v-model="ruleForm.description"></el-input>
					</el-form-item>
				</el-form>
				<div class="btns">
					<button class="btn" @click="edit">保存修改</button>
				</div>
			</div>
			<div class="right">
				<img :src="file_url(ruleForm.fileUrl)" alt=""
					onerror="this.src='http://www.bianbiangou.cn/index/ICON2.png'">
			</div>

		</Card>
	</div>
</template>

<script>
import {
	deepClone,
	validatePhone,
	validateEmail,
	file_url,
	handleMsg
} from '@/utils'
import { USER_STATE_RE } from '@/utils/global'
import Card from './card.vue'
import { editUser } from '@/api'
import { mapActions } from 'vuex'
export default {
	props: ['user'],
	components: {
		Card
	},
	mounted() {
		this.ruleForm = deepClone(this.user)
	},
	watch: {
		user(val) {
			this.ruleForm = deepClone(val)
		}
	},
	methods: {
		file_url,
		...mapActions(['getInfo']),
		edit() {
			this.$refs.ruleForm.validate(async (valid) => {
				if (!valid) return
				// console.log(this.ruleForm)
				const { success, message } = await editUser(this.ruleForm)
				handleMsg(success, message, () => {
					this.$emit('updateUser', this.ruleForm)
				})
			})
		}
	},
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
			ruleForm: {},
			rules: {
				userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
				email: [{ validator: validEmail, trigger: 'blur' }],
				phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
				age: [{ trigger: 'blur', validator: validAge }]
			},
			USER_STATE_RE
		}
	}
}
</script>

<style>
</style>