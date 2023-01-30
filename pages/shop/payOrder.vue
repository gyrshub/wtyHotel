<template>
	<view class="payOrder">
		<view class="goods_content">
			<view class="content_top">
				<image class="img" :src="goodsObj.goodsPicture"></image>
				<view class="goods_info">
					<view class="goods_name">{{goodsObj.goodsName}}</view>
					<view class="goods_money">
						<view>
							{{goodsObj.goodsType == 0?goodsObj.goodsIntegral+'积分':goodsObj.goodsType == 1? goodsObj.goodsPrice +'元':goodsObj.goodsIntegral+'积分+'+goodsObj.goodsPrice +'元'}}
						</view>
						<view class="step">
							<image @click="changeNumber('reduce')" class="stepIcon" src="/static/reduce.png"></image>
							<view class="value">
								{{goodsObj.number}}
							</view>
							<image @click="changeNumber('add')" class="stepIcon" src="/static/add.png"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="content_btm">
				<span class="price">{{costIntegral}}积分</span>小计
			</view>
		</view>
		<view class="payDetail">
			<view class="title">
				支付明细:
			</view>
			<view class="payDetail_item" v-if="goodsObj.goodsType != 1">
				<view class="item_left">
					<image class="integral_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951058676183042.png"></image>
					积分余额
				</view>
				<view class="">{{userInfo.integral}}积分</view>
			</view>
			<view class="payDetail_item" v-if="goodsObj.goodsType != 0">
				<view class="item_left">
					<image class="integral_icon" src="/static/money.png" mode=""></image>
					会员卡余额
				</view>
				<view class="">{{userInfo.money}}元</view>
			</view>
			<view class="line"></view>
			<view class="payDetail_item" style="flex-direction: row-reverse;" v-if="goodsObj.goodsType != 1">
				<view class="">
					{{costIntegral == 0?'0': '-' + costIntegral}}积分
				</view>
				<view class="payDetail_text">
					支付积分
				</view>
			</view>
			<view class="payDetail_item" style="flex-direction: row-reverse;" v-if="goodsObj.goodsType != 0">
				<view>
					{{costMoney == 0?'0': '-' + costMoney}}元
				</view>
				<view class="payDetail_text">
					支付余额(现金)
				</view>
			</view>
			<view class="payDetail_item" style="flex-direction: row-reverse;margin-top: 30rpx; " v-if="goodsObj.goodsType != 1">
				<view class="result">
					{{userInfo.integral - costIntegral }}积分
				</view>
			</view>
			<view class="payDetail_item" style="flex-direction: row-reverse;" v-if="goodsObj.goodsType != 0">
				<view class="result">
					{{userInfo.money - costMoney }}元
				</view>
			</view>
		</view>

		<view class="sendWay">
			<view class="chooseType">
				<view style="font-weight: bold;margin-right: 40rpx;">
					获取方式:
				</view>
				<view class="radionList">
					<view class="radion_item" v-for="(item,index) in radioList" :key="index" @click="radioChange(item)">
						<view class="text">
							{{item.name}}
						</view>
						<view class="cricle">
							<view class="cricle_content" v-if="form.exchangeType == item.value"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="sendWay_item" v-if="form.exchangeType == 1" >
				<view style="width: 20%;flex-shrink: 0;">
					领取时间：
				</view>
				<view class="sendWay_text">
					{{pickAddress.timeRange}}
				</view>
			</view>
			<!-- 自提 -->
			<view class="sendWay_item" v-if="form.exchangeType == 1" @click="showOut = true">
				<view style="width: 20%;flex-shrink: 0;">
					地址(可点击切换地址)：
				</view>
				<view class="sendWay_text">
					{{pickAddress.outletsAddress?pickAddress.outletsAddress:'暂无自提地址'}}
				</view>
			</view>
			<!-- 邮寄 -->
			<view class="sendWay_item" v-if="form.exchangeType == 0">
				<view style="width: 20%;flex-shrink: 0;">
					地址：
				</view>
				<input class="uni-input" v-if="form.exchangeType == 0" v-model="form.contactAddress" placeholder="请输入邮寄地址" />
			</view>
			<view class="sendWay_item" v-if="form.exchangeType != 3">
				<view style="width: 20%;flex-shrink: 0;">
					联系人：
				</view>
				<view class="sendWay_text" v-if="form.exchangeType == 1">
					{{pickAddress.outletsName?pickAddress.outletsName: '暂无自提地址'}}
				</view>
				<input class="uni-input" v-if="form.exchangeType == 0" v-model="form.contactName" placeholder="请输入联系人姓名" />
			</view>
			<view class="sendWay_item" v-if="form.exchangeType != 3">
				<view style="width: 20%;flex-shrink: 0;">
					联系方式：
				</view>
				<view class="sendWay_text" v-if="form.exchangeType == 1">
					{{pickAddress.contactNumber?pickAddress.contactNumber:'暂无自提地址'}}
				</view>
				<input class="uni-input" v-if="form.exchangeType == 0" type="number" v-model="form.contactPhone" placeholder="请输入联系方式" />
			</view>
		</view>
		<view style="height: 130rpx;"></view>
		<view class="bottom_style">
			<view class="bottom_left">
				<view class="text">合计</view>
				<view class="price">
					{{goodsObj.goodsType == 0?costIntegral+'积分':goodsObj.goodsType == 1? costMoney +'元':costIntegral+'积分+'+costMoney +'元'}}
				</view>
			</view>
			<view class="bottom_btn" @click="sumbitOrder">立即支付</view>
		</view>
		<!-- <view class="model" v-if="modelShow">
			<view class="model_content">
				<image class="model_img" src="../../static/success.png"></image>
				<view class="model_btn" @click="goback">
					支付完成
				</view>
			</view>
		</view> -->
		<u-picker :show="showOut" :columns="columns" keyName="outletsName" @confirm="changeAddress" @cancel="showOut = false"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modelShow:false,
				showOut:false,
				costIntegral: 0,
				costMoney: 0,
				columns:[],
				form:{
					userId:'',
					goodsId:'',
					paySource:'',// 支付方式 0余额 1微信
					exchangeType:3, // 顾客获取方式 0邮寄 1自提
					exchangeNum:1,
					contactName:'',
					contactPhone:'',
					contactAddress:'',
				},
				radioList:[
					{
					name:'自提',
					value:1
				},{
					name:'邮寄(不包邮)',
					value:0
				}
				],
				userInfo: {
					integral: 0,
					money: 0
				},
				goodsObj: {
					goodsPicture: '',
					goodsName: '',
					number: 1,
					stock: 1,
					goodsType: 0, // 0 纯积分 1 纯钱 2积分+钱
					goodsIntegral: 0,
					goodsPrice: 0
				},
				pickAddress: {
					timeRange:'',
					outletsAddress: '',
					outletsName: '',
					contactNumber: ''
				}
			};
		},
		created() {
			this.getUserInfo()
		},
		onLoad(options) {
			this.form.goodsId = options.id
			this.getDetail()
		},
		methods: {
			async getAddress(){
				let res = await this.$get('/integral/outlets/address/page',{
					current:1,
					size:10
				})
				// console.log('自提地址',res)
				if(res.code === 200){
					this.pickAddress = res.data.records[0]
					this.form.contactAddress = res.data.records[0].outletsAddress
					this.form.contactName = res.data.records[0].outletsName
					this.form.contactPhone = res.data.records[0].contactNumber
					let array = JSON.parse(JSON.stringify(res.data.records))
					this.columns = []
					this.columns.push(array)
				}
			},
			async getDetail(){
				let res = await this.$get('/integral/goods/detail',{
					id:this.form.goodsId
				})
				// console.log('商品详情',res)
				if(res.code == 200){
					let obj = {
						number:1,
						goodsType:0
					}
					this.goodsObj = Object.assign(obj,res.data)
					this.goodsObj.goodsPrice = this.goodsObj.goodsPrice / 100
					this.calculate()
				}
			},
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('用户信息',res)
				if(res.code == 200){
					this.userInfo = res.data
					this.userInfo.money = this.userInfo.money / 100
					this.form.userId = this.userInfo.id
				}
			},
			async sumbitOrder(){
				if(this.userInfo.integral < this.costIntegral){
					uni.showToast({
						title:'用户积分不足',
						icon:'none'
					})
					return
				}
				if(this.form.exchangeType === 3){
					uni.showToast({
						title:'请选择获取方式',
						icon:'none'
					})
					return
				}
				if(this.form.exchangeType === 0){
					if(this.form.contactAddress == '' || this.form.contactName == '' || this.form.contactPhone == ''){
						uni.showToast({
							title:'请输入邮寄信息',
							icon:'none'
						})
						return
					}
					
					let telStr = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
					if (!(telStr.test(this.form.contactPhone))) {
						uni.showToast({
							title: '联系方式输入不规范',
							icon: "none"
						})
						return
					}
				}
				if(this.form.exchangeType === 1){
					if(this.form.contactAddress == '' || this.form.contactName == '' || this.form.contactPhone == ''){
						uni.showToast({
							title:'暂无自提地点信息',
							icon:'none'
						})
						return
					}
				}
				
				this.form.exchangeNum = this.goodsObj.number
				// console.log('数据',this.form)
				if(this.form.exchangeType === 1){
					this.form.timeRange = this.pickAddress.timeRange
				}
				let res = await this.$post('/integral/order/add',this.form)
				// console.log('提交积分订单',res)
				uni.showLoading({
					title:'加载中'
				})
				if(res.code === 200){
					uni.hideLoading()
					// this.modelShow = true
					uni.showToast({
						title:'支付成功',
						icon:'none',
						success() {
							setTimeout(()=>{
								uni.switchTab({
									url:'/pages/order/index'
								})
							})
						}
					})
				}else{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					uni.hideLoading()
				}
			},
			changeAddress(value){
				// console.log('选择地址',value)
				this.pickAddress.timeRange = value.value[0].timeRange
				this.pickAddress.outletsAddress = value.value[0].outletsAddress
				this.pickAddress.outletsName = value.value[0].outletsName
				this.pickAddress.contactNumber = value.value[0].contactNumber
				this.form.contactAddress = value.value[0].outletsAddress
				this.form.contactName = value.value[0].outletsName
				this.form.contactPhone = value.value[0].contactNumber
				this.showOut = false
				// console.log('这是什么',this.columns)
			},
			radioChange(value){
				this.form.exchangeType = value.value
				if(value.value == 1){
					// 自提
					this.pickAddress.timeRange = ''
					this.pickAddress.outletsAddress = ''
					this.pickAddress.outletsName = ''
					this.pickAddress.contactNumber = ''
					this.getAddress()
				}else{
					// 邮寄
					this.form.contactName = ''
					this.form.contactPhone = ''
					this.form.contactAddress = ''
				}
			},
			changeNumber(status) {
				if (status == 'reduce') {
					if (this.goodsObj.number > 1) {
						this.goodsObj.number--;
					}
				} else {
					if (this.goodsObj.number < this.goodsObj.stock) {
						this.goodsObj.number++;
					}
				}
				this.calculate()
			},
			calculate() {
				this.costIntegral = this.goodsObj.number * this.goodsObj.goodsIntegral
				this.costMoney = this.goodsObj.number * this.goodsObj.goodsPrice
			},
			goback(){
				uni.switchTab({
					url:'/pages/order/index'
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F6F6F6;
		;
	}
</style>
<style lang="less" scoped>
	.payOrder {
		padding: 0 16rpx;

		.goods_content {
			color: #3D3D3D;
			padding: 16rpx 26rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius: 20rpx;

			.content_top {
				display: flex;

				.img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 20rpx;
					flex-shrink: 0;
					margin-right: 24rpx;
				}

				.goods_info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					flex: 1;

					.goods_name {
						font-size: 30rpx;
						font-weight: bold;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.goods_money {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 24rpx;
						color: #FF0000;
						font-weight: bold;

						.step {
							display: flex;
							align-items: center;
							font-size: 40rpx;
							color: #3D3D3D;

							.value {
								margin: 0 20rpx;
							}

							.stepIcon {
								width: 36rpx;
								height: 36rpx;
							}
						}
					}
				}
			}

			.content_btm {
				display: flex;
				flex-direction: row-reverse;
				font-size: 28rpx;
				align-items: center;
				margin-top: 20rpx;

				.price {
					font-size: 36rpx;
					color: #FF0000;
					font-weight: bold;
					margin-left: 20rpx;
				}
			}
		}

		.payDetail {
			color: #3D3D3D;
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 10rpx 26rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			font-size: 32rpx;

			.title {
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.line {}

			.payDetail_item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.item_left {
					display: flex;
					align-items: center;

					.integral_icon {
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}
				.result{
					font-weight: bold;
				}
			}

			.line {
				width: 100%;
				height: 1px;
				background-color: #D8D8D8;
				margin: 20rpx 0;
			}
		}
		
		.sendWay{
			background-color: #FFFFFF;
			padding: 10rpx 26rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin-top: 20rpx;
			font-size: 28rpx;
			.chooseType{
				display: flex;
				align-items: center;
				padding-bottom: 18rpx;
				border-bottom: 1px solid #D8D8D8;
				.radion{
					width: 32rpx;
					height: 32rpx;
				}
				.radionList{
					display: flex;
					align-items: center;
					.radion_item{
						display: flex;
						align-items: center;
						margin-right: 40rpx;
						.text{
							margin-right: 20rpx;
						}
						.cricle{
							width: 34rpx;
							height: 34rpx;
							border-radius: 50%;
							border: 1px solid #FFBD27;
							position: relative;
							.cricle_content{
								width: 20rpx;
								height: 20rpx;
								border-radius: 50%;
								background-color: #FFBD27;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-54%, -54%);
							}
						}
					}
				}
			}
			.sendWay_item{
				margin-top: 18rpx;
				display: flex;
				align-items: center;
				.sendWay_text{
					margin-left: 20rpx;
				}
			}
			
		}
		
		.bottom_style {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			background: #FFFFFF;
			padding: 26rpx 30rpx;
			box-sizing: border-box;

			.bottom_left {
				font-size: 24rpx;
				flex: 1;
				margin-right: 20rpx;

				.text {
					transform: scale(0.85);
					transform-origin: left center;
				}

				.price {
					font-size: 28rpx;
					color: #FF0000;
					font-weight: bold;
				}
			}

			.bottom_btn {
				text-align: center;
				font-size: 40rpx;
				color: #FAE4A7;
				background-color: #0A142A;
				border-radius: 20rpx;
				padding: 12rpx 60rpx;
				box-sizing: border-box;

				&:active {
					background-color: #050b18;
					color: #c7b685;
				}
			}
		}
	}
	
</style>
