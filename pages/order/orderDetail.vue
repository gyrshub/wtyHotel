<template>
	<!-- 酒店支付页面 -->
	<page-meta :page-style="'overflow:'+(showCoupon || showArrayTime || showRule?'hidden':'visible')"></page-meta>
	<view class="orderDetail">
		<view class="order">
			<view class="order_content">
				<view class="info">
					<image class="goods_img" :src="orderDetail.merchantType == 0?orderDetail.goodsPicture:orderDetail.merchantPicture"></image>
					<view class="order_info">
						<view class="info_left">
							<view class="name oneHide">{{orderDetail.merchantType == 0? orderDetail.goodsName : orderDetail.merchantName}}</view>
							<view class="label">{{orderDetail.goodsTitle}}</view>
						</view>
						<view :class="['info_right',{across:orderDetail.orderState != 10}]">
							<view class="tool_item" v-if="orderDetail.orderState != 10" @click="navigation">
								<image class="tool_icon" src="/static/navigation1.png" />
								<view>
									导航
								</view>
							</view>
							<view class="tool_item" v-if="orderDetail.orderState != 10" @click="telephone">
								<image class="tool_icon" src="/static/phone1.png" />
								<view>
									电话
								</view>
							</view>
							<view class="price" v-if="orderDetail.orderState == 10">
								<view class="underline">￥{{orderDetail.underlinedPrice}}</view>
								<view class="original">￥{{orderDetail.goodsPrice}}</view>
							</view>
							<view class="step" v-if="orderDetail.orderState == 10">
								<view class="value">
									{{orderDetail.roomNumber}}{{orderDetail.merchantType == 0?'间':'个'}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="goodsContent" v-if="orderDetail.merchantType == 0">
					<view class="time" that.detailMessage.contactNumber @click.stop="showTime = true">
						<view>
							<span class="date">{{check}}</span>
							{{checkDay}}入住
						</view>
						<view class="costTime">
							{{costTime}}晚
						</view>
						<view>
							<span class="date">{{leave}}</span>
							{{leaveDay}}离店
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 核销码 -->
		<view class="code" v-if="orderDetail.merchantType != 0">
			<view class="code_title">
				核销码：
			</view>
			<view :class="['showCode',{showText:orderDetail.orderState > 30 || orderDetail.orderState == -1}]">
				<view class="" v-for="item in codeList" :key="item">
					{{item}}
				</view>
			</view>
		</view>
		
		<!-- 入住信息 -->
		<view class="rowContent" v-if="orderDetail.orderState == 10 && orderDetail.merchantType == 0">
			<view class="row_title" style="background-color: #F4FEF3;">
				入住信息：
			</view>
			<view class="row_list">
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">住客姓名：</view>
					</view>
					<view class="item_right" style="width: auto;">
						{{orderDetail.guestName}}
					</view>
				</view>
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">登记电话：</view>
					</view>
					<view class="item_right" style="width: auto;">
						{{orderDetail.contactPhone}}
					</view>
				</view>
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">预计到店：</view>
					</view>
					<view class="item_right" style="width: auto;">
						<view class="time">{{orderDetail.arrivalTime}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="rowContent" v-if="orderDetail.orderState != 10">
			<view class="row_title" style="background-color: #F4FEF3;">
				订单信息：
			</view>
			<view class="row_list">
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">订单编号：</view>
					</view>
					<view class="item_right" style="width: auto;">
						{{orderDetail.orderNo}}
					</view>
				</view>
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">下单时间：</view>
					</view>
					<view class="item_right" style="width: auto;">
						{{orderDetail.createTime}}
					</view>
				</view>
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">订单状态：</view>
					</view>
					<view class="item_right" style="width: auto;">
						<view class="item_right" style="width: auto;">
							{{orderDetail.statusText}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 非酒店计费信息 -->
		<view class="rowContent" style="padding: 16rpx 26rpx;" v-if="orderDetail.merchantType != 0">
			<view class="count_top">
				<image class="info_img" :src="orderDetail.goodsPicture"></image>
				<view class="info_content">
					<view class="goods_top">
						<view class="name oneHide">
							{{orderDetail.goodsName}}
						</view>
						<view class="price">
							<view class="line">￥{{orderDetail.underlinedPrice * orderDetail.roomNumber}}</view>
							<view class="light">￥{{orderDetail.goodsPrice}}</view>
						</view>
					</view>
					<view class="goods_btm">
						<view class="label">{{orderDetail.goodsTitle}}</view>
						<view class="step">
							<view class="value">
								{{orderDetail.roomNumber}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="count_btm">
				<view class="count_item">
					<view class="item_left">
						<image class="row_icon" style="width: 24rpx;padding-left: 4rpx;" src="/static/packet.png"></image>
						<view>红包/优惠券</view>
					</view>
					<view class="item_right">
						<view class="calText">
							{{orderDetail.couponMoney?`优惠券抵扣${orderDetail.couponMoney}元`:'没有使用优惠券'}}
						</view>
					</view>
				</view>
				<view class="count_item" style="border-bottom-color: transparent;">
					<view class="item_left">
						<image class="row_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951058676183042.png"></image>
						<view>积分抵扣</view>
					</view>
					<view class="item_right">
						<view class="calText">
							{{orderDetail.useIntegralMoney?`积分抵扣${orderDetail.useIntegralMoney}元`:'没有使用积分抵扣'}}
						</view>
					</view>
				</view>
				<view class="sum">
					小计
					<view class="lightPrice">
						￥{{orderDetail.total}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 酒店计费信息 -->
		<view class="rowContent" v-if="orderDetail.merchantType == 0">
			<view class="row_title" style="background-color: #F4F9FF;">
				计费信息：
			</view>
			<view class="row_list">
				<view class="row_item" style="justify-content: space-between;">
					<view class="item_left">
						<image class="row_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610983618949111809.png"></image>
						<view>原价</view>
					</view>
					<view class="item_right">
						<view class="calText" style="text-decoration: line-through;">
							{{orderDetail.price}}元
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;">
					<view class="item_left">
						<image class="row_icon" src="/static/save.png"></image>
						<view>文涛扬优惠价</view>
					</view>
					<view class="item_right">
						<view class="calText">
							{{orderDetail.goodsMoney}}
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;">
					<view class="item_left">
						<image class="row_icon" src="/static/packet.png"></image>
						<view>红包/优惠券</view>
					</view>
					<view class="item_right">
						<view class="calText">
							{{orderDetail.couponMoney?`优惠券抵扣${orderDetail.couponMoney}元`:'没有使用优惠券'}}
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;">
					<view class="item_left" @click="showRule = true">
						<image class="row_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951058676183042.png"></image>
						<view class="row_fc">积分抵扣<u-icon name="question-circle"></u-icon></view>
					</view>
					<view class="item_right">
						<view class="calText" style="font-size: 28rpx;display: flex;">
							<view style="margin-right: 10rpx;">
								{{orderDetail.useIntegralMoney?`积分抵扣${orderDetail.useIntegralMoney}元`:'没有使用积分抵扣'}}
							</view>
						</view>
					</view>
				</view>
				<view class="row_item" v-if="orderDetail.orderType == 0 && orderDetail.roomType == 0" style="justify-content: space-between;border-bottom-color: transparent;">
					<view class="item_left">
						<image class="row_icon" src="/static/discount.png"></image>
						<view>会员折扣</view>
					</view>
					<view class="item_mid">
						{{orderDetail.memberDiscount}}折
					</view>
					<view class="item_right" style="width: 25%;">
						<view class="calText">
							{{orderDetail.discountPrice}}元
						</view>
					</view>
				</view>
				<view class="row_btm">
					小计
					<view class="lightPrice">
						￥{{orderDetail.total}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="rowContent" v-if="orderDetail.orderState == 10">
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
		<btm-style :item="orderDetail" @rightBtn="sumbitOrder" @leftBtn="cancelOrder"></btm-style>
		
		<!-- 积分抵扣规则弹窗 -->
		<u-popup :show="showRule" @close="close" :round="10">
			<view class="rule">
				<view class="ruleTitle">
					积分抵扣规则
				</view>
				<view class="ruleText">1、40积分抵扣1元</view>
				<view class="ruleText">2、账户满500积分方可使用</view>
				<view class="ruleText">3、抵扣金额不超过当前会员价的20%</view>
				<view class="ruleText">4、钟点房费不可使用积分抵扣</view>
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
	import BtmStyle from '../../components/btmStyle.vue'
	export default {
		data() {
			return {
				id:'',
				orderDetail:{
					orderNo:"",
					merchantType:0,// 0酒店 1美食 2娱乐 3综合
					merchantName:'',
					goodsName:'',
					goodsTitle:'',
					memberDiscount:8.5,
					underlinedPrice:0,// 划线价
					averagePrice:0,// 原价
					price:0,// 总原价
					total:0,// 合计价格
					roomNumber:1,
					roomType:0,
					number:1,
					stock:10,// 库存
					total:0,
					couponMoney:'',
					useIntegralMoney:'',
					discountPrice:0,// 总会员折扣
					totalDiscount:0,// 总优惠
					goodsMoney:0,// 文涛扬优惠价
					RbtnText:'回首页',
					createTime:'',
					orderState:-1,// （-1已取消 10待支付 11支付超时 20待确认 21确认超时 30待核销 40已核销）
					statusText:'已取消',
					arrivalTime:'14:00',
					showMsg:false
				},
				codeList:['暂','无','码'],
				// 订单数据
				orderForm:{
					arrivalTime:'',// 到店时间
					guestName:'',
					contactPhone:'',
					couponUserId:'',
					startTime:'',
					endTime:'',
					goodsId:'',
					paySource:1,// 支付方式 1微信支付 0会员卡余额
					roomNumber:1,
					useIntegral:'',
					userId:'',
				},
				check: "", // 入住时间
				checkDay: '', // 入住日期
				leave: "", // 离店时间
				leaveDay: '', // 离店日期
				startTime: "", // 开始时间戳
				endTime: "", // 离店时间戳
				week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				costTime: 1, // 住宿天数
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
				integral:false,
				canuse: false,
				showArrayTime:false,
				showRule:false
			};
		},
		components:{
			BtmStyle
		},
		onLoad(options) {
			this.id = options.id
			if (options.startTime && options.endTime) {
				this.startTime = options.startTime
				this.endTime = options.endTime
			} else {
				let now = new Date()
				let next = new Date(new Date().getTime() + 24 * 3600000)
			
				let sY = now.getFullYear();
				let sM = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
				let sD = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
			
				let eY = next.getFullYear();
				let eM = next.getMonth() + 1 >= 10 ? next.getMonth() + 1 : '0' + (next.getMonth() + 1);
				let eD = next.getDate() >= 10 ? next.getDate() : '0' + next.getDate();
			
				this.startTime = sY + "-" + sM + "-" + sD;
				this.endTime = eY + "-" + eM + "-" + eD;
			}
			this.calculateTime(this.startTime, this.endTime);
		},
		onShow() {
			this.getOrderDetail()
		},
		methods:{
			async getOrderDetail(){
				let res = await this.$get('/merchant/order/detail',{
					id:this.id
				})
				uni.showLoading({
					title:'加载中'
				})
				// console.log('订单详情',res)
				if(res.code === 200){
					uni.hideLoading()
					this.orderDetail = res.data
					this.orderDetail.goodsPicture = this.orderDetail.merchantGoods.goodsPicture
					this.orderDetail.merchantType = this.orderDetail.merchant.merchantType
					this.orderDetail.goodsName = this.orderDetail.merchantGoods.goodsName
					this.orderDetail.goodsTitle = this.orderDetail.merchantGoods.goodsTitle
					this.orderDetail.roomType = this.orderDetail.merchantGoods.roomType
					this.orderDetail.merchantName = this.orderDetail.merchant.merchantName
					this.orderDetail.merchantPicture = this.orderDetail.merchant.merchantPicture
					this.orderDetail.discountPrice = this.orderDetail.memberDiscountMoney / 100
					this.orderDetail.total = this.orderDetail.realTotalMoney / 100
					this.orderDetail.underlinedPrice = this.orderDetail.underlinedPrice / 100
					this.orderDetail.goodsPrice = this.orderDetail.goodsPrice / 100
					this.orderDetail.number = this.orderDetail.roomNumber
					this.orderDetail.price = this.orderDetail.underlinedPrice * this.orderDetail.roomNumber * this.costTime
					this.orderDetail.couponMoney = this.orderDetail.couponMoney / 100
					this.orderDetail.useIntegralMoney = this.orderDetail.useIntegralMoney / 100
					this.orderDetail.goodsMoney = (this.orderDetail.realTotalMoney / 100) + this.orderDetail.discountPrice + this.orderDetail.couponMoney + this.orderDetail.useIntegralMoney
					// 总优惠
					this.orderDetail.totalDiscount = (((this.orderDetail.price * 1000) - (this.orderDetail.total * 1000)) / 1000)
					this.orderDetail.showMsg = false
					if(this.orderDetail.writeOffCode){
						let newCode = this.orderDetail.writeOffCode.split('')
						this.codeList = newCode
					}
					if(this.orderDetail.orderState == 10){
						this.orderDetail.RbtnText = '立即购买'
						this.orderDetail.LbtnText = '取消支付'
						this.orderDetail.showMsg = true
					}else if(this.orderDetail.orderState == 40 && !this.orderDetail.isEvaluation){
						this.orderDetail.RbtnText = '去评价'
						this.codeList = ['已','使','用']
					}else if(this.orderDetail.orderState == 40 && this.orderDetail.isEvaluation){
						this.codeList = ['已','使','用']
						this.orderDetail.RbtnText = '回首页'
					}else if(this.orderDetail.orderState == -1){
						this.codeList = ['已','取','消']
						this.orderDetail.RbtnText = '回首页'
					}else{
						this.orderDetail.RbtnText = '回首页'
					}
					if(this.orderDetail.roomType == 1){
						this.orderDetail.price = this.orderDetail.realTotalMoney / 100
					}
					if(this.orderDetail.orderType != 0 ){
						this.orderDetail.price = this.orderDetail.goodsPrice
						this.orderDetail.roomNumber = 1
						this.orderDetail.number = 1
						this.orderDetail.totalDiscount = 0
					}
					
					
					// （-1已取消 10待支付 11支付超时 20待确认 21确认超时 30待核销 40已核销 50已评价）
					this.orderDetail.statusText = this.orderDetail.orderState == 10?'待支付'
					: this.orderDetail.orderState == 11?'支付超时'
					: this.orderDetail.orderState == 20?'待确认'
					: this.orderDetail.orderState == 21?'确认超时'
					: this.orderDetail.orderState == 30?'待核销'
					: this.orderDetail.orderState == 40?'已核销':'已取消'
					
					// 支付订单数据
					this.orderForm.paySource = this.orderDetail.paySource
				}else{
					uni.hideLoading()
				}
			},
			// 结算订单
			async sumbitOrder(text){
				let that = this
				if(text == '立即购买'){
					uni.showLoading({
						title:'加载中...'
					})
					let order = await this.$post('/merchant/order/pay', {
						orderId: this.orderDetail.id,
						userId:	this.orderDetail.userId,
						paySource:that.orderForm.paySource,
					})
					
					if (order.code === 200){
						uni.hideLoading()
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
												that.getOrderDetail()
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
												that.getOrderDetail()
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
										that.getOrderDetail()
									},1000)
								}
							})
						}
					}else{
						uni.hideLoading()
						uni.showToast({
							title: order.msg,
							icon: "none",
							mask: true,
							success() {
								setTimeout(() => {
									that.getOrderDetail()
								}, 1000)
							}
						})
					}
				}else if(text == '回首页'){
					uni.switchTab({
						url:'/pages/index/index'
					})
				}else if( text == '去评价'){
					uni.setStorageSync('commentPicture',this.orderDetail.goodsPicture)
					uni.navigateTo({
						url:`/pages/order/comment?userId=${this.orderDetail.userId}&id=${this.orderDetail.id}&merchantId=${this.orderDetail.merchantId}&merchantType=${this.orderDetail.merchantType}`
					})
				}
			},
			// 取消订单/申请退款
			async cancelOrder(text){
				let that = this
				if(text == '取消支付'){
					uni.showModal({
						title:'温馨提示',
						content:'是否取消订单?',
						success:async(res)=> {
							if(res.confirm){
								uni.showLoading({
									title:'加载中...'
								})
								let res = await that.$post('/merchant/order/cancel',{
									orderId:that.orderDetail.id,
									userId:that.orderDetail.userId
								})
								if(res.code == 200){
									uni.hideLoading()
									uni.showToast({
										title:'取消成功',
										icon:'none',
										mask:true
									})
									that.getOrderDetail()
								}else{
									uni.hideLoading()
								}
							}
						}
					})
				}
			},
			// 导航
			async navigation() {
				let that = this
				uni.openLocation({
					latitude: that.orderDetail.merchant.merchantLatitude,
					longitude: that.orderDetail.merchant.merchantLongitude,
					scale: 15,
					name: that.orderDetail.merchant.merchantName,
					address: that.orderDetail.merchant.merchantAddress
				});
			},
			// 打电话
			telephone() {
				let that = this;
				const res = uni.getSystemInfoSync();
				if (res.platform === 'ios') {
					let array = [that.orderDetail.merchant.contactNumber]
					if (that.orderDetail.merchant.secondContactNumber) {
						array.push(that.orderDetail.merchant.secondContactNumber)
					}
					uni.showActionSheet({
						itemList: array,
						success(res) {
							if (res.tapIndex === 0) {
								uni.makePhoneCall({
									phoneNumber: array[0]
								})
							} else if (res.tapIndex === 1) {
								uni.makePhoneCall({
									phoneNumber: array[1]
								})
							}
						}
					})
				} else {
					// secondContactNumber
					let array = [that.orderDetail.merchant.contactNumber]
					if (that.orderDetail.merchant.secondContactNumber) {
						array.push(that.orderDetail.merchant.secondContactNumber)
					}
					uni.showActionSheet({
						itemList: array,
						success(res) {
							if (res.tapIndex === 0) {
								uni.makePhoneCall({
									phoneNumber: array[0]
								})
							} else if (res.tapIndex === 1) {
								uni.makePhoneCall({
									phoneNumber: array[1]
								})
							}
						}
					})
				}
			},
			// 计算时间
			calculateTime(start, end) {
				let startTime = new Date(start);
				let endTime = new Date(end);
			
				let sY = startTime.getFullYear();
				let sM = startTime.getMonth() + 1 >= 10 ? startTime.getMonth() + 1 : '0' + (startTime.getMonth() + 1);
				let sD = startTime.getDate() >= 10 ? startTime.getDate() : '0' + startTime.getDate();
			
				this.checkDay = this.week[startTime.getDay()];
			
				this.costTime = Math.floor((endTime.getTime() - startTime.getTime()) / 24 / 3600000)
				this.costTime = this.costTime == 0 ? 1 :this.costTime
				let eY = endTime.getFullYear();
				let eM = endTime.getMonth() + 1 >= 10 ? endTime.getMonth() + 1 : '0' + (endTime.getMonth() + 1);
				let eD = endTime.getDate() >= 10 ? endTime.getDate() : '0' + endTime.getDate();
			
				this.leaveDay = this.week[endTime.getDay()];
				this.check = String(sM) + '月' + String(sD) + '日';
				this.leave = String(eM) + '月' + String(eD) + '日';
			
				this.defaultTime = [`${sY}-${sM}-${sD}`, `${eY}-${eM}-${eD}`]
			},
			close() {
				this.showCoupon = false
				this.showRule = false
				this.showArrayTime = false
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
.orderDetail{
	padding: 0 16rpx;
	box-sizing: border-box;
	.order{
		.order_content{
			display: flex;
			flex-direction: column;
			background-color: #0A142A;
			border-radius: 20rpx;
			padding: 24rpx 28rpx;
			box-sizing: border-box;
			.info{
				display: flex;
				.goods_img{
					width: 120rpx;
					height: 120rpx;
					border-radius: 10rpx;
					flex-shrink: 0;
					margin-right: 24rpx;
				}
				.order_info{
					flex: 1;
					display: flex;
					justify-content: space-between;
					overflow: hidden;
					.info_left{
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						overflow: hidden;
						.name{
							font-size: 30rpx;
							color: #FAE4A7;
						}
						.label{
							width: 80%;
							color: #A89E8A;
							font-size: 24rpx;
						}
					}
					.info_right{
						width: 43%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						.price{
							display: flex;
							align-items: baseline;
							.underline{
								font-size: 28rpx;
								color: #A89E8A;
								text-decoration: line-through;
							}
							.original{
								font-size: 32rpx;
								color: #FAE4A7;
							}
						}
						.step {
							display: flex;
							align-items: center;
							font-size: 32rpx;
							color: #FAE4A7;
							.value {
								white-space: nowrap;
								margin: 0 20rpx;
							}
						
						}
						.tool_item{
							display: flex;
							flex-direction: column;
							align-items: center;
							font-size: 18rpx;
							color: #FAE4A7;
							.tool_icon{
								width: 60rpx;
								height: 60rpx;
								margin-bottom: 10rpx;
							}
						}
					}
					.across{
						flex-direction: row;
						padding-left: 50rpx;
						box-sizing: border-box;
					}
				}
			}
			.goodsContent{
				.time {
					width: 100%;
					padding: 0 40rpx;
					border-radius: 10rpx;
					font-size: 24rpx;
					color: #707070;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					margin-top: 20rpx;
					
					.date{
						font-size: 28rpx;
						font-weight: bold;
						margin-right: 10rpx;
						color: #FAE4A7;
					}
					
					.costTime {
						color: #3D3D3D;
						border-radius: 10px;
						border: 1px solid #3D3D3D;
						padding: 0 18rpx;
						background-color: #FAE4A7;
					}
				}
			}
		}
	}
	.code{
		border-radius: 10rpx;
		padding: 12rpx 18rpx;
		box-sizing: border-box;
		font-weight: bold;
		background-color: #FFF;
		border: 1px solid #0A142A;
		margin: 20rpx 0;
		.code_title{
			font-size: 30rpx;
		}
		.showCode{
			font-size: 90rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 80rpx;
			box-sizing: border-box;
		}
		.showText{
			font-weight: normal;
			padding: 0 180rpx;
		}
	}
	.rowContent{
		margin: 20rpx 0;
		border-radius: 20rpx;
		overflow: hidden;
		background-color: #FFF;
		box-sizing: border-box;
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
	
	
}
</style>
