<template>
	<view class="btmStyle">
		<view class="button_list">
			<view class="btmStyle_btn" @click="rightBtn(item.RbtnText)">
				{{item.RbtnText}}
			</view>
			<view class="btmStyle_btn" v-if="item.LbtnText" @click="leftBtn(item.LbtnText)">
				{{item.LbtnText}}
			</view>
		</view>
		<view class="settle" v-if="item.showMsg">
			<view class="settle_top">
				合计
					<view class="totalPrice">
						￥<span style="font-size: 40rpx;">{{item.total}}</span>
					</view>
			</view>
			<view class="settle_btm">
				<view>共{{item.number}}个</view>
				<view style="margin-left: 10rpx;">
					总优惠￥{{item.totalDiscount}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"btmStyle",
		props:{
			item:{
				type:Object,
				default:{
					totalDiscount:0,
					total:0,
					number:0,
					RbtnText:'立即购买',
					LbtnText:'取消支付'
				}
			}
		},
		methods:{
			rightBtn(text){
				this.$emit('rightBtn',text)
			},
			leftBtn(text){
				this.$emit('leftBtn',text)
			}
		}
	}
</script>

<style lang="less" scoped>
.btmStyle{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 26rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row-reverse;
		background-color: #FFF;
		box-sizing: border-box;
		.button_list{
			display: flex;
			flex-direction: row-reverse;
			.btmStyle_btn{
				color: #FAE4A7;
				font-size: 36rpx;
				border-radius: 20rpx;
				background-color: #0A142A;
				padding: 12rpx 20rpx;
				margin-left: 20rpx;
			}
		}
		.settle{
			width: 40%;
			font-size: 20rpx;
			.settle_top{
				display: flex;
				align-items: baseline;
				.totalPrice{
					font-size: 28rpx;
					color: #F00;
					margin-left: 10rpx;
					font-weight: bold;
				}
			}
			.settle_btm{
				display: flex;
				color: #979797;
			}
		}
	}
</style>