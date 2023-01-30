<template>
	<!-- 登录页面 -->
	<view class="login-wrapper">
		<view class="header">
			<view> 欢迎使用 文涛扬平台 </view>
		</view>
		<view class="content">
			<button type="default" v-if="consent == true" class="loginButton" open-type="getPhoneNumber"
				@getphonenumber="login">授权微信手机号</button>
			<button type="default" v-if="consent == false" class="fail" @click="showNot">授权微信手机号</button>
			<view class="attention">
			<u-checkbox-group
				 v-model="checkboxValue1"
				placement="column"
				@change="checkboxChange"
			>	
				<u-checkbox name="true"></u-checkbox>
			</u-checkbox-group>
				<view style="text-align: left;">
					我已阅读并同意
					<text @click="userAgreement = true"
						style="color: #2066E0;">《文涛扬平台用户协议》</text>，
					<text @click="privacy = true" style="color: #2066E0;">
						《文涛扬平台隐私政策》
					</text>
				</view>
			</view>
		</view>

		<u-popup :show="privacy" @close="close" mode="center" customStyle="width:80%;height:50vh;" :round="10">
			<view class="rule">
				<view class="ruleTitle">
					隐私政策
				</view>
				<view class="ruleText" v-html="privacyText"></view>
				<view style="width: 100%;display: flex;justify-content: center;">
					<view class="ruleButton" @click="close">
						我知道了
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup :show="userAgreement" @close="close" mode="center" customStyle="width:80%;height:50vh;" :round="10">
			<view class="rule">
				<view class="ruleTitle">
					用户协议
				</view>
				<view class="ruleText" v-html="userAgreementText"></view>
				<view style="width: 100%;display: flex;justify-content: center;">
					<view class="ruleButton" @click="close">
						我知道了
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				code: '',
				userInfo: {},
				privacy: false,
				userAgreement: false,
				checkboxValue1:[],
				consent:false,
				privacyText:'',
				userAgreementText:''
			};
		},
		created() {
			this.getListProtocol()
			uni.removeStorageSync('token')
			let watch = uni.getStorageSync('save')
			if(watch){
				this.checkboxValue1 = ['true']
				this.consent = true
			}
		},
		methods: {
			async getListProtocol(){
				let res = await this.$get('/base/protocol/list')
				// console.log('协议',res)
				if(res.code == 200){
					if(res.data){
						for(let i=0;i<res.data.length;i++){
							if(res.data[i].protocolType == 1){
								this.userAgreementText = res.data[i].content
							}
							if(res.data[i].protocolType == 0){
								this.privacyText = res.data[i].content
							}
						}
					}
				}
			},
			close() {
				this.privacy = false
				this.userAgreement = false
			},
			showNot(){
				uni.showToast({
					title:'请勾选同意用户协议',
					icon:'none'
				})
			},
			checkboxChange(value) {
				this.consent = value.length ? true : false
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 微信登录
			login(e) {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: async (codeRes) => {
						that.code = codeRes.code;
						if (e.detail.errMsg == "getPhoneNumber:ok") {
							uni.showLoading({
								title: "正在登录",
								icon: "none",
								mask: true
							})
							let res = await that.$API.post('/user/auth/doLogin', {
								code: that.code,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv
							})
							if (res.code == 200) {
								// console.log('结果',res)
								uni.hideLoading();
								uni.setStorageSync('token', res.data.tokenInfo.tokenValue)
								uni.setStorageSync('save', true)
								// uni.setStorageSync('openId', res.data.wxOpenId)
								uni.switchTab({
									url: '/pages/index/index'
								})
							} else {
								uni.hideLoading();
								uni.showToast({
									title:res.msg,
									icon:"none",
									mask:true,
									success(res) {
										setTimeout(()=>{
											uni.redirectTo({
												url: "/pages/login/login"
											})
										},1500)
									}
								})
								
							}
						} else {
							uni.hideLoading();
							uni.redirectTo({
								url: "/pages/login/Login"
							})
						}
					}
				})
			},
		}
	};
</script>

<style>
	.login-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.bg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
		object-fit: cover;
	}

	.goback {
		width: 90%;
		height: 40rpx;
		display: flex;
		padding-top: 80rpx;
		padding-bottom: 40rpx;
		justify-content: flex-start;
		z-index: 11;
	}

	.content {
		width: 85%;
		margin-top: 60rpx;
		margin-bottom: 60rpx;
		z-index: 11;
		text-align: center;
		font-size: 25rpx;
		color: rgba(0, 0, 0, 0.6);
	}

	.header {
		width: 85%;
		padding-top: 140rpx;
		font-size: 45rpx;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.9);
		z-index: 11;
	}

	.header-title {
		font-size: 25rpx;
		color: rgba(0, 0, 0, 0.7);
		margin-top: 20rpx;
		font-weight: bold;
	}

	.handle {
		background-color: #25374e;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		color: #fff;
		font-size: 35rpx;
		padding: 30rpx;
		margin-top: 60rpx;
	}

	.loginButton {
		padding: 10rpx;
		font-size: 35rpx;
		color: #fff !important;
		background-color: #25374e !important;
		margin-top: 60rpx;
	}
	.fail{
		padding: 10rpx;
		font-size: 35rpx;
		color: #fff !important;
		background-color: #4d4d4e !important;
		margin-top: 60rpx;
	}

	.attention {
		font-size: 24rpx;
		display: flex;
		margin-top: 40rpx;
	}

	.rule {
		height: 100%;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
	}

	.ruleTitle {
		text-align: center;
		font-weight: bold;
		margin: 20rpx 0;
	}

	.ruleButton {
		width: 50%;
		text-align: center;
		padding: 20rpx;
		border-radius: 20rpx;
		font-size: 32rpx;
		background-color: #707070;
		color: #ffffff;
	}
	.ruleText{
		height: 60%;
		overflow-y: auto;
		margin-bottom: 40rpx;
	}
	.ruleButton:active {
		background-color: #5f5f5f;
		color: #eeeeee;
	}
</style>
