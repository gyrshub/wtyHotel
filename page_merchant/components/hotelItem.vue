<template>
	<view class="hotelItem" @click="toPath(item)">
		<image class="item_img" :src="item.picture"></image>
		<view class="content">
			<view :class="['goodsName',{oneHide:item.itemStatus == 0},{twoHide:item.itemStatus == 1}]">
				{{item.goodsName}}
			</view>
			<view class="middle">
				<view class="middle_left">
					<view class="label">{{item.label}}</view>
					<view class="remind" v-if="item.itemStatus == 0">
						<view class="circle">
							<u-icon name="checkbox-mark" size="12" color="#2972DE" />
						</view>
						<view style="white-space: nowrap;">
							下单 60 分钟内可免费取消
						</view>
					</view>
				</view>
				<image class="pay_btn" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610953456882741250.png" v-if="item.isStockInsufficient && item.itemStatus == 0" @click.stop="toBuy(item)"></image>
				<image class="pay_btn" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610953616719278082.png" v-if="!item.isStockInsufficient && item.itemStatus == 0" @click.stop=""></image>
			</view>
			<view class="btm">
				<!-- <view class="btm_left">
					{{item.itemStatus == 0 ?'限时优惠':'2-3人餐'}}
					限时优惠
				</view> -->
				<view :class="['btm_right',{reversal:item.itemStatus == 1}]">
					<view class="underline">￥{{item.underlinePrice}}</view>
					<view class="lightPrice">￥{{item.price}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"hotelItem",
		props:{
			item:{
				type:Object,
				default:{
					itemStatus:0,// 0酒店类 1非酒店类
					goodsName:'狗肉火锅套餐',
					picture:'/static/logo.png',
					underlinePrice:'86',
					price:'89',
					stock:10,
					label:'含早餐·22㎡·大床·两人入住'
				}
			}
		},
		methods:{
			toPath(item){
				this.$emit('toPath',item)
			},
			toBuy(item){
				this.$emit('toBuy',item)
			}
		}
	}
</script>

<style lang="less" scoped>
.hotelItem{
	display: flex;
	background-color: #ffffff;
	padding: 28rpx;
	box-sizing: border-box;
	border-radius: 30rpx;
	margin-bottom: 18rpx;
	.item_img{
		width: 220rpx;
		height: 220rpx;
		border-radius: 20rpx;
		margin-right: 28rpx;
		flex-shrink: 0;
	}
	
	.content{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		overflow: hidden;
		.goodsName{
			color: #3D3D3D;
			font-weight: bold;
		}
		.middle{
			display: flex;
			font-size: 24rpx;
			justify-content: space-between;
			.middle_left{
				width: 78%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.label{
					color: #000;
					transform: scale(0.75);
					transform-origin: left top;
					// white-space: nowrap;
				}
				.remind{
					display: flex;
					align-items: center;
					color: #2972DE;
					transform: scale(0.75);
					transform-origin: left bottom;
					.circle{
						padding: 2rpx;
						box-sizing: border-box;
						border-radius: 50%;
						border: 1px solid #2972DE;
						margin-right: 10rpx;
					}
				}
				
			}
			.pay_btn{
				width: 74rpx;
				height: 74rpx;
				flex-shrink: 0;
			}
		}
		
		.btm{
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-direction: row-reverse;
			.btm_left{
				font-size: 24rpx;
				color: #D8D8D8;
				border: 1px solid #D8D8D8;
				padding: 4rpx 12rpx;
			}
			.btm_right{
				display: flex;
				align-items: baseline;
				.underline{
					color: #BCBFC4;
					font-size: 28rpx;
					text-decoration: line-through;
				}
				.lightPrice{
					color: #FF0000;
					font-size: 40rpx;
				}
			}
			.reversal{
				flex-direction: row-reverse;
			}
		}
	}
}
</style>