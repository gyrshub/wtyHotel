<template>
	<!-- 商户入驻页面 -->
	<page-meta :page-style="'overflow:'+(showType || showBuss || showTimeRange?'hidden':'visible')"></page-meta>
	<view class="hotelOccupancy">
		<u-alert title="驳回原因"  type = "error" :closable="true" :description = "userInfo.userTypeApplyVO.merchantFailReason" v-if="userInfo.userTypeApplyVO && userInfo.userTypeApplyVO.merchantFailReason" fontSize="16"></u-alert>
		<view class="formContent borderStyle">
			<view class="form-item">
				<view class="title">商户类型</view>
				<view class="form-region active" @click="showType = true">
					<view>{{merchantTypeName}}
					</view>
				</view>
			</view>

			<view class="form-item">
				<view class="title">商户名称</view>
				<view class="form-input">
					<u--input placeholder="请输入商户名称" border="none" v-model="list.merchantName" inputAlign="right">
					</u--input>
				</view>
			</view>

			<view class="form-item" v-if="list.merchantType == 0">
				<view class="title">总房量</view>
				<view class="form-input">
					<u--input type="number" placeholder="请输入总房量" border="none" v-model="list.totalRoomNum"
						inputAlign="right">
					</u--input>
				</view>
			</view>

			<view class="form-item">
				<view class="title">商户负责人</view>
				<view class="form-input">
					<u--input placeholder="请输入姓名" border="none" v-model="list.merchantPrincipal" inputAlign="right"></u--input>
				</view>
			</view>

			<view class="form-item">
				<view class="title">商户地址</view>
				<view :class="['form-region',{active:list.merchantAddress}]" @click="getLocation">
					{{list.merchantAddress || '点击选择商户地址'}}
				</view>
			</view>

			<view class="form-item">
				<view class="title">商圈类型</view>
				<view :class="['form-region',{active:list.businessDistrictId}]" @click="showBuss = true">
					<view>{{businessDistrictName}}</view>
				</view>
			</view>

			<view class="form-item">
				<view class="title">营业时间</view>
				<view :class="['form-region',{active:list.timeRange}]" @click="showTimeRange = true">
					<view>{{list.timeRange || '点击选择营业时间'}}</view>
				</view>
			</view>

			<view class="form-item">
				<view class="title">商家联系方式</view>
				<view class="form-input">
					<u--input placeholder="请输入商家联系方式" border="none" v-model="list.contactNumber"
						inputAlign="right">
					</u--input>
				</view>
			</view>
			<view class="form-item">
				<view class="title">第二联系方式(选填)</view>
				<view class="form-input">
					<u--input placeholder="请输入第二联系方式(选填)" border="none" v-model="list.secondContactNumber"
						inputAlign="right">
					</u--input>
				</view>
			</view>

		</view>

		<view class="uploadImage borderStyle">
			<view class="uploadImage-item">
				<view style="margin-bottom: 20rpx;">请拍摄并上传营业执照</view>
				<view style="margin-left: 60rpx;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="1"></u-upload>
				</view>
			</view>

			<view class="uploadImage-item">
				<view style="margin-bottom: 20rpx;">请拍摄并上传开户许可证</view>
				<view style="margin-left: 60rpx;">
					<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" name="2" multiple
						:maxCount="1"></u-upload>
				</view>
			</view>
		</view>

		<view class="uploadImage borderStyle">
			<view>请拍摄并上传法人身份复印件</view>
			<view class="imageList">
				<u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" name="3" multiple
					:maxCount="1" width="168" height="94" imageMode="aspectFit">
					<view class="imageItem">
						<image class="borderImage" src="/static/border.png" v-if="!fileList3.length"></image>
						<view class="imageItem-info" v-if="!fileList3.length">
							<image class="camera" src="/static/camera.png"></image>
							<view>上传人像面</view>
						</view>
					</view>
				</u-upload>

				<u-upload :fileList="fileList4" @afterRead="afterRead" @delete="deletePic" name="4" multiple
					:maxCount="1" width="168" height="94" imageMode="aspectFit">
					<view class="imageItem">
						<image class="borderImage" src="/static/border.png" v-if="!fileList4.length"></image>
						<view class="imageItem-info" v-if="!fileList4.length">
							<image class="camera" src="/static/camera.png"></image>
							<view>上传国徽面</view>
						</view>
					</view>
				</u-upload>
			</view>
		</view>

		<view style="height: 160rpx;"></view>

		<view class="bottomTool">
			<u-button color="linear-gradient(90deg, #FFAA65 0%, #FB8146 100%)" shape="circle" text="下一步"
				@click="confirmApply"></u-button>
		</view>
		<!-- 商店类型 -->
		<u-picker :show="showType" :columns="columns" keyName="name" :immediateChange="true" @cancel="showType = false"
			@confirm="confirmType"></u-picker>
		<!-- 选择商圈 -->
		<u-picker :show="showBuss" :columns="options" keyName="name" :immediateChange="true" @cancel="showBuss = false"
			@confirm="confirmBuss"></u-picker>
		<!-- 营业时间 -->
		<u-picker :show="showTimeRange" :columns="timeList" :immediateChange="true" @cancel="showTimeRange = false"
			@confirm="confirmTimeRange"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:'',
				list: {
					userId:'',
					merchantType: 0,
					businessDistrictId: '',
					merchantName: '',
					contactNumber: '',
					secondContactNumber:'',
					merchantPrincipal: '',// 商家法人
					totalRoomNum: '',
					merchantAddress: '',
					businessLicense: '', // 营业执照
					openingPermit: '', // 开户许可证
					identityCardFront: '', // 国徽
					identityCardReverse: '', // 人像
					timeRange: '',
					merchantLongitude: '',// 经度
					merchantLatitude: '',// 纬度
				},
				timeList: [],
				merchantTypeName:'酒店',
				businessDistrictName: '',
				phoneRule: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/,
				showTimeRange: false,
				showType: false,
				showBuss: false,
				chooseRegion: false,
				showRegion: false,
				options: [],
				columns: [],
				// 身份证照片
				imageList: [
					'', ''
				],
				fileList1: [], // 营业执照
				fileList2: [], // 开户许可证
				fileList3: [], // 人像
				fileList4: [], // 国徽
			};
		},
		// components: {
		// 	pickers
		// },
		onLoad() {
			 
		},
		created() {
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			this.userInfo = userInfo
			this.list.userId = this.userInfo.id
			this.getListBusinessDistrict()
			this.getMerchantType()
			let array = []
			for (let i = 0; i < 24; i++) {
				for (let j = 0; j < 2; j++) {
					if (i < 10) {
						if (j % 2 == 0) {
							array.push('0' + i + ":" + "00")
						} else {
							array.push('0' + i + ":" + "30")
						}
					} else {
						if (j % 2 == 0) {
							array.push(i + ":" + "00")
						} else {
							array.push(i + ":" + "30")
						}
					}
				}
			}
			this.timeList.push(array, array)
		},
		methods: {
			async confirmApply() {
				if (this.list.merchantName == "") {
					uni.showToast({
						title: '请输入商户名称',
						icon: "none"
					})
					return
				}
				if (this.list.totalRoomNum == "" && this.list.merchantType == 0) {
					uni.showToast({
						title: '请输入总房量',
						icon: "none"
					})
					return
				}
				if (this.list.merchantPrincipal == "") {
					uni.showToast({
						title: '请输入商户负责人',
						icon: "none"
					})
					return
				}
				if (this.list.merchantAddress == "") {
					uni.showToast({
						title: '请输入商户地址',
						icon: "none"
					})
					return
				}

				if (!(this.phoneRule.test(this.list.contactNumber))) {
					uni.showToast({
						title: '商家联系方式输入不规范',
						icon: "none"
					})
					return
				}

				if (this.list.timeRange == '' && this.list.merchantType != 0) {
					uni.showToast({
						title: '请选择营业时间',
						icon: "none"
					})
					return
				}
				if (this.fileList1.length == 0) {
					uni.showToast({
						title: '请上传营业执照',
						icon: "none"
					})
					return
				}
				if (this.fileList2.length == 0) {
					uni.showToast({
						title: '请上传开户许可证',
						icon: "none"
					})
					return
				}
				if (this.fileList4.length == 0) {
					uni.showToast({
						title: '请上传身份证国徽面',
						icon: "none"
					})
					return
				}
				if (this.fileList3.length == 0) {
					uni.showToast({
						title: '请上传身份证人像面',
						icon: "none"
					})
					return
				}
				
				this.list.businessLicense = this.fileList1[0].url;
				this.list.openingPermit = this.fileList2[0].url;
				this.list.identityCardReverse = this.fileList3[0].url;
				this.list.identityCardFront = this.fileList4[0].url;
				uni.showLoading({
					title: "提交申请"
				})
				// console.log('数据', this.list)
				let res = await this.$post('/merchant/add', this.list)
				if (res.code == 200) {
					uni.hideLoading()
					uni.showToast({
						title: '提交成功',
						icon: "none",
						mask: true,
						success: () => {
							setTimeout(() => {
								uni.switchTab({
									url:'/pages/index/index'
								})
							}, 1000)
						}
					})
				} else {
					setTimeout(() => {
						uni.hideLoading()
					}, 1000)
				}
			},
			// 获取商圈列表
			async getListBusinessDistrict() {
				let res = await this.$get('/dev/dict/subordinate/list',{
					dictValue:'BUSINESS_DISTRICT'
				})
				// console.log('商圈列表', res)
				if (res.code === 200) {
					if(res.data){
						res.data.map(d=>{
							d.value = d.id
							d.name = d.dictLabel
						})
						this.options.push(res.data)
						this.businessDistrictName = res.data[0].dictLabel
						this.list.businessDistrictId = res.data[0].value
					}
					
				}
			},
			// 获取商家类型
			async getMerchantType() {
				let res = await this.$get('/dev/dict/subordinate/list',{
					dictValue:'MERCHANT_TYPE'
				})
				// console.log('商家类型', res)
				if (res.code === 200) {
					if(res.data){
						res.data.map(d=>{
							d.value = d.dictValue
							d.name = d.dictLabel
						})
						let array = JSON.parse(JSON.stringify(res.data))
						this.columns = []
						this.columns.push(array)
						this.merchantTypeName = res.data[0].dictLabel
						this.list.merchantType = res.data[0].value
					}
					
				}
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 获取定位
			getLocation() {
				uni.chooseLocation({
					success: (res) => {
						this.list.merchantAddress = res.address;
						this.list.merchantLongitude = res.longitude
						this.list.merchantLatitude = res.latitude
					},
					fail(err) {
						// console.log(err);
						uni.showToast({
							title: '获取失败',
							icon: 'none'
						})
					}
				})
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					uni.showLoading({
						title: '上传中...',
						mask: true
					})
					const result = await this.uploadFilePromise(lists[i].url, event.name)
					if (result.code == 200) {
						uni.hideLoading()
						uni.showToast({
							title: '上传成功',
							icon: "none",
						})
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url
						}))
					}else if(result.code == 413){
						uni.hideLoading()
						uni.showToast({
							title: '图片大小超过2M，上传失败',
							icon: "none",
							mask: true
						})
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'failed',
						}))
					} else {
						uni.hideLoading()
						uni.showToast({
							title: '上传失败,请重新上传',
							icon: "none",
							mask: true
						})
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'failed',
						}))
					}
					fileListLen++
				}
			},
			uploadFilePromise(url, index) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://zy.xry.ink/file-api/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							let obj = {}
							if(res.statusCode == 200){
								let onlineImage = JSON.parse(res.data)
								setTimeout(() => {
									obj.code = res.statusCode
									obj.url = onlineImage.data.url
									resolve(obj)
								}, 1000)
							}else{
								setTimeout(() => {
									obj.code = res.statusCode
									resolve(obj)
								}, 1000)
							}
						},
					});
				})
			},
			confirmType(value) {
				this.list.merchantType = value.value[0].value
				this.merchantTypeName = value.value[0].name
				if (this.list.merchantType != 0) {
					this.list.totalRoomNum = ""
				}
				this.showType = false
			},
			confirmTimeRange(value) {
				this.list.timeRange = value.value[0] + "-" + value.value[1]
				this.showTimeRange = false
			},
			confirmBuss(value) {
				// console.log(value)
				this.list.businessDistrictId = value.value[0].value
				this.businessDistrictName = value.value[0].name
				this.showBuss = false
			}
		}
	}
</script>
<style>
	page {
		background-color: #F5F5F5;
	}
</style>
<style lang="less" scoped>
	.hotelOccupancy {
		position: relative;

		.uploadImage {
			color: #121212;
			font-size: 32rpx;
			font-weight: bold;

			.imageList {
				display: flex;
				justify-content: space-between;
				margin-top: 32rpx;

				.imageItem {
					width: 336rpx;
					height: 192rpx;
					border-radius: 6rpx;
					border: 1px solid #F2F2F2;
					padding: 16rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					position: relative;

					.imageItem-info {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
						color: #707070;

						.camera {
							width: 52rpx;
							height: 52rpx;
						}
					}

					.borderImage {
						width: 308rpx;
						height: 164rpx;
						position: absolute;
						top: 16rpx;
						left: 12rpx;
					}
				}
			}
		}

		.formContent {
			color: #121212;
			font-size: 28rpx;
			padding-bottom: 180rpx;

			.form-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 32rpx 0;
				border-bottom: 2rpx solid #F5F5F5;

				.title {
					width: 30%;
				}

				.form-input {
					width: 68%;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}

				.form-region {
					width: 68%;
					overflow-x: auto;
					text-align: right;
					white-space: nowrap;
					color: #B2B2B2;
				}

				.active {
					color: #121212;
				}
			}
		}

		.bottomTool {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: white;
			padding: 20rpx 52rpx 48rpx 52rpx;
			box-sizing: border-box;
			box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.0300);
			z-index: 10;
		}

		.borderStyle {
			border-radius: 20rpx;
			background-color: white;
			padding: 32rpx 32rpx 40rpx 32rpx;
			margin-top: 20rpx;
		}
	}
</style>
