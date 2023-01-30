<template>
	<!-- 充值页面 和 提现页面 -->
	<view class="recharge">
		<view class="showMoney">
			<view>{{type == 0?'可用余额':'可提现金额'}}(元)</view>
			<view class="money">{{money}}</view>
		</view>
		
		<view class="rechargeMoney">
			<view>{{type == 0?'充值':'提现'}}金额</view>
			<view class="value">
				<view style="font-size: 64rpx;">
					￥
				</view>
				<view style="font-size: 40rpx;margin-right: 28rpx;">
					|
				</view>
				<view style="width: 60%;">
					<view class="showText" v-if="!showInput">
						{{rechargeMoney}}
					</view>
					<u--input
					  :placeholder="placeholder"
					  border="none"
					  :clearable="false"
					  type="number"
					  v-model="rechargeMoney"
					  v-if="showInput"
					  :fontSize="18"
					></u--input>
				</view>
			</view>
			<view class="mode" v-if="type == 0">
				<view>支付方式</view>
				<view class="mode-right">
					<image class="weixin" src="/static/weixin.png"></image>
					<view class="weixin-text">
						微信
					</view>
				</view>
			</view>
			<view class="moneyList">
				<view :class="['moneyItem',{active:selected === index}]" v-for="(money,index) in moneyList" :key="index" v-if="type == 0" @click="switchMoney(money,index)">
					{{money}}
				</view>
			</view>
			<view class="rechargeMoney-btn">
				<u-button :text="buttonText"
					color="linear-gradient(90deg, #FFAA65 0%, #FB8146 100%)" shape="circle" @click="confirmMoney"></u-button>
			</view>
		</view>
		
		<view class="annotation" v-if="type == 0">
			<view class="annotation-title">
				余额说明:
			</view>
			<view class="annotation-item">1、充值金额只能在本APP内使用，不能用于其他平台。</view>
			<view class="annotation-item">2、充值金额无使用期限，但充值后无法退款，不可提现。</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rechargeMoney:'500',
				money:0,
				showInput:false,
				selected:0,
				type:0,// 0 充值 1 提现
				placeholder:'请输入充值金额',
				buttonText:'确认充值',
				moneyList:['500','1000','2000','5000','10000','其他'],
				userInfo:'',
				showType:10,
				userId:''
			};
		},
		onLoad(options) {
			this.userId = options.userId
			this.type = options.type;
			this.money = Number(options.money) == 0 ? 0 : Number(options.money)
			if(this.type == 1){
				this.placeholder = '提现金额最少50元';
				this.buttonText = '提现'
				this.rechargeMoney = '';
				this.showInput = true;
				uni.setNavigationBarTitle({
					title:'提现'
				})
			}
		},
		methods:{
			switchMoney(item,index){
				this.selected = index;
				if(item!='其他'){
					this.rechargeMoney = item;
					this.showInput = false;
				}else{
					this.rechargeMoney = '';
					this.showInput = true;
				}
			},
			async confirmMoney(){
				if(this.type == 0){
					let res = await this.$post('/user/recharge',{
						money:this.rechargeMoney * 100,
						userId:this.userId
					})
					// console.log('充值',res)
					if(res.code == 200){
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: res.data, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
							timeStamp: res.data.timestamp,
							nonceStr: res.data.nonceStr,
							package: res.data.packageName,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success: async function(res) {
								uni.showToast({
									title: "支付成功",
									icon: "none",
									mask:true,
									success() {
										setTimeout(()=>{
											uni.switchTab({
												url:'/pages/my/index'
											})
										},1000)
									}
								})
							},
							fail: function(err) {
								uni.showToast({
									title: "支付失败",
									icon: "none",
									mask:true,
									success() {
										setTimeout(()=>{
											uni.navigateBack({
												delta: 1
											})
										},1000)
									}
								})
							}
						});
					}
				}else{
					if(this.rechargeMoney == ''){
						uni.showToast({
							title:'请输入提现金额',
							icon:"none"
						})
						return
					}
					let res = await this.$post('/salesman/withdraw',{
						money:this.rechargeMoney * 100,
						userId:this.userId
					})
					
					// console.log('提现',res)
					if(res.code == 200){
						uni.showToast({
							title: "提交成功",
							icon: "none",
							mask:true,
							success() {
								setTimeout(()=>{
									uni.switchTab({
										url:'/pages/my/index'
									})
								},1000)
							}
						})
					}
					
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
</style>
<style lang="less" scoped>
.recharge{
	.showMoney{
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		margin: 32rpx 0 52rpx 0;
		.money{
			font-size: 56rpx;
			font-family: Bahnschrift;
			color: #FB8146;
			margin-left: 24rpx;
		}
	}
	
	.rechargeMoney{
		padding: 32rpx 32rpx 48rpx 32rpx;
		background-color: white;
		border-radius: 20rpx;
		.value{
			margin: 48rpx 0 48rpx 0;
			padding: 0 0 32rpx 0;
			display: flex;
			align-items: center;
			color: #121212;
			border-bottom: 2rpx solid #F5F5F5;
		}
		
		.mode{
			color: #707070;
			font-size: 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.mode-right{
				display: flex;
				align-items: center;
				color: #121212;
				.weixin{
					width: 36rpx;
					height: 36rpx;
					margin-right: 8rpx;
				}
				.weixin-text{
					display: flex;
					align-items: center;
				}
			}
			
		}
		.moneyList{
			display: flex;
			flex-wrap: wrap;
			margin-top: 20rpx;
			.moneyItem{
				width: 30%;
				padding: 14rpx 0;
				text-align: center;
				font-size: 40rpx;
				border: 1px solid #999999;
				border-radius: 10rpx;
				margin: 10rpx 10rpx 0 0;
			}
			.active{
				border-color: #FB8146;
				color: #FB8146;
			}
		}
		.rechargeMoney-btn{
			padding: 0 16rpx;
			margin-top: 64rpx;
		}
	}
	
	.annotation{
		margin-top: 48rpx;
		color: #707070;
		font-size: 26rpx;
		padding: 0 32rpx;
		.annotation-title{
			font-size: 28rpx;
			color: #121212;
			position: relative;
		}
		.annotation-item{
			margin-top: 28rpx;
		}
	}
	.showText{
		color: #121212;
		font-size: 36rpx;
	}
}
</style>
