<template>
	<page-meta :page-style="'overflow:'+(showGetImage?'hidden':'visible')"></page-meta>
	<!-- 首页 -->
	<view class="home">
		<view class="stabar" :style="{ height: statusBarHeight + 10 + 'px' }"></view>
		<view class="topTitle">文涛扬新连锁</view>
		<swiper class="headImage" circular :autoplay="true" :interval="5000">
			<swiper-item v-for="(item,index) in carouselList" :key="index" @click="toBanner(item)">
				<image class="topImg" :src="item.picture" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<!-- 搜索工具 -->
		<view class="search_tool">
			<view class="search_list">
				<view class="search_item" v-for="(item,index) in searchList" :key="index" @click="changeStatus(item,index)">
					<image class="icon" :src="item.picture"></image>
					<view :class="['search_text',{activate:status == index}]">
						{{item.name}}
					</view>
				</view>
			</view>

			<view class="showContent">
				<!-- 位置 -->
				<view class="btmItem local" v-if="status == 0">
					<view class="local_left"
						@click="toPath(`/pages/home/findHotel?nowLocal=${location}&address=${addressInfo}`)">
						<view class="showlocal">
							<view class="localContent">
								<view class="province">{{province}},</view>
								<view class="addressDetail">{{location}}</view>
							</view>
						</view>
						<image class="homeicon"
							src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fmore.png">
						</image>
					</view>
					<view class="local_right" @click="getAddress">
						<view style="">
							{{locationText}}
						</view>
						<image class="homeicon" style="margin-left: 10rpx;"
							src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fsite.png">
						</image>
					</view>
				</view>
				<!-- 入住时间 -->
				<view class="btmItem time" v-if="status == 0">
					<view class="time_left" @click="showTime = true">
						<view class="chooseTime">
							<view class="title">入住</view>
							<view style="font-weight: bold;">{{check}}<span
									style="font-size: 24rpx;margin-left: 12rpx;">{{checkDay}}</span></view>
						</view>
						<view class="time-line"></view>
						<view class="chooseTime">
							<view class="title">离店</view>
							<view style="font-weight: bold;">{{leave}}<span
									style="font-size: 24rpx;margin-left: 12rpx;">{{leaveDay}}</span></view>
						</view>
					</view>
					<view class="time_right">
						共{{costTime}}晚
						<image class="homeicon"
							src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fmore.png">
						</image>
					</view>
				</view>

				<!-- 关键字 -->

				<view class="btmItem" v-if="status == 0">
					<u-input placeholder="关键字/位置/品牌/酒店名" border="none" prefixIcon="search"
						prefixIconStyle="font-size: 44rpx;color: #999999" suffixIcon="arrow-right"
						suffixIconStyle="color: #909399;font-size: 28rpx;" fontSize="32rpx" v-model="keyword"></u-input>
				</view>

				<!-- 价格 -->

				<view class="btmItem" style="display: flex;justify-content: space-between;align-items: center;"
					@click="showPrice = true" v-if="status == 0">
					<view
						style="color: #999999;display: flex;justify-content: space-between;align-items: center;flex: 1;">
						<view>
							{{priceText}}
						</view>
					</view>
					<image class="homeicon"
						src="https://jiudian-1313125514.cos.ap-guangzhou.myqcloud.com/jiudianxiangmu%2Fmore.png">
					</image>
				</view>
				<view class="showList" v-if="status != 0">
					<view class="notGoods" v-if="topGoodsList.length == 0">
						暂无商品
					</view>
					<goods-item @toPath="toMerchantDetail(item)" :backGround="backGround" v-for="(item,index) in topGoodsList" :key="index" :item="item">
					</goods-item>
				</view>
				<u-button @click="clickBtn" color="#081831" shape="circle" customStyle="marginTop:20rpx;">
					{{status == 0?'查找':'查看更多'}}
					<u-icon v-if="status != 0" size="15" name="arrow-right" color="#FFFFFF"></u-icon>
				</u-button>
			</view>
		</view>

		<view class="activity">
			<view class="activity_title">
				<view class="title_left">
					限时抢购
				</view>
				<view class="more" @click="toPath(`/page_merchant/merchant/limitBuy?longitude=${longitude}&latitude=${latitude}&startTime=${startTime}&endTime=${endTime}`)">
					查看更多
					<u-icon size="12" name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="goods_list">
				<view class="notGoodsList" v-if="goodsList.length == 0">
					当前时段暂无限时抢购
				</view>
				<goods-item @toPath="toActivity(item,0)" :backGround="backGround" v-for="(item,index) in goodsList" :key="index" :item="item">
				</goods-item>
			</view>
		</view>
		<view class="activity">
			<view class="activity_title">
				<view class="title_left">
					精品推荐
				</view>
				<view class="more" @click="toPath(`/page_merchant/merchant/recommend?longitude=${longitude}&latitude=${latitude}&startTime=${startTime}&endTime=${endTime}`)">
					查看更多
					<u-icon size="12" name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="goods_list">
				<view class="notGoodsList" v-if="recommedList.length == 0">
					暂无精品推荐
				</view>
				<goods-item @toPath="toActivity(item,1)" :backGround="backGround" v-for="(item,index) in recommedList" :key="index" :item="item">
				</goods-item>
			</view>
		</view>
		<view style="height: 170rpx;"></view>
		<TarBar :current="0"></TarBar>

		<!-- 日期范围 -->
		<u-calendar :defaultDate="defaultTime" :minDate="minDate" :show="showTime" mode="range" @confirm="confirmTime" @close="showTime=false"
			:closeOnClickOverlay="true" :allowSameDay="true"></u-calendar>

		<!-- 滑动价格 -->
		<u-popup :show="showPrice" mode="bottom" @close="showPrice = false" :round="10">
			<view class="popupStyle">
				<view class="Price_title">
					价格
					<view class="clear" @click="reWrite">
						清空
					</view>
				</view>

				<!-- 滑块 -->
				<view class="slider">
					<view>
						<slider-range :value="sliderList" :min="0" :max="1100" :step="50" :bar-height="3"
							:block-size="26" background-color="#EEEEF6" active-color="#FF6B00" :format="format"
							:decorationVisible="true" @change="handleRangeChange"></slider-range>
					</view>
				</view>

				<!-- 价格区域 -->
				<view class="area">
					<view :class="['priceArea',{priced:choosePriceType === 0}]" @click="changPrice(0,150,0)">
						￥0-150
					</view>
					<view :class="['priceArea',{priced:choosePriceType === 1}]" @click="changPrice(150,300,1)">
						￥150-300
					</view>
					<view :class="['priceArea',{priced:choosePriceType === 2}]" @click="changPrice(300,450,2)">
						￥300-450
					</view>
					<view :class="['priceArea',{priced:choosePriceType === 3}]" @click="changPrice(450,600,3)">
						￥450-600
					</view>
					<view :class="['priceArea',{priced:choosePriceType === 4}]" @click="changPrice(600,1000,4)">
						￥600-1000
					</view>
					<view :class="['priceArea',{priced:choosePriceType === 5}]" @click="changPrice(1000,1100,5)">
						￥1000以上
					</view>
				</view>
				<u-button @click="confirmPrice" text="完成" color="#081831" shape="circle"></u-button>
			</view>
		</u-popup>
		<view style="position: absolute;top: 0;left: 0;z-index: 60;width: 100vw;height: 100vh;background-color: rgb(0,0,0,.5);" v-if="showGetImage">
			<view style="position: relative;display: flex;flex-direction: column;justify-content: center;align-items: center;width: 100vw;height: 100vh;">
				<image @click.stop="clickPopup" style="width: 580rpx;height: 700rpx;display: block;" :src="popupDetail.popupPicture"></image>
				<image @click.stop="closePopup" style="width: 68rpx;height: 68rpx;margin-top: 40rpx;" src="/static/close.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import amap from '@/static/js/amap-wx.130.js';
	import TarBar from '../../components/tarbar/tarbar.vue'
	import GoodsItem from '../../components/goodsItem/goodsItem.vue'
	import SliderRange from '../../components/slider_range/index.vue'
	export default {
		data() {
			return {
				userId:'',
				userDetail:'',
				popupDetail:'',
				popupList:[],
				showGetImage:false,
				province: '广西省',
				location: "南宁市",
				longitude:113.122532,
				latitude:23.009475,
				addressInfo: '',
				status: 0, // 0酒店 1美食 2娱乐 3综合
				showTime: false,
				showPrice: false,
				keyword: '',
				priceText: '请选择价格',
				price: 0, // 价格
				backGround: '#F6F6F6',
				locationText: '当前位置',
				check: "", // 入住时间
				checkDay: '', // 入住日期
				leave: "", // 离店时间
				leaveDay: '', // 离店日期
				startTime: "",
				endTime: "",
				week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				costTime: 1, // 住宿天数
				low: "",
				high: "",
				max: 1100,
				min: 0,
				sliderList: [0, 150],
				choosePriceType: 0,
				leftTip: false,
				rightTip: false,
				amapPlugin: null,
				key: "8cea4511e2a268302fc924319f9ebf00",
				searchList: [{
						name: '酒店',
						picture: '/static/hotel2.png'
					},
					{
						name: '美食',
						picture: '/static/food2.png'
					},
					{
						name: '娱乐',
						picture: '/static/recreation2.png'
					},
					{
						name: '综合',
						picture: '/static/synthetical.png'
					}
				],
				carouselList: [
					{
						picture:'',
					}
				],
				topGoodsList: [
					{
						distance: '0m',
						label: '',
						merchantType: 1, // 商家类型 0酒店 1美食 2娱乐 3积分
						merchantName: '',
						goodsName: '',
						costs: '￥0',
						score: '5.0',
						createTime: '',
						orderNo: '',
						picture: '',
						itemType: 1, // 组件类型 0订单设计样式 1首页样式 2活动广场样式
						sold: 0
					}
				],
				goodsList: [],
				recommedList: [],
				statusBarHeight: 0,
				timeList: ['16:00', '18:00', '20:00', '22:00'],
				searchText:'01:00',
				nowTime: 0, // 到达特定时间才加1
				notFirst:'',
				loading:false,
				defaultTime:["2023-01-01", "2023-01-02"],
				minDate:'',
				popupLoad:false,
			}
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			this.getTime()
		},
		onLoad(options) {
			if (options.scene) {
				let obj = decodeURIComponent(options.scene)
				uni.setStorageSync('superior',obj)
			}
			let location = uni.getStorageSync('location')
			if(location){
				location = JSON.parse(location)
				this.longitude = location.longitude
				this.latitude = location.latitude
				this.province = location.province
				this.location = location.location
			}
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});
			this.getAddress()
			this.getBanner()
		},
		onShow() {
			if(this.notFirst == true){
				this.getLimitList()
			}else if(this.notFirst == false){
				this.getBanner()
			}
		},
		components: {
			TarBar,
			GoodsItem,
			SliderRange
		},
		methods: {
			async searchMerchant(merchantType){
				this.topGoodsList = []
				let res = await this.$get('/merchant/search/page',{
					current:1,
					size:3,
					longitude:this.longitude,
					latitude:this.latitude,
					merchantType:merchantType
				})
				// console.log('前三个商家商品',res)
				if(res.code == 200){
					res.data.records.map(d=>{
						d.itemType = 1
						d.createTime = d.createTime.replace(/-/g,'.')
						d.score = d.score? (d.score).toFixed(1) : '5.0'
						d.sold = d.salesNum
						d.label = d.merchantLabelName
						d.costs = '￥'+ d.goodsPrice / 100
						d.picture = d.merchantPicture
						if(d.locationDistance >= 1000){
							d.distance = d.locationDistance / 1000 + 'km'
						}else{
							d.distance = d.locationDistance + 'm'
						}
					})
					this.topGoodsList = res.data.records
				}
			},
			async getBanner(){
				if(this.loading)return
				this.loading = true
				this.notFirst = false
				let res = await this.$get('/base/app/carousel/list')
				// console.log('轮播图',res)
				if(res.code == 200){
					this.loading = false
					this.carouselList = res.data || []
					this.getLimitList()
				}else{
					this.loading = false
				}
			},
			// 获取限时抢购商品
			async getLimitList(){
				this.checkTime()
				let obj = {
					current:1,
					size:5,
					hour:this.searchText,
					latitude:this.latitude,
					longitude:this.longitude
				}
				let res = await this.$get('/merchant/spike/page',obj)
				// console.log('限时抢购',res)
				this.notFirst = true
				if(res.code == 200){
					// 调用绑定身份方法
					this.bindType()
					if(res.data){
						res.data.records.map(d=>{
							d.itemType = 2
						})
						this.dataDispose(res.data.records,0)
						this.goodsList = res.data.records
					}
					this.getRecommendList()
				}
			},
			// 获取精品推荐商品
			async getRecommendList(){
				let res = await this.$get('/merchant/boutique/page',{
					current:1,
					size:5,
					latitude:this.latitude,
					longitude:this.longitude
				})
				// console.log('精品推荐',res)
				if(res.code == 200){
					if(res.data){
						res.data.records.map(d=>{
							d.itemType = 2
						})
						this.dataDispose(res.data.records,1)
						this.recommedList = res.data.records
					}
					this.getUserInfo()
				}
			},
			async getPopup(){
				let res = await this.$get('/popup/list')
				// console.log('弹窗',res)
				if(res.code == 200){
					let array = []
					res.data.map(d=>{
						if(d.popupState){
							// 把所有启动的弹窗集中起来
							array = array.concat(d)
						}
					})
					this.popupList = array
					if(this.popupList.length>0){
						// 把第一个启动的弹窗赋予
						this.popupDetail = this.popupList[0]
						this.popupDetail.number = 0
						this.showGetImage = true
					}
				}
			},
			async clickPopup(){
				let that = this
				if(this.popupLoad) return
				this.popupLoad = true
				let res = await this.$post('/popup/user/receive',{
					userId:this.userId,
					popupId:this.popupDetail.id
				})
				if(res.code == 200){
					this.popupLoad = false
					if(this.popupDetail.popupType == 3){
						that.showGetImage = false
						setTimeout(()=>{
							that.showGetImage = true
							that.closePopup()
						},2000)
					}else{
						that.showGetImage = false
						uni.showToast({
							title:'领取成功',
							icon:'none',
							mask:true,
							duration:2000,
							success() {
								setTimeout(()=>{
									that.showGetImage = true
									that.closePopup()
								},2000)
							}
						})
					}
				}else{
					this.popupLoad = false
				}
			},
			closePopup(){
				this.popupDetail.number++
				let flag = false
				if(this.popupDetail.number > this.popupList.length-1){
					flag = true
				}
				if(flag){
					this.showGetImage = false
				}else{
					let number = this.popupDetail.number
					this.popupDetail = this.popupList[number]
					this.popupDetail.number = number
				}
			},
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('用户信息',res)
				if(res.code == 200){
					this.userDetail = res.data
					this.userId = this.userDetail.id
					uni.setStorageSync('userInfo',JSON.stringify(this.userDetail))
					// 获取会员等级
					this.getPopup()
				}
			},
			// 绑定身份
			async bindType(){
				let superior = uni.getStorageSync('superior')
				// console.log('二维码数据',superior)
				if(superior){
					let type = superior.substr(superior.length-1,1)
					let data = superior.substr(0,superior.length-1)
					let invite = ''
					if(type == 1){
						invite = await this.$post('/user/type/bind/merchant',{
							parentId:data
						})
					}else if(type == 2){
						invite = await this.$post('/user/type/bind/merchant/salesman',{
							parentId:data
						})
					}else if(type == 3){
						invite = await this.$post('/user/type/bind/platform/salesman',{
							parentId:data
						})
					}
					// console.log('绑定类型',type)
					// console.log('绑定数据',data)
					// console.log('绑定结果',invite)
					uni.removeStorageSync('superior')
				}
			},
			// 更换显示类型
			changeStatus(item,index){
				if(this.status !== index){
					this.status = index
					if(this.status !== 0){
						// 当显示类型不是酒店的时候就搜索商家
						this.searchMerchant(this.status)
						// if(item.name == '综合'){
						// 	this.searchMerchant('')
						// }else{
						// 	this.searchMerchant(this.status)
						// }
					}
				}
			},
			checkTime() {
				let now = new Date();
				let yy = new Date().getFullYear();
				let mm = new Date().getMonth() + 1;
				let dd = new Date().getDate();
				let day = yy + '/' + mm + '/' + dd;
				let nowTime = new Date().getTime()
				for (let i = 0; i < this.timeList.length; i++) {
					let j = new Date(day + ' ' + this.timeList[i]).getTime()
					if (nowTime >= j) {
						this.nowTime = i;
						this.searchText = this.timeList[this.nowTime]
					}
				}
			},
			getAddress() {
				this.locationText = '定位中...'
				const _this = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						_this.amapPlugin = new amap.AMapWX({
							key: _this.key
						});
						// 成功获取位置
						_this.amapPlugin.getRegeo({
							success: (data) => {
								_this.locationText = '当前位置'
								// console.log(data, '当前定位')
								_this.longitude = data[0].longitude;
								_this.latitude = data[0].latitude;
								_this.province = data[0].regeocodeData.addressComponent.province
								_this.location = data[0].name;
								_this.addressInfo = `${data[0].regeocodeData.formatted_address}`;

								let obj = {
									longitude: data[0].longitude,
									latitude: data[0].latitude,
									address: _this.addressInfo,
									province: _this.province,
									location: _this.location
								}
								let location = JSON.stringify(obj)
								uni.setStorageSync('location', location)
							},
							// 获取位置失败
							fail: (err) => {
								_this.locationText = '当前位置'
								// console.log('为什么失败', err)
								if (err.errMsg ==
									'getLocation:fail:ERROR_NOCELL&WIFI_LOCATIONSWITCHOFF') {
									uni.showToast({
										title: '请打开定位功能',
										icon: 'none'
									})
								}
							}
						});
					}
				})
			},
			dataDispose(data,index){
				data.map(d=>{
					d.underline_price = '￥'+ d.goodsPrice / 100
					d.sold = d.salesNum
					d.label = d.merchantLabelName
					d.costs = index == 1? '￥'+ d.boutiquePrice / 100 : '￥'+ d.spikePrice / 100
					d.picture = d.goodsPicture
					if(d.locationDistance >= 1000){
						d.distance = d.locationDistance / 1000 + 'km'
					}else{
						d.distance = d.locationDistance + 'm'
					}
				})
			},
			getTime() {
				// 默认选中今天到明天
				let NextDay = new Date().getTime() + 24 * 60 * 60 * 1000
				let NowDay = new Date();
				let now = new Date(NowDay)
				let sY = now.getFullYear();
				let sM = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
				let sD = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
				let sh = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours();
				let sm = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes();
				let ss = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds();
				let checkTime = sY + "-" + sM + "-" + sD + ' ' + sh + ":" + sm + ":" + ss;
				let nextTime = sY + "-" + sM + "-" + sD + ' 06:00:00'
				if(new Date(checkTime).getTime() < new Date(nextTime).getTime()){
					NextDay = NowDay
					NowDay = new Date(new Date().getTime() - 24 * 3600000)
					now = new Date(NowDay)
					sY = now.getFullYear();
					sM = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
					sD = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
				}
				this.minDate = NowDay
				this.checkDay = this.week[now.getDay()];

				let next = new Date(NextDay);
				let eY = next.getFullYear();
				let eM = next.getMonth() + 1 >= 10 ? next.getMonth() + 1 : '0' + (next.getMonth() + 1);
				let eD = next.getDate() >= 10 ? next.getDate() : '0' + next.getDate();
				this.leaveDay = this.week[next.getDay()];

				this.startTime = sY + "-" + sM + "-" + sD;
				this.endTime = eY + "-" + eM + "-" + eD;
				this.check = Number(sM) + '月' + Number(sD) + '日';
				this.leave = Number(eM) + '月' + Number(eD) + '日';
				this.defaultTime = [`${sY}-${sM}-${sD}`, `${eY}-${eM}-${eD}`]
			},
			clickBtn() {
				this.toPath(`/page_merchant/merchant/search?low=${this.low}&high=${this.high}&keyword=${this.keyword}&startTime=${this.startTime}&endTime=${this.endTime}&status=${this.status}`)
			},
			toBanner(item) {
				if (item.merchantId) {
					uni.navigateTo({
						url: `/page_merchant/merchant/merchantDetail?id=${item.merchantId}&longitude=${this.longitude}&latitude=${this.latitude}&startTime=${this.startTime}&endTime=${this.endTime}`
					})
				}
			},
			// 确认价格
			confirmPrice() {
				if (this.sliderList[0] >= 1000) {
					this.priceText = "1000元以上"
				} else {
					this.priceText = this.sliderList[0] + '元  -  ' + this.sliderList[1] + '元';
				}
				this.low = this.sliderList[0]
				this.high = this.sliderList[1]
				this.showPrice = false;
			},
			reWrite() {
				this.low = "";
				this.high = "";
				this.priceText = '请选择价格'
				this.showPrice = false;
			},
			// 确认时间
			confirmTime(e) {
				this.startTime = e[0];
				this.endTime = e[e.length - 1];
			
				this.costTime = e.length - 1;
				let startTime = new Date(e[0]);
				let endTime = new Date(e[e.length - 1]);
			
				let sM = startTime.getMonth() + 1;
				let sD = startTime.getDate();
				this.checkDay = this.week[startTime.getDay()];
				let eM = endTime.getMonth() + 1;
				let eD = endTime.getDate();
				this.leaveDay = this.week[endTime.getDay()];
				this.check = String(sM) + '月' + String(sD) + '日';
				this.leave = String(eM) + '月' + String(eD) + '日';
			
				// console.log('月份',this.check,this.leave,'日期',this.checkDay,this.leaveDay,)
				this.showTime = false;
			},
			changPrice(low, high, index) {
				this.choosePriceType = index;
				let array = [low, high]
				this.sliderList = array
			},
			format(val) {
				return val
			},
			handleRangeChange(e) {
				this.rangeValue = e
			},
			toActivity(item,index){
				if(item.stock == 0){
					uni.showToast({
						title:'该商品已售罄',
						icon:'none'
					})
					return
				}
				uni.setStorageSync('activity',JSON.stringify(item))
				if(index == 0){
					if(item.merchantType == 0){
						this.toPath(`/page_merchant/merchant/hotelOrder?id=${item.id}&type=2&startTime=${this.startTime}&endTime=${this.endTime}`)
					}else{
						uni.navigateTo({
							url:`/page_merchant/merchant/stealOrder?id=${item.id}&type=2&startTime=${this.startTime}&endTime=${this.endTime}`
						})
					}
				}else{
					if(item.merchantType == 0){
						this.toPath(`/page_merchant/merchant/hotelOrder?id=${item.id}&type=1&startTime=${this.startTime}&endTime=${this.endTime}`)
					}else{
						uni.navigateTo({
							url:`/page_merchant/merchant/stealOrder?id=${item.id}&type=1&startTime=${this.startTime}&endTime=${this.endTime}`
						})
					}
				}
			},
			toMerchantDetail(item){
				this.toPath(`/page_merchant/merchant/merchantDetail?id=${item.id}&latitude=${this.latitude}&longitude=${this.longitude}&startTime=${this.startTime}&endTime=${this.endTime}`)
			},
			//页面跳转
			toPath(url) {
				uni.navigateTo({
					url: url
				})
			},
		}
	}
</script>
<style>
	page {
		background: #F6F6F6;
	}
</style>
<style lang="less" scoped>
	.home {
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 100vh;
		overflow: auto;

		.topTitle {
			font-weight: bold;
			text-align: center;
			padding-bottom: 20rpx;
		}

		.headImage {
			height: 260rpx;
			width: 100%;

			.topImg {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
				display: block;
			}
		}

		.search_tool {
			margin-top: 30rpx;

			.search_list {
				display: flex;
				.search_item {
					width: 25%;
					display: flex;
					flex-direction: column;
					align-items: center;

					.icon {
						width: 60rpx;
						height: 60rpx;
					}

					.search_text {
						color: #3D3D3D;
						font-size: 26rpx;
						margin-top: 14rpx;
						position: relative;
					}

					.activate {
						color: #F4C52E;
						font-weight: bold;

						&::after {
							content: '';
							width: 0;
							height: 0;
							border-bottom: 20rpx solid white;
							border-left: 20rpx solid transparent;
							border-right: 20rpx solid transparent;
							border-top: 20rpx solid transparent;
							position: absolute;
							left: 50%;
							bottom: -60rpx;
							transform: translate(-50%, -50%);
						}
					}
				}
			}

			.showContent {
				border-radius: 20px;
				background-color: #FFFFFF;
				padding: 0 28rpx 48rpx 28rpx;
				margin-top: 40rpx;
				box-shadow: 3px 2px 7px 2px rgba(100, 100, 100, 0.2);

				.btmItem {
					padding: 30rpx 0;
					border-bottom: 2rpx solid #F2F2F2;

					&:nth-child(4) {
						border-bottom: 0 solid transparent;
						margin-bottom: 20rpx;
					}
				}
				.showList{
					padding: 2rpx 0;
					min-height: 448rpx;
					position: relative;
					.notGoods{
						position: absolute;
						text-align: 32rpx;
						transform: translate(-50%,-50%);
						top: 50%;
						left: 50%;
					}
				}

				.local {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.local_left {
						width: 70%;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.showlocal {
							width: 90%;
							overflow-x: auto;
							font-weight: bold;

							.localContent {
								white-space: nowrap;
								display: flex;
								overflow: hidden;

								.addressDetail {
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
							}
						}
					}

					.local_right {
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: #2972DE;
						font-size: 28rpx;

						&:active {
							color: #86d0f7;
						}
					}
				}

				.time {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.time_left {
						display: flex;
						justify-content: space-between;
						align-items: center;
						flex-shrink: 0;
						width: 76%;
						padding-right: 10rpx;
						box-sizing: border-box;

						.chooseTime {
							display: flex;
							flex-direction: column;

							.title {
								font-size: 24rpx;
								color: #707070;
							}
						}
					}

					.time_right {
						font-size: 26rpx;
						font-weight: bold;
						display: flex;
						align-items: center;
						white-space: normal;
						word-break: break-all;
						word-wrap: break-word;
					}
				}
			}
		}

		.activity {
			color: #3D3D3D;
			font-size: 28rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin-top: 26rpx;
			border-radius: 20px;

			.activity_title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.title_left{
					position: relative;
					&::after {
						content: '';
						background-color: #E5BD41;
						width: 100%;
						height: 12rpx;
						position: absolute;
						left: 0;
						bottom: 4rpx;
						z-index: -1;
						border-radius: 20px;
					}
				}
				.more{
					display: flex;
					align-items: center;
					font-size: 24rpx;
				}
				
			}

			.goods_list {
				width: 100%;
				min-height: 200rpx;
				background-color: #FFFFFF;
				border-radius: 20px;
				margin-top: 20rpx;
				// z-index: -1;
				padding: 0 20rpx 20rpx 20rpx;
				box-sizing: border-box;
				position: relative;
				.notGoodsList{
					color: #707070;
					position: absolute;
					text-align: 32rpx;
					transform: translate(-50%,-50%);
					top: 50%;
					left: 50%;
				}
			}
		}

		.homeicon {
			width: 28rpx;
			height: 28rpx;
		}

		.popupStyle {
			height: 50vh;
			width: 100%;
			padding: 32rpx 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;

			.Price_title {
				font-size: 32rpx;
				display: flex;
				justify-content: center;
				font-weight: bold;
				position: relative;

				.clear {
					font-weight: normal;
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.section {
				display: flex;
				justify-content: space-between;
				margin-top: 32rpx;
			}

			.area {
				display: flex;
				flex-wrap: wrap;
				font-size: 26rpx;
				margin-bottom: 80rpx;

				.priceArea {
					background: #F2F2F2;
					border-radius: 8rpx;
					padding: 20rpx 18rpx;
					margin: 0 16rpx 16rpx 0;
					border: 2rpx solid transparent;
				}

				.priced {
					border: 2rpx solid #2972DE;
				}
			}
		}
	}
</style>
