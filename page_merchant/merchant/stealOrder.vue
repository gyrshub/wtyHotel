<template>
	<!-- 套餐支付页面 -->
	<view class="stealOrder">
		<view class="stealContent" style="padding: 16rpx 26rpx;">
			<view class="count_top">
				<image class="info_img" :src="goodsDetail.goodsPicture"></image>
				<view class="info_content">
					<view class="goods_top">
						<view class="name oneHide">
							{{goodsDetail.goodsName}}
						</view>
						<view class="price">
							<view class="line">￥{{goodsDetail.underlinedPrice}}</view>
							<view class="light">￥{{goodsDetail.goodsPrice}}</view>
						</view>
					</view>
					<view class="goods_btm">
						<view class="label">{{goodsDetail.goodsTitle}}</view>
						<view class="step">
							<image v-if="type == 0" @click="changeNumber('reduce')" class="stepIcon" src="/static/reduce.png"></image>
							<view class="value">
								{{goodsDetail.number}}
							</view>
							<image v-if="type == 0" @click="changeNumber('add')" class="stepIcon" src="/static/add.png"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="count_btm">
				<view class="count_item" v-if="type == 0">
					<view class="item_left">
						<image class="row_icon" style="width: 24rpx;padding-left: 4rpx;" src="/static/packet.png"></image>
						<view>红包/优惠券</view>
					</view>
					<view class="item_right" @click="showCouponList">
						<view class="calText">
							{{coupon}}
						</view>
					</view>
				</view>
				<view class="count_item" style="border-bottom-color: transparent;" v-if="type == 0">
					<view class="item_left" @click="showRule = true">
						<image class="row_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951058676183042.png"></image>
						<view>积分抵扣</view>
					</view>
					<view class="item_right">
						<view class="calText" style="font-size: 28rpx;display: flex;">
							<view style="margin-right: 10rpx;">
								{{canuse?`当前积分可抵扣${integralMoney}元`:'当前积分不足以抵扣'}}
							</view>
							<u-switch size="18" v-if="canuse" v-model="integral" activeColor="#FFA028" @change="changeIntegral"></u-switch>
						</view>
					</view>
				</view>
				<view class="sum">
					小计
					<view class="lightPrice">
						￥{{goodsDetail.total}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="rowContent">
			<view class="row_title" style="background-color: #FFF8F0;">
				支付方式：
			</view>
			<view class="row_list">
				<view class="row_item" style="justify-content: space-between;" @click="orderForm.paySource = 1">
					<view class="item_left">
						<image class="weixin" src="/static/weixin.png"></image>
						<view>微信支付</view>
					</view>
					<view class="item_right">
						<view :class="['cricle',{choose:orderForm.paySource == 1}]">
							<u-icon size="14" name="checkbox-mark" v-if="orderForm.paySource == 1"></u-icon>
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;" @click="orderForm.paySource = 0">
					<view class="item_left">
						<image class="yue" src="/static/yue.png"></image>
						<view>余额支付</view>
					</view>
					<view class="item_right">
						<view :class="['cricle',{choose:orderForm.paySource == 0}]">
							<u-icon size="14" name="checkbox-mark" v-if="orderForm.paySource == 0"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view style="height: 140rpx;"></view>
		<btm-style :item="goodsDetail" @rightBtn="checkType"></btm-style>
		<!-- 优惠券弹窗 -->
		<u-popup :show="showCoupon" :round="10" mode="bottom" @close="close" :closeable="true">
			<view class="couponList">
				<view class="ctitle">
					优惠券
				</view>
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="getMoreCoupon"
					style="height: 40vh;">
					<coupon v-for="(item, index) in couponList" :key="index" v-bind:item="item" types="carts"
						theme="#ff6c00" color="#ffffff" solid="#ff6c00" @changeCoupon="changeCoupon"></coupon>
				</scroll-view>
				<view style="margin-top: 40rpx;">
					<u-button text="确定" color="linear-gradient(90deg, #FFAA65 0%, #FB8146 100%)" shape="circle"
						@click="confirmCoupon"></u-button>
				</view>
			</view>
		</u-popup>
		
		<!-- 积分抵扣规则弹窗 -->
		<u-popup :show="showRule" @close="close" :round="10">
			<view class="rule">
				<view class="ruleTitle">
					积分抵扣规则
				</view>
				<view class="ruleText">1、40积分抵扣1元</view>
				<view class="ruleText">2、账户满500积分方可使用</view>
				<view class="ruleText">3、抵扣金额不超过当前会员价的20%</view>
				<view style="width: 100%;display: flex;justify-content: center;margin-top: 40rpx;">
					<view class="ruleButton" @click="close">
						我知道了
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import BtmStyle from '../components/btmStyle.vue'
	import coupon from '../components/coolc-coupon/coolc-coupon';
	export default {
		data() {
			return {
				type:0,
				goodsDetail:{
					discountMoney:0,
					goodsPicture:'',
					goodsName:'',
					goodsTitle:'',
					underlinedPrice:0,
					goodsPrice:0,
					total:'0',
					number:1,
					stock:10,
					totalDiscount:'0',
					RbtnText:'立即购买',
				},
				// 订单数据
				orderForm:{
					guestName:'',
					contactPhone:'',
					couponUserId:'',
					goodsId:'',
					paySource:1,// 支付方式 1微信支付 0会员卡余额
					roomNumber:1,
					useIntegral:'',
					userId:'',
				},
				integralMoney:0,
				couponList: [],// 优惠券
				userDetail:'',
				looading:false,// 节点
				coupon:'暂无优惠券',
				integral:false,
				canuse:false,
				showRule:false,
				showCoupon:false,
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
			};
		},
		created() {
			this.getCoupon();
		},
		onLoad(options) {
			// console.log('传值',options)
			this.type = options.type
			this.orderForm.goodsId = options.id
			let now = new Date()
			let next = new Date(new Date().getTime() + 24 * 3600000)
			let sY = now.getFullYear();
			let sM = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
			let sD = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
			let eY = next.getFullYear();
			let eM = next.getMonth() + 1 >= 10 ? next.getMonth() + 1 : '0' + (next.getMonth() + 1);
			let eD = next.getDate() >= 10 ? next.getDate() : '0' + next.getDate();
			this.orderForm.startTime = sY + "-" + sM + "-" + sD;
			this.orderForm.endTime = eY + "-" + eM + "-" + eD;
			this.getUserInfo()
		},
		components:{
			BtmStyle,coupon
		},
		methods:{
			// 获取商品详情
			async getGoodsDetail(){
				if(this.type == 1){
					let item = uni.getStorageSync('activity')
					item = JSON.parse(item)
					this.goodsDetail.goodsPicture = item.goodsPicture
					this.goodsDetail.goodsName = item.goodsName
					this.goodsDetail.goodsTitle = item.goodsTitle
					this.goodsDetail.underlinedPrice = item.goodsPrice / 100
					this.goodsDetail.goodsPrice = item.boutiquePrice / 100
					// console.log('精品推荐',item)
				}else if(this.type == 2){
					let item = uni.getStorageSync('activity')
					item = JSON.parse(item)
					this.goodsDetail.goodsPicture = item.goodsPicture
					this.goodsDetail.goodsName = item.goodsName
					this.goodsDetail.goodsTitle = item.goodsTitle
					this.goodsDetail.underlinedPrice = item.goodsPrice / 100
					this.goodsDetail.goodsPrice = item.spikePrice / 100
					// console.log('限时抢购',item)
				}else{
					let res = await this.$get('/merchant/goods/detail',{
						id:this.orderForm.goodsId,
						startTime:this.orderForm.startTime,
						endTime:this.orderForm.endTime
					})
					
					// console.log('商品详情',res)
					uni.showLoading({
						title:'加载中'
					})
					if(res.code == 200){
						uni.hideLoading()
						let obj = {
							number:1
						}
						this.goodsDetail = Object.assign(obj,res.data)
						// 商品实际价格
						this.goodsDetail.goodsPrice = this.goodsDetail.goodsPrice / 100
						// 商品划线价格
						this.goodsDetail.underlinedPrice = this.goodsDetail.underlinedPrice / 100
					}else{
						uni.hideLoading()
					}
				}
				this.goodsDetail.RbtnText = '立即购买'
				this.goodsDetail.showMsg = true
				this.chargingInformation()
			},
			async sumbitOrder(){
				let that = this;
				if(this.looading)return
				this.looading = true
				let confirm = ''
				if(this.type == 1){
					// 添加酒店商品推荐订单
					let obj = {
						guestName:that.orderForm.guestName,
						contactPhone:that.orderForm.contactPhone,
						id:that.orderForm.goodsId,
						paySource:that.orderForm.paySource,
						userId:that.orderForm.userId,
						startTime:that.orderForm.startTime,
						endTime:that.orderForm.endTime,
					}
					confirm = await this.$post('/merchant/order/boutique/add', obj)
				}else if(this.type == 2){
					// 添加酒店商品限时订单
					let obj = {
						guestName:that.orderForm.guestName,
						contactPhone:that.orderForm.contactPhone,
						id:that.orderForm.goodsId,
						paySource:that.orderForm.paySource,
						userId:that.orderForm.userId,
						startTime:that.orderForm.startTime,
						endTime:that.orderForm.endTime,
					}
					confirm = await this.$post('/merchant/order/spike/add', obj)
				}else{
					confirm = await this.$post('/merchant/order/add', that.orderForm)
				}
				if(confirm.code == 200){
					let order = await this.$post('/merchant/order/pay', {
						orderId: confirm.data,
						userId:that.orderForm.userId,
						paySource:that.orderForm.paySource,
					})
					if (order.code === 200){
						this.looading = false
						if(that.orderForm.paySource == 1){
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: order.data, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
								timeStamp: order.data.timestamp,
								nonceStr: order.data.nonceStr,
								package: order.data.packageName,
								signType: order.data.signType,
								paySign: order.data.paySign,
								success: async function(res) {
									uni.showToast({
										title:'支付成功',
										icon:'none',
										mask:true,
										success() {
											setTimeout(()=>{
												uni.switchTab({
													url:'/pages/order/index'
												})
											},1000)
										}
									})
								},
								fail: async function(err) {
									uni.showToast({
										title: "支付失败",
										icon: "none",
										mask: true,
										success() {
											setTimeout(() => {
												uni.switchTab({
													url:'/pages/order/index'
												})
											}, 1000)
										}
									})
								}
							});
						}else{
							uni.showToast({
								title:'支付成功',
								icon:'none',
								mask:true,
								success() {
									setTimeout(()=>{
										uni.switchTab({
											url:'/pages/order/index'
										})
									},1000)
								}
							})
						}
					}else{
						that.looading = false
						uni.showToast({
							title: order.msg,
							icon: "none",
							mask: true,
							success() {
								setTimeout(() => {
									uni.switchTab({
										url:'/pages/order/index'
									})
								}, 1000)
							}
						})
					}
				}else{
					this.looading = false
				}
			},
			// 确认支付方式
			checkType(value){
				let that = this
				if(that.orderForm.paySource == 0){
					uni.showModal({
						title:'温馨提示',
						content:'是否确定使用会员卡余额支付？',
						success: (res)=> {
							if(res.confirm){
								that.sumbitOrder()
							}
						},
					})
				}else{
					that.sumbitOrder()
				}
			},
			// 更改数量
			changeNumber(status) {
				if (status == 'reduce') {
					if (this.goodsDetail.number > 1) {
						this.goodsDetail.number--;
						this.orderForm.roomNumber = this.goodsDetail.number
					}
				} else {
					if (this.goodsDetail.number < this.goodsDetail.stock) {
						this.goodsDetail.number++;
						this.orderForm.roomNumber = this.goodsDetail.number
					}
				}
				this.chargingInformation()
			},
			// 计算价格
			chargingInformation(){
				if(this.type == 1 || this.type == 2){
					this.goodsDetail.total = this.goodsDetail.goodsPrice
				}else{
					// 合计价格
					this.goodsDetail.total = ((this.goodsDetail.goodsPrice * 1000) * this.goodsDetail.number) / 1000
					// 会员价格(用来跟优惠券)
					this.goodsDetail.discountMoney = this.goodsDetail.total
				}
				// 优惠价格
				let savePrice = 0
				
				// 计算该商品能消耗多少积分
				// 最高可减多少钱
				let maxReduce = Math.floor((this.goodsDetail.total * 1000 * 0.2) / 1000)
				let limitIntegrate = maxReduce * 1000 / 0.025 / 1000
				// 计算当前积分能抵扣多少钱
				if(this.userDetail.integral >= limitIntegrate){
					this.integralMoney = (limitIntegrate * 1000) * 0.025 / 1000
				}else{
					maxReduce = Math.floor((this.userDetail.integral * 1000 * 0.025) / 1000)
					limitIntegrate = maxReduce * 1000 / 0.025 / 1000
					this.integralMoney = maxReduce
				}
				// 使用优惠券
				if(this.orderForm.couponUserId){
					this.goodsDetail.total = ((this.goodsDetail.total * 1000) - (this.choosedCoupon.money * 1000)) / 1000
					savePrice += this.choosedCoupon.money
				}
				// 使用积分
				if(this.integral){
					this.goodsDetail.total = ((this.goodsDetail.total * 1000) - (this.integralMoney * 1000))/1000
					this.orderForm.useIntegral = limitIntegrate
					savePrice += this.integralMoney
				}else{
					this.orderForm.useIntegral = ''
				}
				// 总优惠
				// this.goodsDetail.totalDiscount = savePrice
				// 总优惠
				this.goodsDetail.totalDiscount = (((this.goodsDetail.underlinedPrice * 1000 * this.orderForm.roomNumber ) - (this.goodsDetail.total * 1000)) / 1000)
			},
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('用户信息',res)
				if(res.code == 200){
					this.userDetail = res.data
					this.orderForm.contactPhone = this.userDetail.phone
					this.orderForm.guestName = this.userDetail.nickName
					this.orderForm.userId = this.userDetail.id
					this.canuse = this.userDetail.integral >= 500? true : false
					this.getGoodsDetail()
				}
			},
			// 获取优惠券
			async getCoupon() {
				let that = this;
				let res = await that.$get('/coupon/user/page', {
					useState: 1,
					current: that.pageNo,
					size: 10
				})
				if (res.code === 200) {
					this.overContent = true;
					this.total = res.data.total;
					res.data.records.map(d => {
						this.coupon = '选择优惠券'
						d.id = d.id;
						d.name = d.couponName;
						d.status = d.useState;
						d.money = d.denomination / 100;
						d.limit = d.merchantIds ? `仅能在部分商家使用`:''
						d.checked = 0
						if (d.achieveMoney) {
							d.description = "满" + d.achieveMoney / 100 + "元使用"
						} else {
							d.description = "任意使用"
						}
						let start = this.rewriteTime(d.startTime)
						let end = this.rewriteTime(d.endTime)
						d.time = start + '至' + end
						return d
					})
					this.couponList = this.couponList.concat(res.data.records);
					if(this.couponList.length>0){
						this.coupon = '选择优惠券'
					}
				} else {
					if (!this.overContent) {
						this.overContent = true;
						this.pageNo--;
					}
					uni.showToast({
						title: res.msg
					})
				}
			},
			getMoreCoupon() {
				// 触底的时候请求数据，即为上拉加载更多
				let allTotal = this.pageNo * 10
				if (allTotal < this.total && this.overContent) {
					this.overContent = false;
					this.pageNo++;
					this.getCoupon();
				}
			},
			// 选择优惠券
			changeCoupon(index) {
				let that = this;
				for (let i = 0; i < that.couponList.length; i++) {
					// 总金额低于限制门槛拦截
					if (that.couponList[i].id == index) {
						if (this.goodsDetail.discountMoney < (that.couponList[i].achieveMoney / 100)) {
							return
						}
						if( that.couponList[i].merchantIds){
							let merchantArray = that.couponList[i].merchantIds.split(',')
							let flag = false
							for(let j=0;j<merchantArray.length;j++){
								if(merchantArray[j] == that.goodsDetail.merchantId){
									flag = true
								}
							}
							if(!flag){
								return
							}
						}
					}
					// 取消选择的优惠券
					if (that.couponList[i].id === index && that.couponList[i].checked === 1) {
						that.couponList[i].checked = 0;
						that.choosedCoupon = "";
						return
					} else if (that.couponList[i].id === index) {
						that.couponList[i].checked = 1;
						that.choosedCoupon = that.couponList[i];
					} else {
						that.couponList[i].checked = 0;
					}
				}
			},
			// 确认优惠券
			confirmCoupon() {
				this.showCoupon = false;
				if (!this.choosedCoupon) {
					this.coupon = '选择优惠券'
					this.orderForm.couponUserId = ''
				} else {
					this.coupon = this.choosedCoupon.money + '元优惠券';
					this.orderForm.couponUserId = this.choosedCoupon.id
				}
				this.chargingInformation()
			},
			// 显示优惠券
			showCouponList(){
				if(this.couponList.length > 0){
					this.showCoupon = true
				}
			},
			close() {
				this.showCoupon = false
				this.showRule = false
			},
			// 重写时间
			rewriteTime(time) {
				let rewrite = new Date(time);
				let YY = rewrite.getFullYear();
				let MM = rewrite.getMonth() + 1 >= 10 ? rewrite.getMonth() + 1 : '0' + (rewrite.getMonth() + 1);
				let DD = rewrite.getDate() >= 10 ? rewrite.getDate() : '0' + rewrite.getDate();
				return YY + '-' + MM + '-' + DD
			},
			// 是否使用积分
			changeIntegral(value) {
				this.integral = value
				this.chargingInformation()
			}
		}
	}
</script>
<style>
	page{
		background-color: #F6F6F6;
	}
</style>
<style lang="less" scoped>
.stealOrder{
	padding: 0 16rpx;
	box-sizing: border-box;
	.stealContent{
		margin: 20rpx 0;
		border-radius: 20rpx;
		overflow: hidden;
		background-color: #FFF;
		box-sizing: border-box;
		.count_top{
			display: flex;
			.info_img{
				width: 120rpx;
				height: 120rpx;
				flex-shrink: 0;
				margin-right: 24rpx;
			}
			.info_content{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.goods_top{
					display: flex;
					justify-content: space-between;
					.name{
						color: #3D3D3D;
						font-size: 30rpx;
						font-weight: bold;
					}
					.price{
						display: flex;
						align-items: baseline;
						.line{
							color: #979797;
							font-size: 28rpx;
							text-decoration: line-through;
						}
						.light{
							font-size: 32rpx;
							font-weight: bold;
						}
					}
				}
				.goods_btm{
					display: flex;
					justify-content: space-between;
					.label{
						width: 50%;
						font-size: 24rpx;
						color: #979797;
					}
					.step {
							display: flex;
							align-items: center;
							font-size: 40rpx;
							color: #3D3D3D;
							.value {
								white-space: nowrap;
								margin: 0 20rpx;
								font-weight: bold;
							}
						
							.stepIcon {
								width: 36rpx;
								height: 36rpx;
							}
						}
				}
			}
		}
		.count_btm{
			padding-top: 20rpx;
			.count_item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx 0;
				font-size: 28rpx;
				border-bottom: 1px solid #D8D8D8;
				.item_left{
					display: flex;
					align-items: center;
					.row_icon{
						width: 32rpx;
						height: 32rpx;
						margin-right: 20rpx;
					}
				}
				.item_right{
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.calText{
						color: #585B61;
					}
				}
			}
			.sum{
				display: flex;
				justify-content: flex-end;
				align-items: baseline;
				font-size: 28rpx;
				color: #3D3D3D;
				margin-top: 20rpx;
				.lightPrice{
					font-size: 36rpx;
					color: #FF0000;
					font-weight: bold;
				}
			}
		}
	}
	
	.rowContent{
		margin: 20rpx 0;
		border-radius: 20rpx;
		overflow: hidden;
		background-color: #FFF;
		.row_title{
			color: #0A142A;
			font-size: 32rpx;
			font-weight: bold;
			padding: 10rpx 20rpx;
			box-sizing: border-box;
		}
		.row_list{
			padding: 10rpx 20rpx;
			box-sizing: border-box;
			.row_item{
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				font-size: 32rpx;
				&:not(:last-child){
					border-bottom: 1px solid #D8D8D8;
				}
				.item_left{
					display: flex;
					align-items: center;
					.left_text{
						color: #585B61;
						margin-right: 20rpx;
					}
					.row_icon{
						width: 36rpx;
						height: 36rpx;
						margin-right: 20rpx;
					}
					.weixin{
						width: 50rpx;
						height: 46rpx;
						margin-right: 20rpx;
					}
					.yue{
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}
				.item_right{
					display: flex;
					align-items: center;
					justify-content: flex-end;
					width: 60%;
					.time{
						margin-right: 40rpx;
					}
					.cricle{
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						border: 1px solid #FFBD27;
						box-sizing: border-box;
						padding: 6rpx;
					}
					.choose{
						background-color: #FFBD27;
					}
					.calText{
						color: #585B61;
					}
				}
				.item_mid{
					background-color: #0A142A;
					color: #FFF;
					font-size: 26rpx;
					border-radius: 20rpx;
					padding: 4rpx 8rpx;
				}
			}
			.row_btm{
				display: flex;
				justify-content: flex-end;
				align-items: baseline;
				font-size: 28rpx;
				color: #3D3D3D;
				margin-top: 20rpx;
				.lightPrice{
					font-size: 36rpx;
					color: #FF0000;
					font-weight: bold;
				}
			}
		}
	}
	
	.rule{
		padding: 20rpx 20rpx 40rpx 20rpx;
		font-size: 28rpx;
		.ruleTitle{
			font-size: 40rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 8rpx;
		}
		.ruleText{
			margin-bottom: 8rpx;
		}
		.ruleButton{
			width: 50%;
			text-align: center;
			padding: 20rpx;
			border-radius: 20rpx;
			font-size: 32rpx;
			background-color: #707070;
			color: #ffffff;
			&:active{
				background-color: #5f5f5f;
				color: #eeeeee;
			}
		}
	}
	
	.couponList {
		height: 54vh;
		padding: 40rpx 32rpx;
		background-color: #F5F5F5;
	
		.ctitle {
			font-weight: bold;
			font-size: 32rpx;
			text-align: center;
			margin-bottom: 20rpx;
		}
	
		.content {
			height: 40vh;
			overflow-y: auto;
		}
	}
}
</style>
