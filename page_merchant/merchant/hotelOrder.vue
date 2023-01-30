<template>
	<!-- 酒店支付页面 -->
	<page-meta :page-style="'overflow:'+(showCoupon || showArrayTime || showRule || showList?'hidden':'visible')"></page-meta>
	<view class="hotelOrder">
		<view class="order">
			<view class="order_content">
				<view class="info">
					<image class="goods_img" :src="goodsDetail.goodsPicture"></image>
					<view class="order_info">
						<view class="info_left">
							<view class="name oneHide">{{goodsDetail.goodsName}}</view>
							<view class="label">{{goodsDetail.goodsTitle}}</view>
						</view>
						<view class="info_right">
							<view class="price">
								<view class="underline">￥{{goodsDetail.underlinedPrice}}</view>
								<view class="original">￥{{goodsDetail.goodsPrice / 100}}</view>
							</view>
							<view class="step">
								<image v-if="type == 0" @click="changeNumber('reduce')" class="stepIcon" src="/static/reduce.png"></image>
								<view class="value">
									{{goodsDetail.number}}间
								</view>
								<image v-if="type == 0" @click="changeNumber('add')" class="stepIcon" src="/static/add.png"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="goodsContent">
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
		<!-- 入住信息 -->
		<view class="rowContent">
			<view class="row_title" style="background-color: #F4FEF3;">
				入住信息：
			</view>
			<view class="row_list">
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">住客姓名：</view>
					</view>
					<view class="item_right" style="width: auto;">
						<input type="text" v-model="orderForm.guestName" placeholder="请输入住客姓名">
					</view>
				</view>
				<view class="row_item">
					<view class="item_left">
						<view class="left_text">登记电话：</view>
					</view>
					<view class="item_right" style="width: auto;">
						<input v-model="orderForm.contactPhone" type="text" placeholder="请输入登记电话">
					</view>
				</view>
				<view class="row_item" @click="showArrayTime = true">
					<view class="item_left">
						<view class="left_text">预计到店：</view>
					</view>
					<view class="item_right" style="width: auto;">
						<view class="time">{{orderForm.arrivalTime}}</view>
						<view style="color: #979797;">房间将保留整晚</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="rowContent">
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
							{{goodsDetail.price}}元
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;">
					<view class="item_left" @click="showRoomList">
						<image class="row_icon" src="/static/save.png"></image>
						<view style="display: flex;white-space: nowrap;align-items: baseline;">文涛扬优惠价<u-icon v-if="goodsDetail.roomType == 0 && type == 0" name="question-circle"></u-icon></view>
					</view>
					<view class="item_right">
						<view class="calText">
							{{goodsDetail.goodsMoney}}元
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;" v-if="goodsDetail.roomType == 0 && type == 0">
					<view class="item_left">
						<image class="row_icon" src="/static/packet.png"></image>
						<view>红包/优惠券</view>
					</view>
					<view class="item_right" @click="showCouponList">
						<view class="calText">
							{{coupon}}
						</view>
					</view>
				</view>
				<view class="row_item" style="justify-content: space-between;" v-if="type != 2 && goodsDetail.roomType == 0 && type == 0">
					<view class="item_left" @click="showRule = true">
						<image class="row_icon" src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610951058676183042.png"></image>
						<view class="row_fc">积分抵扣<u-icon name="question-circle"></u-icon></view>
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
				<view class="row_item" style="justify-content: space-between;" v-if="type == 0 && goodsDetail.roomType == 0">
					<view class="item_left">
						<image class="row_icon" src="/static/discount.png"></image>
						<view>会员折扣</view>
					</view>
					<view class="item_mid">
						{{userDetail.member.memberDiscount}}折
					</view>
					<view class="item_right" style="width: 25%;">
						<view class="calText">
							{{goodsDetail.discountPrice}}元
						</view>
					</view>
				</view>
				<view class="row_btm">
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
		
		<!-- 预计到店弹窗 -->
		<u-popup :show="showArrayTime" @close="close" :round="10" :closeOnClickOverlay="true">
			<view>
				<view style="font-size: 28rpx;font-weight: bold;margin: 20rpx 0 0 20rpx;">
					到达时间:
				</view>
				<view class="timeList">
					<view :class="['timeItem',{activeTime:orderForm.arrivalTime == item}]"
						v-for="(item,time) in timeList" :key="time" @click="bindTimeChange(item)">
						{{item}}
					</view>
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
				<view class="ruleText">4、钟点房费不可使用积分抵扣</view>
				<view style="width: 100%;display: flex;justify-content: center;margin-top: 40rpx;">
					<view class="ruleButton" @click="close">
						我知道了
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- 积分抵扣规则弹窗 -->
		<u-popup :show="showList" @close="close" :round="10" >
			<view class="roomContent">
				<view class="roomTitle">
					房价明细
				</view>
				
				<view class="roomPriceList">
					<view class="roomPriceItem" :key="index">
						<view class="date">日期</view>
						<view class="price">￥{{goodsDetail.total}}</view>
					</view>
					<view class="roomPriceItem" v-for="(item,index) in goodsDetail.merchantRoomPriceList" :key="index">
						<view class="date">{{item.roomPriceDate.split(' ')[0]}}</view>
						<view class="price">{{orderForm.roomNumber}} x {{item.discountPrice}}</view>
					</view>
				</view>
				
			</view>
		</u-popup>
		
		<!-- <view class="model" v-if="modelShow">
			<view class="model_content">
				<image class="model_img" src="../../static/success.png"></image>
				<view class="model_btn" @click="goOrder">
					支付完成
				</view>
			</view>
		</view> -->
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
					goodsPicture:'',
					roomType:0,// 0 全日房 1 钟点房
					goodsName:'',// 商品名称
					goodsTitle:'',// 商品标签
					underlinedPrice:0,// 划线价
					discountMoney:0,
					averagePrice:0,// 原价
					price:0,// 总原价
					total:0,// 合计价格
					number:1,// 数量
					stock:10,// 库存
					discountPrice:0,// 总会员折扣
					totalDiscount:0,// 总优惠
					goodsMoney:0,// 文涛扬优惠价
					RbtnText:'立即购买',
				},
				userDetail:{
					member:{
						memberDiscount:8.5
					}
				},// 用户信息
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
				couponList: [],// 优惠券
				choosedCoupon: "",
				coupon:'暂无优惠券',
				check: "", // 入住时间
				checkDay: '', // 入住日期
				leave: "", // 离店时间
				leaveDay: '', // 离店日期
				week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				costTime: 1, // 住宿天数
				integralMoney:0,
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
				looading:false,// 缓冲
				timeList: [],// 到达时间选择列
				modelShow:false,
				integral:false,
				canuse: false,
				showArrayTime:false,
				showRule:false,
				showCoupon:false,
				showList:false
			};
		},
		components:{
			BtmStyle,coupon
		},
		created() {
			this.getArrayTime()
			let guestName = uni.getStorageSync('guestName')
			if(guestName){
				this.orderForm.guestName = guestName
			}
			this.getCoupon();
		},
		onLoad(options) {
			this.type = options.type
			this.orderForm.goodsId = options.id
			if (options.startTime && options.endTime) {
				this.orderForm.startTime = options.startTime
				this.orderForm.endTime = options.endTime
			} else {
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
			}
			
			this.calculateTime(this.orderForm.startTime, this.orderForm.endTime);
			this.getUserInfo()
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
						this.goodsDetail.roomAveragePrice = this.goodsDetail.roomAveragePrice / 100
						// 商品实际价格
						this.goodsDetail.averagePrice = this.goodsDetail.roomAveragePrice
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
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('用户信息',res)
				if(res.code == 200){
					this.userDetail = res.data
					this.orderForm.contactPhone = this.userDetail.phone
					this.orderForm.userId = this.userDetail.id
					this.canuse = this.userDetail.integral >= 500? true : false
					this.getGoodsDetail()
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
			// 结算订单
			async sumbitOrder(){
				let that = this;
				let telStr = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
				// console.log('数据',that.orderForm)
				if (!that.orderForm.guestName) {
					uni.showToast({
						title: '请输入住客姓名',
						icon: "none"
					})
					return
				}
				if (!(telStr.test(that.orderForm.contactPhone))) {
					uni.showToast({
						title: '登记电话输入不规范',
						icon: "none"
					})
					return
				}
				if(this.looading)return
				this.looading = true
				let confirm = ''
				if(this.type == 1){
					// 添加酒店商品推荐订单
					let obj = {
						arrivalTime:that.orderForm.arrivalTime,
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
						arrivalTime:that.orderForm.arrivalTime,
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
				// console.log("提交订单", confirm)
				if(confirm.code == 200){
					// 保存住客姓名
					uni.setStorageSync('guestName', that.orderForm.guestName)
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
						this.looading = false
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
			// 获取优惠券
			async getCoupon() {
				let that = this;
				let res = await that.$get('/coupon/user/page', {
					useState: 1,
					current: that.pageNo,
					size: 10
				})
				// console.log('优惠券列表', res)
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
				console.log('index',index)
				console.log('index',that.couponList)
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
			// 更改数量
			changeNumber(status) {
				if (status == 'reduce') {
					if (this.goodsDetail.number > 1) {
						this.goodsDetail.number--;
						this.orderForm.roomNumber = this.goodsDetail.number
						this.chargingInformation()
					}
				} else {
					if (this.goodsDetail.number < this.goodsDetail.stock) {
						this.goodsDetail.number++;
						this.orderForm.roomNumber = this.goodsDetail.number
						this.chargingInformation()
					}
				}
			},
			// 是否使用积分
			changeIntegral(value) {
				this.integral = value
				this.chargingInformation()
			},
			// 计算价格
			chargingInformation(){
				// 折扣后的价格
				let discout = 0
				if(this.type == 1 || this.type == 2){
					this.goodsDetail.price = this.goodsDetail.underlinedPrice
					this.goodsDetail.goodsMoney = this.goodsDetail.goodsPrice
					this.goodsDetail.total = this.goodsDetail.goodsPrice
					console.log('价格',)
				}else{
					if(this.goodsDetail.roomType == 0){
						// 全日房
						// 根据房价方案计算价格
						// 方案划线价
						let underPrice = 0
						// 方案优惠价
						let showPrice = 0
						// 方案总价格
						let totalPrice = 0
						// 方案总优惠折扣
						let oneDiscount = 0
						for(let i=0;i < this.goodsDetail.merchantRoomPriceList.length;i++){
							showPrice += this.goodsDetail.merchantRoomPriceList[i].goodsPrice / 100
							underPrice += this.goodsDetail.merchantRoomPriceList[i].underlinedPrice / 100
							this.goodsDetail.merchantRoomPriceList[i].discountPrice = Math.round((this.goodsDetail.merchantRoomPriceList[i].goodsPrice * 10 * (this.userDetail.member.memberDiscount / 10)) / 1000)
							totalPrice += this.goodsDetail.merchantRoomPriceList[i].discountPrice * this.orderForm.roomNumber
							oneDiscount += ((this.goodsDetail.merchantRoomPriceList[i].goodsPrice * 10) - (this.goodsDetail.merchantRoomPriceList[i].discountPrice * 1000)) / 1000
						}
						showPrice = showPrice * this.goodsDetail.number
						underPrice = underPrice * this.goodsDetail.number
						// 总原价
						this.goodsDetail.price = underPrice
						// 合计价格
						this.goodsDetail.total = totalPrice
						// 会员价格(用来跟优惠券)
						this.goodsDetail.discountMoney = showPrice
						// 文涛扬优惠价格
						this.goodsDetail.goodsMoney = showPrice
						// 合计会员折扣
						this.goodsDetail.discountPrice = oneDiscount
						
						discout = this.goodsDetail.total
					}else{
						// 钟点房
						this.canuse = false
						// 总原价
						this.goodsDetail.price = (this.goodsDetail.number * this.goodsDetail.goodsPrice) / 100
						// 文涛扬优惠价格
						this.goodsDetail.goodsMoney = this.goodsDetail.price
						// 合计价格
						this.goodsDetail.total = (this.goodsDetail.number * this.goodsDetail.goodsPrice) / 100
					}
				}
				
				// 计算该商品能消耗多少积分
				// 最高可减多少钱
				let maxReduce = Math.round((discout * 1000 * 0.2) / 1000)
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
				}
				// 使用积分
				if(this.integral){
					this.goodsDetail.total = ((this.goodsDetail.total * 1000) - (this.integralMoney * 1000))/1000
					this.orderForm.useIntegral = limitIntegrate
				}else{
					this.orderForm.useIntegral = ''
				}
				// 总优惠
				this.goodsDetail.totalDiscount = (((this.goodsDetail.price * 1000) - (this.goodsDetail.total * 1000)) / 1000)
			},
			// 获取默认到达时间
			getArrayTime(){
				let now = new Date()
				let HH = now.getHours()
				for (let i = 14; i < 24; i++) {
					if (HH < i) {
						this.timeList.push(i + ':00')
					}
				}
				let arrayTime = ['次日00:00', '次日01:00', '次日02:00', '次日03:00', '次日04:00', '次日05:00', '次日06:00']
				for (let i = 0; i < arrayTime.length; i++) {
					this.timeList.push(arrayTime[i])
				}
				this.orderForm.arrivalTime = this.timeList[0]
			},
			// 选择到达时间
			bindTimeChange(item) {
				this.orderForm.arrivalTime = item;
				this.showArrayTime = false
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
				this.costTime = this.costTime == 0? 1 : this.costTime 
			
				let eY = endTime.getFullYear();
				let eM = endTime.getMonth() + 1 >= 10 ? endTime.getMonth() + 1 : '0' + (endTime.getMonth() + 1);
				let eD = endTime.getDate() >= 10 ? endTime.getDate() : '0' + endTime.getDate();
			
				this.leaveDay = this.week[endTime.getDay()];
				this.check = String(sM) + '月' + String(sD) + '日';
				this.leave = String(eM) + '月' + String(eD) + '日';
			
				this.defaultTime = [`${sY}-${sM}-${sD}`, `${eY}-${eM}-${eD}`]
			},
			// 重写时间
			rewriteTime(time) {
				let rewrite = new Date(time);
				let YY = rewrite.getFullYear();
				let MM = rewrite.getMonth() + 1 >= 10 ? rewrite.getMonth() + 1 : '0' + (rewrite.getMonth() + 1);
				let DD = rewrite.getDate() >= 10 ? rewrite.getDate() : '0' + rewrite.getDate();
				return YY + '-' + MM + '-' + DD
			},
			close() {
				this.showCoupon = false
				this.showRule = false
				this.showList = false
				this.showArrayTime = false
			},
			showRoomList(){
				if(this.goodsDetail.roomType == 0 && this.type == 0){
					// 商品为全日房并且是普通订单
					this.showList = true
				}
			},
			// goOrder(){
			// 	uni.switchTab({
			// 		url:'/pages/order/index'
			// 	})
			// }
		}
	}
</script>
<style>
	page{
		background-color: #F6F6F6;
	}
</style>
<style lang="less" scoped>
.hotelOrder{
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
						
							.stepIcon {
								width: 36rpx;
								height: 36rpx;
							}
						}
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
	
	.timeList {
		display: flex;
		flex-wrap: wrap;
		padding: 40rpx 20rpx;
	
		.timeItem {
			width: 30%;
			font-size: 26rpx;
			color: #121212;
			display: flex;
			padding: 10rpx 0;
			justify-content: center;
			align-items: center;
			background-color: #F5F5F5;
			border-radius: 10rpx;
			margin: 8rpx 8rpx 0 0;
			border: 1px solid transparent;
		}
	
		.activeTime {
			border-color: #FB8146;
			font-weight: bold;
			color: #FB8146;
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
	.roomContent{
		font-size: 28rpx;
		padding: 20rpx 80rpx 40rpx 80rpx;
		min-height: 300rpx;
		max-height: 500rpx;
		overflow-y: auto;
		.roomTitle{
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 20rpx;
		}
		.roomPriceList{
			.roomPriceItem{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
			}
		}
	}
	
	
}
</style>
