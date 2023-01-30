<template>
	<!-- 会员等级页面 -->
	<view class="member">
		<view class="topTool">
			<image class="topImg"
				src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fmember-bg.png"></image>
			<view class="tool" :style="{ top:statusBarHeight + 10 + 'px' }">
				<image class="icon" src="/static/white_back.png" @click="toBack"></image>
			</view>
			<view class="topTitle" :style="{ top:statusBarHeight + 10 + 'px' }">会员等级</view>
		</view>
		<view class="member-content">
			<view class="member-top">
				<image class="crown"
					src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fcrown.png"></image>
				<view class="member-top-right">
					<view class="grade">
						{{memberName}}
						<!-- {{level == 1?'精英会员':level == 2?'铂金会员':level == 3?'至尊会员':'普通会员'}} -->
					</view>
					<view class="nowGrade">当前等级</view>
				</view>
			</view>
			<view class="member-item">
				<view class="member-item-title">
					<view class="member-item-title-right-left">
						<view class="line"></view>
						<view class="">我的会员</view>
					</view>
				</view>
				<view class="member-item-content">
					<view class="member-item-content-top">
						<view class="userInfo">
							<image class="userImage" :src="headImg"></image>
							<view class="info">
								<view>您好，尊贵的VIP用户</view>
							</view>
						</view>
						<view class="member-item-button" @click="toPath(`/pages/index/index`)">立即升级</view>
					</view>
					<view class="member-item-content-btm">
						<view v-if="needExperience != 'max'">
							现有
							<span class="experience">
								{{exp}}
							</span>
							成长值距离升级{{nextName}}还需
							<span class="experience">
								{{needExperience}}
							</span>
							成长值
						</view>
						<view v-if="needExperience == max">
							已到达最高会员等级
						</view>
					</view>
					<view class="line">
						<view :style="{'width':`${percent}%`}" class="activeline"></view>
					</view>
				</view>
			</view>

			<view class="member-item">
				<view class="member-item-title">
					<view class="member-item-title-right-left">
						<view class="line"></view>
						<view>等级权益</view>
					</view>
					<view class="member-item-title-right" @click="nextCurrent">
						下一级
						<u-icon size="10" name="arrow-right" color="#FB844B"></u-icon>
					</view>
				</view>

				<!-- 轮播图 -->
				<swiper class="swiper" :current="current" @change="changeCurrent" :indicator-dots="true" :duration="500"
					indicator-active-color="#FB8146">
					<swiper-item v-for="(item,index) in discountsList" :key="index">
						<view class="member-item-content">
							<view style="font-size: 30rpx;margin-bottom: 20rpx;font-weight: bold;">{{item.name}}</view>
							<view class="grade-item" v-for="(member,number) in item.memberBenefitsList" :key="number">
								<image class="gradeImage" :src="member.benefitsIcon"></image>
								<view class="gradeInfo">
									<view class="gradeInfo-title">{{member.benefitsTitle}}</view>
									<view>{{member.benefitsDescribe}}</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				exp: 0,
				memberName:'普通会员',
				needExperience: 1001,
				current: 0,
				percent: 0,
				level: 0,
				headImg: 'https://zy.xry.ink/file-api/statics/2022/10/17/58db601d2aac4689a1a24ec3cf188651_20221017104246A004.png',
				nextName: '精英会员',
				discountsList: [{
					memberBenefitsList:[]
				}]
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onLoad(options) {
			// console.log('传值', options)
			if (options) {
				this.exp = options.exp
				this.memberName = options.memberName
			}
			let img = JSON.parse(uni.getStorageSync('userInfo')).avatar
			if (img) {
				this.headImg = img
			}
			this.getMember()
		},
		methods: {
			async getMember(){
				let res = await this.$get('/member/list')
				// console.log('会员列表',res)
				if(res.code == 200){
					let memberArray = []
					for(let i=0;i<res.data.length;i++){
						let obj = {
							name:res.data[i].memberName,
							value:res.data[i].growthValue,
							memberBenefitsList:res.data[i].memberBenefitsList
						}
						memberArray.push(obj)
					}
					this.discountsList = memberArray
					for(let i=0;i<memberArray.length;i++){
						if(this.memberName == memberArray[i].name){
							// 当前等级为最高等级时
							this.current = i
							if((i+1) >= memberArray.length){
								this.needExperience = 'max'
								this.percent = 100
							}else{
								this.nextName = memberArray[i+1].name
								this.needExperience = ((memberArray[i+1].value*1000) - (this.exp * 1000))/1000
								this.percent = (this.exp / memberArray[i+1].value).toFixed(2) * 100
							}
						}
					}
				}
			},
			nextCurrent() {
				if (this.current >= this.discountsList.length - 1) return
				this.current += 1;
			},
			changeCurrent(value) {
				this.current = value.detail.current
			},
			toPath(url) {
				getApp().globalData.current = 0
				uni.switchTab({
					url: url
				})
			},
			toBack() {
				uni.switchTab({
					url: '/pages/my/index'
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
	.member {
		padding-bottom: 20rpx;

		.topTool {
			width: 100%;
			height: 480rpx;
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
				color: #121212;
				font-weight: bold;
			}
		}

		.member-content {
			margin-top: -250rpx;
			padding: 0 32rpx;
			position: relative;
			z-index: 100;

			.member-top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.crown {
					width: 250rpx;
					height: 192rpx;
				}

				.member-top-right {
					display: flex;
					flex-direction: column;
					align-items: flex-end;

					.grade {
						font-size: 80rpx;
						font-family: OPPOSans-H, OPPOSans;
						color: #121212;
						padding-bottom: 8rpx;
						border-bottom: 4rpx solid #121212;
					}

					.nowGrade {
						color: #FFFFFF;
						font-size: 22rpx;
						background-color: #121212;
						border-radius: 20rpx;
						padding: 4rpx 30rpx;
						margin-top: 28rpx;
					}
				}
			}

			.member-item {
				margin-top: 48rpx;

				.member-item-title {
					font-size: 32rpx;
					font-weight: bold;
					color: #121212;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 32rpx;
					.member-item-title-right-left {
						display: flex;
						align-items: center;

						.line {
							width: 6rpx;
							height: 28rpx;
							transform: rotate(15deg);
							background-color: #FB8146;
							border-radius: 20rpx;
							margin-right: 12rpx;
						}
					}

					.member-item-title-right {
						font-size: 22rpx;
						color: #FB8146;
						display: flex;
						align-items: center;
						border: 2rpx solid #FB8146;
						border-radius: 20rpx;
						padding: 4rpx 10rpx 4rpx 18rpx;

						.mIcon {
							width: 28rpx;
							height: 28rpx;
							margin-left: 4rpx;
						}
					}

				}

				.member-item-content {
					background: #FFFFFF;
					box-shadow: 0px 4rpx 20rpx 0px rgba(0, 0, 0, 0.0200);
					border-radius: 20rpx;
					padding: 40rpx 32rpx 46rpx 32rpx;
					.member-item-content-top {
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 2rpx solid #F5F5F5;
						padding-bottom: 32rpx;

						.userInfo {
							display: flex;
							align-items: center;

							.userImage {
								width: 84rpx;
								height: 84rpx;
								border-radius: 50%;
								flex-shrink: 0;
								margin-right: 20rpx;
							}

							.info {
								color: #121212;
								font-size: 28rpx;
								font-weight: bold;

								.time {
									color: #707070;
									font-size: 26rpx;
								}
							}
						}

						.member-item-button {
							color: #FFFFFF;
							padding: 10rpx 28rpx;
							background: linear-gradient(90deg, #FFAA65 0%, #FB8146 100%);
							border-radius: 26rpx;
							font-size: 24rpx;

							&:active {
								background: linear-gradient(90deg, #f7a362 0%, #f57c44 100%);
							}
						}
					}

					.member-item-content-btm {
						color: #121212;
						font-size: 28rpx;
						display: flex;
						align-items: center;
						padding-top: 32rpx;
						flex-wrap: wrap;

						.experience {
							font-size: 52rpx;
							font-family: Bahnschrift;
							color: #FB8146;
							margin: 0 16rpx;
						}
					}

					.grade-item {
						display: flex;
						align-items: center;

						&:not(:last-child) {
							margin-bottom: 64rpx;
						}

						.gradeImage {
							width: 84rpx;
							height: 84rpx;
							flex-shrink: 0;
							margin-right: 20rpx;
						}

						.gradeInfo {
							color: #707070;
							font-size: 24rpx;

							.gradeInfo-title {
								color: #0B0B0B;
								font-size: 28rpx;
							}
						}
					}
				}
			}
		}

		.line {
			width: 272rpx;
			height: 16rpx;
			border-radius: 20rpx;
			background-color: #FFEAED;
			position: relative;
			overflow: hidden;
			margin-top: 8rpx;

			.activeline {
				border-radius: 20rpx;
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				background: linear-gradient(90deg, #FFAA65 0%, #FB8146 100%);
				z-index: 8;
			}
		}

		.swiper {
			height: 600rpx;
			background-color: #FFF;
		}

		/deep/ uni-swiper .uni-swiper-dot {
			width: 8rpx;
			height: 8rpx;
		}

		/deep/ uni-swiper .uni-swiper-dot-active {
			width: 36rpx;
			border-radius: 20rpx;
		}

	}
</style>
<style>

</style>
