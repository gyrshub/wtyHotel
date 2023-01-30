<template>
	<!-- 钱包页面 -->
	<view class="wallet">
		<view class="topTool">
			<image class="topImg"
				src="https://zy.xry.ink/file-api/statics/2022/11/21/62bf4f9e5b814e0d9f79857653f85deb_20221121102039A467.png"></image>
			<view class="tool" :style="{ top:statusBarHeight + 10 + 'px' }">
				<image class="icon" src="/static/white_back.png" @click="toBack"></image>
			</view>
			<view class="topTitle" :style="{ top:statusBarHeight + 10 + 'px' }">我的钱包</view>
		</view>

		<view class="content">
			<view class="user-wallet">
				<view class="userInfo">
					<view class="userInfo-left">
						<image class="userImage" :src="userInfo.avatar"></image>
						<view class="userName">
							{{userInfo.nickName || ''}}
						</view>
					</view>
					<view class="userInfo-right">
						<image class="wallet-icon" src="/static/ratio.png" @click="toPath(`/pages/my/money?userId=${this.userInfo.id}`)"></image>
						<view>
							支出明细
						</view>
					</view>
				</view>
				<view style="color: #707070;font-size: 26rpx;padding: 0rpx 32rpx;">余额(元)</view>
				<view class="money">
					<view class="showMoney" @click="toPath(`/pages/my/money?userId=${this.userInfo.id}`)">
						{{money}}元
					</view>
					<view class="recharge" @click="toPath(`/pages/my/recharge?type=0&money=${money}&userId=${this.userInfo.id}`)">
						<view style="margin-right: 8rpx;">立即充值</view>
					</view>
				</view>
			</view>

			<view class="annotation">
				<view class="annotation-title">
					<view class="annotation-text">
						余额使用说明:
					</view>
					<view class="underline"></view>
				</view>
				<view class="annotation-item">1、充值金额只能在文涛扬APP内使用，不能用于其他平台。</view>
				<view class="annotation-item">2、充值金额无使用期限，但充值后无法退款，不可提现。</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				money: 0,
				userInfo:'',
				firstTime:true,// 第一次加载,
				status:0,// 0余额页面 1分销员钱包
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onShow() {
			if(!this.firstTime){
				this.getUserInfo()
			}
		},
		onLoad(options) {
			// console.log('传值',options)
			this.status = options.status
			this.getUserInfo()
		},
		methods: {
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				if(res.code == 200){
					this.firstTime = false
					this.userInfo = res.data
					this.userInfo.money = this.userInfo.money / 100
					this.money = this.userInfo.money == 0? 0 : this.userInfo.money
				}else {
					uni.showToast({
						title: res.msg
					})
				}
			},
			toPath(url) {
				uni.navigateTo({
					url: url
				})
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="less" scoped>
	.wallet {
		.topTool {
			width: 750rpx;
			height: 460rpx;
			position: relative;

			.topImg {
				width: 100%;
				height: 100%;
			}

			.tool {
				width: 100%;
				position: absolute;
				left: 0;
				z-index: 10;
				padding: 0 32rpx;
				box-sizing: border-box;

				.icon {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.topTitle {
				position: absolute;
				left: 50%;
				z-index: 10;
				transform: translateX(-50%);
				font-size: 32rpx;
				color: #FFFFFF;
			}
		}

		.content {
			padding: 0 32rpx;
			z-index: 50;
			position: relative;

			.user-wallet {
				background-color: #FFFFFF;
				border-radius: 20rpx;
				margin-top: -240rpx;

				.userInfo {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 64rpx;
					padding: 32rpx 32rpx 0 32rpx;

					.userInfo-left {
						color: #121212;
						font-size: 28rpx;
						display: flex;
						align-items: center;

						.userImage {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							margin-right: 16rpx;
						}
					}
					.userInfo-right{
						display: flex;
						flex-direction: column;
						align-items: center;
						font-size: 20rpx;
						color: #3D3D3D;
					}
				}

				.money {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 12rpx 0 32rpx 0;
					padding: 0 0 46rpx 32rpx;

					.showMoney {
						width: 60%;
						font-size: 68rpx;
						font-weight: bold;
						font-family: Bahnschrift_SemiBold;
						color: #121212;
					}

					.recharge {
						font-size: 26rpx;
						color: #DFBA8E;
						box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.302);
						padding: 16rpx 38rpx;
						border-radius: 20rpx 0 0 20rpx;
					}
				}
			}

			.annotation {
				margin-top: 48rpx;
				color: #707070;
				font-size: 26rpx;

				.annotation-title {
					font-size: 28rpx;
					color: #121212;
					position: relative;

					.annotation-text {
						position: relative;
						z-index: 10;
					}

					.underline {
						width: 176rpx;
						height: 8rpx;
						background-color: #FB8146;
						border-radius: 20rpx;
						position: absolute;
						left: 0;
						bottom: 4rpx;
						z-index: 8;
					}
				}

				.annotation-item {
					margin-top: 28rpx;
				}
			}
		}

		.wallet-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}
</style>
