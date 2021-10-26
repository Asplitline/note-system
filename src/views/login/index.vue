<template>
	<div class="login-container">
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"
			auto-complete="off" label-position="left" :class="{'toggle':!this.toggle}">
			<div class="title-container">
				<h3 class="title">登录</h3>
			</div>
			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input ref="username" v-model="loginForm.username" placeholder="用户名"
					name="username" type="text" tabindex="1" />
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="loginForm.password"
					:type="passwordType" placeholder="登录密码" name="password" tabindex="2"
					@keyup.enter.native="handleLogin('loginForm')" />
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>
			<div class="login-btns t-btns">
				<el-button type="info" @click="toggleBtn" class="login-btn">注册</el-button>
				<el-button :loading="loading" type="success" class="login-btn"
					@click.native.prevent="handleLogin('loginForm')">登录</el-button>
			</div>

		</el-form>
		<el-form ref="registerForm" :model="registerForm" :rules="registerRules"
			class="login-form" label-position="left" :class="{'toggle':this.toggle}">
			<div class="title-container">
				<h3 class="title">注册</h3>
			</div>
			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input ref="username" v-model="registerForm.username" placeholder="用户名"
					name="username" type="text" tabindex="1" />
			</el-form-item>

			<el-form-item prop="oldPassword">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="registerForm.oldPassword"
					:type="passwordType" placeholder="新密码" name="password" tabindex="2" />
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>
			<el-form-item prop="newPassword">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="registerForm.newPassword"
					:type="passwordType" placeholder="确认密码" name="password" tabindex="2"
					@keyup.enter.native="handleLogin('registerForm')" />
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>
			<div class="login-btns t-btns">
				<el-button type="info" @click="toggleBtn" class="login-btn">登录</el-button>
				<el-button :loading="loading" type="success" class="login-btn"
					@click.native.prevent="handleLogin('registerForm')">注册</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
import { register } from '@/api'
import { mapActions, mapMutations } from 'vuex'
export default {
	name: 'Login',
	data() {
		const validatePwd = (rule, value, callback) => {
			console.log(value, this.registerForm.oldPassword)
			if (value.trim().length === 0) {
				callback(new Error('请输入确认密码'))
			} else if (value !== this.registerForm.oldPassword) {
				callback(new Error('两次输入密码不一致'))
			} else {
				callback()
			}
		}
		return {
			toggle: true,
			loginForm: {
				username: '',
				password: ''
			},
			registerForm: {
				username: '',
				oldPassword: '',
				newPassword: ''
			},
			loginRules: {
				username: [
					{ required: true, trigger: 'blur', message: '请输入用户名' }
				],
				password: [
					{ required: true, trigger: 'blur', message: '请输入登录密码' }
				]
			},
			registerRules: {
				username: [
					{ required: true, trigger: 'blur', message: '请输入用户名' }
				],
				oldPassword: [
					{ required: true, trigger: 'blur', message: '请输入新密码' }
				],
				newPassword: [{ validator: validatePwd, trigger: 'blur' }]
			},
			loading: false,
			passwordType: 'password',
			redirect: undefined
		}
	},
	watch: {
		$route: {
			handler: function (route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	methods: {
		// ...mapMutations('user', ['SET_CRTUSER']),
		...mapActions(['user/login']),
		toggleBtn() {
			this.toggle
				? this.$refs.loginForm.resetFields()
				: this.$refs.registerForm.resetFields()
			this.toggle = !this.toggle
			this.passwordType = 'password'
		},
		showPwd() {
			this.passwordType = this.passwordType === '' ? 'password' : ''
			// this.$nextTick(() => {
			// 	this.$refs.password.focus()
			// })
		},
		handleLogin(formName) {
			this.$refs[formName].validate(async (valid) => {
				if (!valid) return
				console.log(this[formName])
				this.loading = true
				if (formName === 'loginForm') {
					this['user/login'](this[formName])
						.then(({ success, message, data }) => {
							// success && this.$router.push({ path: this.redirect || '/' })
							if (success) {
								const isAuth = data.state === 1
								isAuth
									? this.$router.push({ name: 'Home' })
									: this.$router.push({ name: 'pIndex' })
							}
							// success && this.$router.push({ path: '/page' })
							!success && message && this.$message.error({ message })
						})
						.catch(({ message }) => {
							this.$message.error({ message })
						})
						.finally(() => {
							this.loading = false
						})
				} else {
					const { username: userName, newPassword: passWord } = this[formName]
					const { data, message, success } = await register({
						userName,
						passWord,
						createTime: new Date(),
						state: 0
					})
					!success && this.message.success({ message })
					this.loading = false
					if (success) {
						this.toggleBtn()
						this.$message.success({ message: '注册成功!' })
					}
				}
			})
		}
	}
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #666;
$cursor: #666;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
	.login-container .el-input input {
		color: $cursor;
	}
}

/* reset element-ui css */
.login-container {
	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		input {
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: $light_gray;
			height: 47px;
			caret-color: $cursor;

			&:-webkit-autofill {
				box-shadow: 0 0 0px 1000px $bg inset !important;
				-webkit-text-fill-color: $cursor !important;
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}
</style>

<style lang="scss" scoped>
$bg: #f0f0f0;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
	position: relative;
	min-height: 100%;
	width: 100%;
	background-color: $bg;
	overflow: hidden;
	transform-style: preserve-3d;
	perspective: 900px;
	.login-form {
		background-color: #fff;
		position: absolute;
		top: 20%;
		left: 50%;
		transition: 1s;
		backface-visibility: hidden;
		transform: perspective(900px) translateX(-50%);
		width: 520px;
		max-width: 100%;
		padding: 50px 35px 100px;
		overflow: hidden;
		transform-origin: center;
		&.toggle {
			transform: perspective(900px) translateX(-400%);
		}
	}

	.tips {
		font-size: 14px;
		color: #666;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.svg-container {
		padding: 6px 5px 6px 15px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $main-blue-dark;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
}
.login-btns {
	display: flex;

	.login-btn {
		width: 100%;
		margin-right: 0.25rem;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
