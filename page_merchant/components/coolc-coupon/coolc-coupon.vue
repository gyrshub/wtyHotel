<template>
	<view class="coupon-item" @click="changeCoupon(item.id)">
		<view class="coupon-money">
			<view class="layof" :style="{color:theme}">
				<view style="font-size: 16rpx;text-align: start;">
					￥
				</view>
				<view style="line-height: 52rpx;">
					{{item.money}}
				</view>
			</view>
			<view class="end_time">{{item.description}}</view>
		</view>
		<view class="rightInfo">
			<view class="info_left">
				<view class="couponName">{{item.name}}</view>
				<view class="couponIntroduce">{{item.limit}}</view>
				<view class="couponTime">
					{{item.time}}
				</view>
			</view>
			<view class="info_right">
				<view class="circle" v-show="!item.checked"></view>
				<image class="chooseImg" src="/static/choosed.png" v-show="item.checked"></image>
			</view>
		</view>
		<view class="stamp">
			{{status == '0'?'未使用':status == '1'?'已使用':'已过期'}}
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {

			}
		},
		props: {
			item: {
				type: Object
			},
			types: {
				type: String,
				default: ''
			},
			theme: {
				type: String,
				default: '#ff9000'
			},
			solid: {
				type: String,
				default: '#ffffff'
			},
			color: {
				type: String,
				default: '#ff9000'
			},
			status: {
				type: String,
				default: '0'
			}
		},
		methods: {
			changeCoupon(index) {
				this.$emit('changeCoupon', index)
			}
		}
	}
</script>

<style lang='scss'>
	.coupon-item {
		width: 100%;
		height: auto;
		display: table;
		border-radius: 10upx;
		padding: 34rpx 32rpx 34rpx 0;
		margin-top: 22upx;
		border: 1px solid #eeeeee;
		position: relative;
		box-sizing: border-box;
		background-color: white;
		overflow: hidden;
		.coupon-money {
			width: 208upx;
			height: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			float: left;
			padding: 26upx 20upx 26upx 0;
			border-style: none dotted none none;
			border-color: #eeeeee;
			/* width:465upx; */
			.nick {
				width: 100%;
				height: 50upx;
				line-height: 30upx;
				font-size: 24upx;
				color: #999999;
			}

			.tit {
				width: 100%;
				height: 50upx;
				line-height: 50upx;
				font-size: 24upx;
				color: #999999;
			}

			.demand {
				width: 100%;
				height: 30upx;
				line-height: 30upx;
				font-size: 24upx;
				color: #999999;
			}

			.layof {
				height: 48upx;
				font-size: 52upx;
				color: #ff9000;
				font-weight: bold;
				display: flex;
			}

			.end_time {
				height: 30upx;
				margin-top: 6rpx;
				font-size: 24upx;
				color: #999999;
			}
		}
		.stamp{
			font-size: 26rpx;
			color: #999999;
			padding: 20rpx;
			position: absolute;
			top: 50%;
			left: 60%;
			transform:  rotate(30deg);
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #999999;
			z-index: 10;
			&::after{
				width: 70rpx;
				height: 70rpx;
				padding: 20rpx;
				content: '';
				position: absolute;
				border: 1px solid #999999;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				border-radius: 50%;
			}
		}
	}

	.coupon-item:after {
		width: 40upx;
		height: 20upx;
		position: absolute;
		left: 208upx;
		top: -1px;
		border-radius: 0 0 40upx 40upx;
		content: "";
		display: block;
		background: #F5F5F5;
		border: 1px solid #eeeeee;
		border-top: 0px;
	}

	.coupon-item:before {
		width: 40upx;
		height: 20upx;
		position: absolute;
		left: 208upx;
		bottom: -1px;
		border-radius: 40upx 40upx 0 0;
		content: "";
		display: block;
		background: #F5F5F5;
		border: 1px solid #eeeeee;
		border-bottom: 0px;
	}
</style>
<style lang="less">
	.rightInfo {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 0 58rpx;

		.info_left {
			color: #999999;

			.couponName {
				font-size: 28rpx;
				color: #0B0B0B;
			}

			.couponIntroduce {
				font-size: 24rpx;
				margin: 4rpx 0;
			}

			.couponTime {
				font-size: 24rpx;
				transform: scale(0.83);
				// margin-left: -26rpx;
				transform-origin: 0 0
			}
		}

		.info_right {
			width: 36rpx;
			height: 36rpx;
			flex-shrink: 0;

			.circle {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				border: 2rpx solid #DDDDDD;
			}

			.chooseImg {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
