<template>
	<!-- 分销申请页面 -->
	<view class="distributionApply">
		<!-- <u-alert title="驳回原因"  type = "error" :closable="true" :description = "userInfo.platformFailReason" v-if="userInfo.platformFailReason" fontSize="16"></u-alert> -->
		<view class="uploadImage borderStyle">
			<view>请拍摄并上传身份证照片</view>
			<view class="imageList">
				<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="1" width="168" height="94" imageMode="aspectFit">
					<view class="imageItem">
						<image class="borderImage" src="/static/border.png" v-if="!fileList1.length"></image>
						<view class="imageItem-info" v-if="!fileList1.length">
							<image class="camera" src="/static/camera.png"></image>
							<view>上传人像面</view>
						</view>
					</view>
				</u-upload>
				
				<u-upload :fileList="fileList2" @afterRead="afterRead" @delete="deletePic" name="2" multiple
					:maxCount="1" width="168" height="94" imageMode="aspectFit">
					<view class="imageItem">
						<image class="borderImage" src="/static/border.png" v-if="!fileList2.length"></image>
						<view class="imageItem-info" v-if="!fileList2.length">
							<image class="camera" src="/static/camera.png"></image>
							<view>上传国徽面</view>
						</view>
					</view>
				</u-upload>
			</view>
		</view>
		<view class="formContent borderStyle">
			<view class="form-item">
				<view class="title">姓名
					<view style="color: rgb(194, 5, 5);margin-left: 10rpx;">*</view>
				</view>
				<view class="form-input">
					<u--input placeholder="请输入姓名" border="none" v-model="list.realName" inputAlign="right"></u--input>
				</view>
			</view>

			<view class="form-item">
				<view class="title">身份证号码<view style="color: rgb(194, 5, 5);margin-left: 10rpx;">*</view>
				</view>
				<view class="form-input">
					<u--input type="idcard" placeholder="请输入身份证号码" border="none" v-model="list.identityCard"
						inputAlign="right"></u--input>
				</view>
			</view>

			<view class="form-item">
				<view class="title">手机号码<view style="color: rgb(194, 5, 5);margin-left: 10rpx;">*</view>
				</view>
				<view class="form-input">
					<u--input type="number" placeholder="请输入手机号码" border="none" v-model="list.salesmanPhone" inputAlign="right">
					</u--input>
				</view>
			</view>
		</view>

		<view class="bottomTool">
			<u-button color="linear-gradient(90deg, #FFAA65 0%, #FB8146 100%)" shape="circle" text="下一步"
				@click="confirmApply"></u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:'',
				list: {
					userId:'',
					realName: '',
					identityCard: '', // 身份证
					salesmanPhone: '',
					identityCardFront: '', // 国徽
					identityCardReverse: '' // 人像
				},
				fileList1: [],
				fileList2: [],
				chooseRegion: false,
				defaultAddress: ["广东省", "佛山市", "南海区"],
				showRegion: false,
				// 身份证的正则
				identityRule: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
				phoneRule: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
			};
		},
		created() {
			let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			this.userInfo = userInfo
			this.list.userId = this.userInfo.id
		},
		methods: {
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
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
				uni.showLoading({
					title:'上传中...',
					mask:true
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url,event.name)
					// console.log('上传结果',result)
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
			uploadFilePromise(url,index) {
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
			// 提交审核
			async confirmApply() {
				let that = this
				if (that.list.realName == "") {
					uni.showToast({
						title: '请输入姓名',
						icon: "none"
					})
					return
				}

				if (!(that.phoneRule.test(that.list.salesmanPhone))) {
					uni.showToast({
						title: '手机号码输入不规范',
						icon: "none"
					})
					return
				}

				if (!(that.identityRule.test(that.list.identityCard))) {
					uni.showToast({
						title: '身份证号码输入不规范',
						icon: "none"
					})
					return
				}

				if (this.fileList2.length == 0) {
					uni.showToast({
						title: '请上传身份证国徽面',
						icon: "none"
					})
					return
				}

				if (this.fileList1.length == 0) {
					uni.showToast({
						title: '请上传身份证人像面',
						icon: "none"
					})
					return
				}
				that.list.identityCardFront = this.fileList2[0].url
				that.list.identityCardReverse = this.fileList1[0].url
				uni.showLoading({
					title:"提交申请"
				})
				let res = await this.$post('/salesman/add',that.list)
				if(res.code == 200){
					uni.hideLoading()
					uni.showToast({
						title:'提交成功',
						icon:"none",
						mask:true,
						success: () => {
							setTimeout(()=>{
								uni.switchTab({
									url:'/pages/my/index'
								})
							},1000)
						}
					})
				}else{
					uni.hideLoading()
				}
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
	.distributionApply {
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
					display: flex;
				}

				.form-input {
					width: 68%;
					display: flex;
					align-items: center;
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
		}

		.borderStyle {
			border-radius: 20rpx;
			background-color: white;
			padding: 32rpx 32rpx 40rpx 32rpx;
			margin-top: 20rpx;
		}
	}
</style>
