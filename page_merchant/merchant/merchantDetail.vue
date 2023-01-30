<template>
	<view class="hotelDetail" @click="hideDel">
		<view class="top_content">
			<swiper circular :autoplay="true" :interval="5000" style="height: 628rpx;">
				<swiper-item v-for="(item,index) in detailMessage.merchantCarousel"
					style="border-radius: 0 0 20rpx 20rpx; overflow: hidden;" :key="index">
					<image class="topImg" :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="tool" :style="{top:statusBarHeight*2 + 98 + 'rpx'}">
				<image class="icon" src="/static/white_back.png" @click.stop="toBack"></image>
			</view>
		</view>
		<view class="content">
			<view class="detailInfo">
				<view class="info_top">
					<view class="top_left oneHide">{{detailMessage.merchantName}}</view>
					<view class="top_right">
						<button open-type="share" class="shareBtn">
							<image class="top_Icon" src="/static/share.png"></image>
						</button>
						
						<image class="top_Icon" v-if="detailMessage.collection" src="/static/collect_ed.png" @click="changeCollect(true)"></image>
						<image class="top_Icon" v-if="!detailMessage.collection" src="/static/collect.png" @click="changeCollect(false)"></image>
					</view>
				</view>
				<view class="introduce">
					<view class="introduceList">
						<view class="introduce_item">
							{{detailMessage.businessDistrictName}}
						</view>
						<view class="introduce_item">
							{{detailMessage.merchantLabelName}}
						</view>
					</view>
					<view class="sold">
						销量：{{detailMessage.salesNum}}
					</view>
				</view>
				<view class="labelCard">
					<view class="labelCard_msg">
						<view class="msg_left">
							<view class="msg_item">
								<image class="card_icon" src="/static/olocation.png"></image>
								{{detailMessage.merchantAddress}}
							</view>
							<view class="msg_item">
								<view>
									<image class="card_icon" src="/static/search.png"></image>
									营业时间
								</view>
								<view style="margin: 0 10rpx;">|</view>
								<view style="color: #BCBFC4;">{{detailMessage.timeRange}}</view>
							</view>
						</view>
						<view class="toolList">
							<view class="tool_item" style="margin-right: 52rpx;" @click="navigation">
								<image class="tool_img" src="/static/navigation.png"></image>
								<view class="tool_text">
									导航
								</view>
							</view>
							<view class="tool_item" @click="telephone">
								<image class="tool_img" src="/static/phone.png"></image>
								<view class="tool_text">
									电话
								</view>
							</view>
						</view>
					</view>
					<view class="labelCard_btm">
						<view class="btm_item" style="width: 66%;">
							<image style="width: 50rpx;height: 54rpx;margin-right: 32rpx;"
								src="https://wentaoyang-1314148407.cos.ap-guangzhou.myqcloud.com/2023%5C1%5C5%5C1610945492293709825.png"></image>
							<view class="value">
								<view class="score" style="font-size: 28rpx;">文涛扬认证商家</view>
								<view class="distance">平台会员享优惠</view>
							</view>
						</view>
						<view class="btm_item" style="width: 32%;">
							<image class="btm_icon" src="/static/score.png"></image>
							<view class="value">
								<view class="score">{{detailMessage.score}}</view>
								<view class="distance">距您{{detailMessage.locationDistance}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="welfare" v-if="detailMessage.merchantType == 0">
					<view class="welfare_item">
						<image class="welfare_icon" src="/static/member.png"></image>
						<view>
							会员折扣
						</view>
					</view>
					<view class="welfare_item">
						<image class="welfare_icon" src="/static/money.png"></image>
						<view>
							积分立返
						</view>
					</view>
					<view class="welfare_item">
						<image class="welfare_icon" style="width: 26rpx;" src="/static/thunder.png"></image>
						<view>
							快速入住
						</view>
					</view>
				</view>
			</view>
			
			<view class="circum">
				<view :class="['circum_item',{choose:status == item.value}]" @click.stop="changeStatus(item.value)" v-for="(item,index) in circumList" :key="index">
					{{item.name}}
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="showContent" v-if="status == 'goodsList'">
				<view class="goodsContent" v-if="detailMessage.merchantType == 0">
					<view class="time" that.detailMessage.contactNumber @click.stop="showTime = true">
						<view>
							<span style="font-size: 28rpx;font-weight: bold;margin-right: 10rpx;">{{check}}</span>
							{{checkDay}}入住
						</view>
						<view class="costTime">
							{{costTime}}晚
						</view>
						<view>
							<span style="font-size: 28rpx;font-weight: bold;margin-right: 10rpx;">{{leave}}</span>
							{{leaveDay}}离店
						</view>
					</view>
				</view>
				
				<view class="goodsList" v-if="status == 'goodsList'">
					<view class="notGoods" v-if="goodsList.length == 0">
						暂无商品
					</view>
					<hotel-item v-for="(item,index) in goodsList" :key="indedx" :item="item" @toPath="toPath" @toBuy="toBuy"></hotel-item>
				</view>
			</view>
			
			<!-- 商家介绍 -->
			<view class="showContent" v-if="status == 'merchant'">
				<view class="merchant_info">
					<view v-html="detailMessage.merchantIntroduction"></view>
				</view>
			</view>
			<!-- 顾客评价 -->
			<view class="showContent" v-if="status == 'evaluate'">
				<view class="evaluateList">
					<view class="notEvalueate" v-if="evaluateList.length == 0">
						暂无评价
					</view>
					<view class="evaluate_item" v-for="(item,index) in evaluateList" :key="index">
						<view class="top">
							<view class="top_left">
								<image class="userImg" src="/static/image.png"></image>
								<view class="userMsg">
									<view class="name oneHide">默认昵称</view>
									<view class="userMsg_btm">
										<u-rate activeColor="#FF0000" size="30rpx" :gutter="2" :count="item.score" :value="item.score" readonly></u-rate>
										<view class="evaluateStatus">
											消费后评价
										</view>
									</view>
								</view>
							</view>
							<view class="top_right">
								<view class="showDel" @click.stop="showDelMethod(index)" v-if="item.self">
									<u-icon name="more-dot-fill"></u-icon>
									<view class="delContent" v-if="item.showDel" @click.stop="delEvalution(item)">
										删除评论
									</view>
								</view>
							</view>
						</view>
						<view class="userEvaluation">
							<view class="userEvaluation-item" v-for="(evaluation,number) in item.evaluationLabelNames" :key="number">
								{{evaluation}}
							</view>
						</view>
						<view class="userShowImage">
							<image class="showImage" :src="image" mode="aspectFit" v-for="(image,ondex) in item.picture"
								:key="ondex" @click="previewPicture(item.picture,ondex)"></image>
						</view>
						<view class="evaluate_content">
							{{item.evaluationContent}}
						</view>
						<view class="merchantContent">
							<view class="merchantTalk">
								{{item.merchantReply?'商家回复：'+item.merchantReply : '商家暂无回复'}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 日期范围 -->
		<u-calendar :show="showTime" :minDate="minDate" mode="range" :defaultDate="defaultTime" @confirm="confirmTime" @close="showTime=false"
			:closeOnClickOverlay="true" :allowSameDay="true"></u-calendar>
	</view>
</template>

<script>
	import HotelItem from '../components/hotelItem.vue'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				status:'goodsList',
				defaultTime:'',
				circumList:[
					{
						name:'优惠订房',
						value:'goodsList'
					},
					{
						name:'门店介绍',
						value:'merchant'
					},
					{
						name:'会员评价',
						value:'evaluate'
					},
				],
				detailMessage: {
					id:'',
					merchantName: '',
					businessDistrictName: '',
					merchantLabelName: '',
					merchantAddress: "",
					timeRange: '',
					merchantType:'',
					collection: false, // 是否收藏
					contactNumber: '',
					secondContactNumber:'',
					score: '5.0',
					salesNum: 0,
					merchantIntroduction:'',//商家介绍
					locationDistance: '0m',
					merchantCarousel: [],
				},
				goodsList:[],
				evaluateList:[],
				showTime:false,
				check: "", // 入住时间
				checkDay: '', // 入住日期
				leave: "", // 离店时间
				leaveDay: '', // 离店日期
				startTime: "", // 开始时间戳
				endTime: "", // 离店时间戳
				week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				costTime: 1, // 住宿天数
				userId:'',
				discount:8.5,
				latitude:'23.009475',
				longitude:'113.122532',
				current:1,// 搜索页码
				total:10,
				minDate:'',
				overContent:true,// 加载节点
				collectFlag:true,// 收藏节点
			};
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
		},
		onLoad(options) {
			this.id = options.id;
			// console.log('传值',options)
			if(options.latitude){
				this.latitude = options.latitude
				this.longitude = options.longitude
			}
			let flag = false
			if (options.startTime && options.endTime) {
				this.startTime = options.startTime
				this.endTime = options.endTime
				flag = true
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
			this.calculateTime(this.startTime, this.endTime,flag);
			this.getUserInfo()
		},
		components:{
			HotelItem
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.current * 10
			if (allTotal < this.goodsTotal && this.overContent) {
				this.overContent = false;
				this.current++;
				if(this.status === 'goodsList'){
					this.getGoodsList()
				}else if(this.status === 'evaluate'){
					this.getEvaluation()
				}
			}
		},
		methods:{
			// 获取商家详情
			async getMerchantDetail(){
				let res = await this.$get('/merchant/detail',{
					id:this.id,
					userId:this.userId,
					latitude:this.latitude,
					longitude:this.longitude
				})
				uni.showLoading({
					title:'加载中...'
				})
				console.log('商家详情',res)
				if(res.code == 200){
					this.detailMessage = res.data
					this.getGoodsList()
					this.detailMessage.score = this.detailMessage.score?(this.detailMessage.score).toFixed(1):'5.0'
					if(this.detailMessage.merchantType != 0){
						this.circumList[0].name = '福利套餐'
					}
					if(this.detailMessage.merchantCarousel){
						this.detailMessage.merchantCarousel = this.detailMessage.merchantCarousel.split(',')
					}else{
						this.detailMessage.merchantCarousel = []
					}
					if(this.detailMessage.locationDistance >= 1000){
						this.detailMessage.locationDistance = this.detailMessage.locationDistance / 1000 + 'km'
					}else{
						this.detailMessage.locationDistance = this.detailMessage.locationDistance + 'm'
					}
				}else{
					uni.hideLoading()
				}
			},
			// 获取用户信息
			async getUserInfo() {
				let res = await this.$get('/user/getInfo')
				// console.log('结果是什么',res)
				if(res.code == 200){
					this.userId = res.data.id
					this.discount = res.data.member.memberDiscount
					this.getMerchantDetail()
				}
			},
			async getGoodsList(){
				let obj = {
					current:this.current,
					size:10,
					merchantId:this.detailMessage.id,
					merchantType:this.detailMessage.merchantType,
				}
				// 搜酒店商品就加上入住和离店时间
				if(this.detailMessage.merchantType == 0){
					obj.startTime = this.startTime
					obj.endTime = this.endTime
				}
				let res = await this.$get('/merchant/goods/page',obj)
				// console.log('获取商品',res)
				if(res.code == 200){
					this.overContent = true;
					this.total = res.data.total
					uni.hideLoading()
					res.data.records.map(d=>{
						d.picture = d.goodsPicture
						d.itemStatus = this.detailMessage.merchantType == 0 ? 0 : 1
						d.label = d.goodsTitle
						d.price = d.goodsPrice / 100
						d.underlinePrice = d.underlinedPrice / 100
						
						if (d.roomType == 1) {
							let now = new Date().getTime()
							let start = new Date(
								this.startTime + ' 00:00:00'
							).getTime()
							// 钟点房入住时间大于现在时间就显示满房
							if (start > now) {
								d.stock = 0
							}
						}else if(d.roomType == 0){
							d.price = Math.round(((d.merchantRoomPriceList[0].goodsPrice * 10) * this.discount / 10) / 1000)
						}
					})
					this.goodsList = this.goodsList.concat(res.data.records)
				}else{
					this.current--;
					this.overContent = true;
				}
			},
			// 获取评价
			async getEvaluation(){
				let res = await this.$get('/merchant/order/evaluation/page',{
					current:this.current,
					size:10,
					merchantId:this.detailMessage.id
				})
				// console.log('获取评价',res)
				if(res.code == 200){
					this.total = res.data.total
					res.data.records.map(d=>{
						d.showDel = false
						if(d.evaluationLabelNames){
							d.evaluationLabelNames = d.evaluationLabelNames.split(',')
						}
						if(d.evaluationPicture){
							d.picture = d.evaluationPicture.split(',')
						}else{
							d.picture = []
						}
						if(this.userId == d.userId ){
							d.self = true
						}
					})
					this.evaluateList = this.evaluateList.concat(res.data.records)
				}else{
					this.current--;
					this.overContent = true;
				}
			},
			async changeCollect(flag){
				if(!this.collectFlag)return
				this.collectFlag = false
				let res = await this.$post('/user/collection/add',{
					userId:this.userId,
					merchantId:this.detailMessage.id,
					isCollection:!flag
				})
				if(res.code == 200){
					this.collectFlag = true
					uni.showToast({
						title:flag?'取消收藏成功':'收藏成功',
						icon:'none'
					})
					this.detailMessage.collection = !flag
				}else{
					this.collectFlag = true
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
				}
			},
			toBuy(item){
				// console.log('点击了购买',item)
				if(!item.isStockInsufficient){
					uni.showToast({
						title:'已满房',
						icon:'none'
					})
				}else{
					if(this.detailMessage.merchantType == 0){
						if(item.roomType == 0){
							uni.navigateTo({
								url:`/page_merchant/merchant/hotelOrder?id=${item.id}&startTime=${this.startTime}&endTime=${this.endTime}&type=0`
							})
						}else{
							uni.navigateTo({
								url:`/page_merchant/merchant/hotelOrder?id=${item.id}&startTime=${this.startTime}&endTime=${this.startTime}&type=0`
							})
						}
					}else{
						uni.navigateTo({
							url:`/page_merchant/merchant/stealOrder?id=${item.id}&startTime=${this.startTime}&endTime=${this.endTime}&type=0`
						})
					}
				}
			},
			toPath(item){
				uni.navigateTo({
					url:`/page_merchant/merchant/goodsDetail?id=${item.id}&startTime=${this.startTime}&endTime=${this.endTime}&type=${this.detailMessage.merchantType}`
				})
			},
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// 导航
			async navigation() {
				let that = this
				uni.openLocation({
					latitude: that.detailMessage.merchantLatitude,
					longitude: that.detailMessage.merchantLongitude,
					scale: 15,
					name: that.detailMessage.merchantName,
					address: that.detailMessage.merchantAddress
				});
			},
			// 打电话
			telephone() {
				let that = this;
				const res = uni.getSystemInfoSync();
				if (res.platform === 'ios') {
					let array = [that.detailMessage.contactNumber]
					if (that.detailMessage.secondContactNumber) {
						array.push(that.detailMessage.secondContactNumber)
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
					let array = [that.detailMessage.contactNumber]
					if (that.detailMessage.secondContactNumber) {
						array.push(that.detailMessage.secondContactNumber)
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
			// 删除评价
			delEvalution(item,index){
				let that = this
				uni.showModal({
					title:'删除评论',
					content:'确认删除评论？',
					success: async (res)=> {
						if(res.confirm){
							let array = []
							let obj = {
								id:item.id
							}
							array.push(obj)
							let res = await that.$post('/merchant/order/evaluation/delete',array)
							if(res.code == 200){
								uni.showToast({
									title:"删除成功",
									icon:"none"
								})
								that.evaluateList.splice(index,1)
							}
						}
					}
				})
			},
			// 切换栏目
			changeStatus(tab){
				if(this.status == tab)return
				this.current = 1
				this.overContent = true
				this.status = tab
				if(this.status === 'goodsList'){
					this.goodsList = []
					this.getGoodsList()
				}else if(this.status === 'evaluate'){
					this.evaluateList = []
					this.getEvaluation()
				}
			},
			// 展示删除
			showDelMethod(index){
				this.evaluateList[index].showDel = true
			},
			hideDel(){
				for(let i =0;i<this.evaluateList.length;i++){
					this.evaluateList[i].showDel = false
				}
			},
			// 计算时间
			calculateTime(start, end, flag) {
				let startTime = new Date(start);
				let endTime = new Date(end);
			
				let sY = startTime.getFullYear();
				let sM = startTime.getMonth() + 1 >= 10 ? startTime.getMonth() + 1 : '0' + (startTime.getMonth() + 1);
				let sD = startTime.getDate() >= 10 ? startTime.getDate() : '0' + startTime.getDate();
				let sh = startTime.getHours() >= 10 ? startTime.getHours() : '0' + startTime.getHours();
				let sm = startTime.getMinutes() >= 10 ? startTime.getMinutes() : '0' + startTime.getMinutes();
				let ss = startTime.getSeconds() >= 10 ? startTime.getSeconds() : '0' + startTime.getSeconds();
				let checkTime = sY + "-" + sM + "-" + sD + ' ' + sh + ":" + sm + ":" + ss;
				let nextTime = sY + "-" + sM + "-" + sD + ' 06:00:00'
				if(!flag){
					if(new Date(checkTime).getTime() < new Date(nextTime).getTime()){
						endTime = startTime
						startTime = new Date(new Date(start).getTime() - 24 * 3600000)
						sY = startTime.getFullYear();
						sM = startTime.getMonth() + 1 >= 10 ? startTime.getMonth() + 1 : '0' + (startTime.getMonth() + 1);
						sD = startTime.getDate() >= 10 ? startTime.getDate() : '0' + startTime.getDate();
					}
				}
				
				this.minDate = startTime
				this.checkDay = this.week[startTime.getDay()];
			
				this.costTime = Math.floor((endTime.getTime() - startTime.getTime()) / 24 / 3600000)
			
				let eY = endTime.getFullYear();
				let eM = endTime.getMonth() + 1 >= 10 ? endTime.getMonth() + 1 : '0' + (endTime.getMonth() + 1);
				let eD = endTime.getDate() >= 10 ? endTime.getDate() : '0' + endTime.getDate();
			
				this.leaveDay = this.week[endTime.getDay()];
				this.check = String(sM) + '月' + String(sD) + '日';
				this.leave = String(eM) + '月' + String(eD) + '日';
			
				this.defaultTime = [`${sY}-${sM}-${sD}`, `${eY}-${eM}-${eD}`]
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
				this.showTime = false;
				this.current = 1
				this.overContent = true
				this.goodsList = []
				this.getGoodsList()
			},
			// 预览
			previewPicture(item,index){
				uni.previewImage({
					urls:item,
					current:index
				})
			},
		}
	}
</script>
<style>
	page {
		background-color: #F6F6F6;
	}
</style>
<style lang="less" scoped>
	.hotelDetail {
		.top_content {
			width: 100%;
			height: 628rpx;
			border-radius: 0 0 10rpx 10rpx;
			overflow: hidden;
			position: relative;

			.topImg {
				width: 100%;
				height: 100%;
				display: block;
			}

			.tool {
				width: 100%;
				position: absolute;
				left: 0;
				z-index: 10;
				display: flex;
				justify-content: space-between;
				padding: 0 32rpx;
				box-sizing: border-box;

				.icon {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.content {
			padding: 0 24rpx;
			box-sizing: border-box;
			margin-top: -200rpx;
			z-index: 10;
			position: relative;

			.detailInfo {
				display: flex;
				flex-direction: column;
				color: #FFFFFF;

				.info_top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 24rpx;
					box-sizing: border-box;

					.top_left {
						width: 80%;
						font-size: 48rpx;
						font-weight: bold;
					}

					.top_right {
						display: flex;

						.top_Icon {
							width: 40rpx;
							height: 40rpx;
							margin-left: 12rpx;
							flex-shrink: 0;
						}
					}
				}

				.introduce {
					font-size: 24rpx;
					display: flex;
					justify-content: space-between;
					padding: 0 24rpx;
					box-sizing: border-box;
					margin-top: 20rpx;
					margin-bottom: 16rpx;

					.introduceList {
						display: flex;

						.introduce_item {
							&:not(:last-child) {
								position: relative;
								margin-right: 30rpx;

								&::after {
									content: '|';
									color: #FFFFFF;
									position: absolute;
									right: -18rpx;
								}
							}
						}
					}

					.sold {
						color: #F8E3A3;
					}
				}

				.labelCard {
					color: #3D3D3D;
					font-size: 28rpx;
					border-radius: 20rpx;
					background-color: #FFFFFF;
					padding: 20rpx 30rpx;
					box-sizing: border-box;

					.labelCard_msg {
						display: flex;
						justify-content: space-between;

						.msg_left {
							width: 68%;
							position: relative;
							padding-right: 20rpx;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							&::after {
								content: '';
								width: 4rpx;
								height: 100%;
								background-color: #D8D8D8;
								position: absolute;
								right: 0;
								top: 0;
							}

							.msg_item {
								display: flex;
								align-items: baseline;
							}

							.card_icon {
								width: 30rpx;
								height: 30rpx;
								flex-shrink: 0;
								margin-right: 10rpx;
							}
						}

						.toolList {
							display: flex;
							font-size: 24rpx;

							.tool_item {
								.tool_img {
									width: 60rpx;
									height: 60rpx;
								}

								.tool_text {
									transform: scale(0.75);
									transform-origin: center;
								}
							}
						}
					}

					.labelCard_btm {
						display: flex;
						justify-content: space-between;
						margin-top: 20rpx;

						.btm_item {
							display: flex;
							justify-content: center;
							align-items: center;
							background: #F7F3F0;
							border-radius: 10px 10px 10px 10px;
							padding: 16rpx 8rpx;
							box-sizing: border-box;
							.btm_icon {
								width: 60rpx;
								height: 50rpx;
								flex-shrink: 0;
							}

							.value {
								display: flex;
								flex-direction: column;
								align-items: center;

								.score {
									font-size: 56rpx;
									font-weight: bold;
								}

								.distance {
									font-size: 24rpx;
									transform: scale(0.85);
									transform-origin: center;
									word-break: break-all;
								}
							}
						}
					}
				}

				.welfare {
					width: 90%;
					display: flex;
					justify-content: center;
					background-color: #0B1730;
					border-radius: 0 0 40rpx 40rpx;
					align-self: center;
					padding: 12rpx 0;

					.welfare_item {
						font-size: 28rpx;
						color: #FFFFFF;
						display: flex;
						align-items: center;
						margin-right: 20rpx;
						.welfare_icon {
							width: 34rpx;
							height: 34rpx;
							flex-shrink: 0;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
		
		.circum{
			display: flex;
			margin-top: 20rpx;
			.circum_item{
				color: #BCBFC4;
				font-weight: bold;
				margin-left: 40rpx;
			}
			.choose{
				color: #3D3D3D;
				position: relative;
				&::after{
					content: '';
					width: 100%;
					height: 12rpx;
					border-radius: 30px;
					background-color: #F8E3A3;
					position: absolute;
					left: 0;
					bottom: -6rpx;
					z-index: -1;
				}
			}
		}
		
		.showContent{
			.goodsContent{
				.time {
					width: 100%;
					padding: 24rpx 40rpx;
					background: #FFFFFF;
					border-radius: 10rpx;
					font-size: 24rpx;
					color: #707070;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					margin-top: 20rpx;
				
					.costTime {
						color: #3D3D3D;
						border-radius: 10px;
						border: 1px solid #3D3D3D;
						padding: 0 18rpx;
					}
				}
			}
			
			.goodsList{
				margin-top: 18rpx;
				padding-bottom: 18rpx;
				min-height: 400rpx;
				position: relative;
				.notGoods{
					color: #707070;
					position: absolute;
					font-size: 32rpx;
					top: 30%;
					left: 50%;
					transform: translate(-50%,-50%);
				}
			}
			
			.merchant_info{
				border-radius: 20rpx;
				background-color: #FFFFFF;
				padding: 14rpx 40rpx;
				box-sizing: border-box;
				margin-top: 20rpx;
				padding-bottom: 20rpx;
			}
			
			.evaluateList{
				min-height: 400rpx;
				color: #3D3D3D;
				margin-top: 20rpx;
				padding-bottom: 20rpx;
				position: relative;
				border-radius: 20rpx;
				.notEvalueate{
					color: #707070;
					position: absolute;
					font-size: 32rpx;
					top: 30%;
					left: 50%;
					transform: translate(-50%,-50%);
				}
				.evaluate_item{
					border-radius: 20rpx;
					background-color: #FFFFFF;
					padding: 14rpx 40rpx;
					box-sizing: border-box;
					margin-bottom: 20rpx;
					.top{
						display: flex;
						justify-content: space-between;
						.top_left{
							width: 78%;
							display: flex;
							.userImg{
								width: 70rpx;
								height: 70rpx;
								border-radius: 50%;
								flex-shrink: 0;
								margin-right: 14rpx;
							}
							.userMsg{
								overflow: hidden;
								.name{
									font-size: 28rpx;
								}
								.userMsg_btm{
									display: flex;
									.evaluateStatus{
										display: flex;
										align-items: center;
										justify-content: center;
										font-size: 20rpx;
										transform-origin: center;
										border-radius: 20rpx;
										background-color: #F7F3F0;
										padding: 4rpx 8rpx;
										margin-left: 20rpx;
									}
								}
							}
						}
						.top_right{
							width: 30%;
							.showDel{
								position: relative;
								display: flex;
								justify-content: flex-end;
								.delContent{
									width: 100%;
									position: absolute;
									bottom: -60rpx;
									left: 0;
									color: #2972DE;
									font-size: 28rpx;
									text-align: center;
									padding: 10rpx 0;
									z-index: 10;
									background-color: #fff;
									box-shadow: 0px -1px 5px 5px rgba(0, 0, 0, 0.03);
								}
							}
						}
					}
					.userEvaluation {
						display: flex;
						flex-wrap: wrap;
						margin-top: 8rpx;
					
						.userEvaluation-item {
							background: #F2F2F2;
							border-radius: 10rpx;
							font-size: 20rpx;
							color: #707070;
							transform: scale(0.9);
							transform-origin: left;
							padding: 4rpx 16rpx;
						}
					}
					
					.userShowImage {
						display: flex;
						justify-content: space-between;
						margin-top: 28rpx;
						flex-wrap: wrap;
						.showImage {
							width: 200rpx;
							margin-bottom: 20rpx;
							height: 200rpx;
							border-radius: 10rpx;
						}
					}
					
					.evaluate_content{
						font-size: 24rpx;
						border-bottom: 1px solid #D8D8D8;
						padding: 20rpx;
						box-sizing: border-box;
						color: #000;
					}
					.merchantContent{
						font-size: 24rpx;
						color: #3D3D3D;
						padding: 10rpx 20rpx;
						box-sizing: border-box;
					}
				}
			}
		}
		.shareBtn{
			line-height: normal;
			margin: 0;
			padding: 0;
			background-color: transparent;
			&::after{
				border: transparent;
			}
		}
	}
</style>
