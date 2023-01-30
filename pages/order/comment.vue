<template>
	<!-- 发表评论页面 -->
	<view class="comment">
		<view class="label" v-if="customLabel.length>0">
			<view class="title">
				选择标签
			</view>
			<view class="labelList">
				<view :class="['labelItem',{active:item.check}]" v-for="(item,index) in customLabel" :key="index"
					@click="chooseLabel(index)">
					{{item.labelName}}
				</view>
			</view>
		</view>

		<view class="shopInfo">
			<image class="shopPicture" :src="showPicture"></image>
			<view class="score">
				<view style="margin: 0 20rpx 0 20rpx;">商品评分</view>
				<view class="">
					<u-rate activeColor="#FB8146" :gutter="2" v-model="score"></u-rate>
				</view>
			</view>
		</view>

		<view class="commentContent">
			<u--textarea v-model="commentContent" :height="140" placeholder="亲!写点什么吧,您的建议将会对其他的用户有很大的帮助呢..." count
				:maxlength="200"></u--textarea>
		</view>

		<view class="pictureList">
			<view class="title">
				添加图片(限制6张)
			</view>
			<view class="uploadImage-item">
				<view style="margin-left: 40rpx;">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="6"></u-upload>
				</view>
			</view>
		</view>

		<view style="height: 200rpx;"></view>
		<view class="bottomTool">
			<view class="bButton" @click="takeComment">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				userId:'',
				merchantType: 0,
				merchantId:'',
				score: 5,
				commentContent: '',
				fileList1: [],
				customLabel: [],
				showPicture: ''
			};
		},
		onLoad(options) {
			this.id = options.id
			this.merchantType = options.merchantType
			this.userId = options.userId
			this.merchantId = options.merchantId
			this.getLabel()
			this.showPicture = uni.getStorageSync('commentPicture')
		},
		beforeDestroy() {
			uni.removeStorageSync('commentPicture')
		},
		methods: {
			async takeComment() {
				if (this.commentContent == "") {
					uni.showToast({
						title: '请输入评价',
						icon: "none"
					})
					return
				}
				let labelList = []
				let pciture = []
				for (let i = 0; i < this.customLabel.length; i++) {
					if (this.customLabel[i].check) {
						labelList.push(this.customLabel[i].id)
					}
				}
				for (let i = 0; i < this.fileList1.length; i++) {
					pciture.push(this.fileList1[i].url)
				}
				labelList = labelList.length == 0 ? null : labelList
				pciture = pciture.length == 0 ? null : pciture
				let res = await this.$post('/merchant/order/evaluation/add', {
					userId:this.userId,
					orderId: this.id,
					merchantId:this.merchantId,
					evaluationLabelIds: labelList,
					score: this.score,
					evaluationContent: this.commentContent,
					evaluationPicture: pciture,
				})
				if (res.code == 200) {
					uni.showToast({
						title: '提交成功',
						icon: "none",
						mask: true,
						success() {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						}
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					})
				}
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
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 获取评论标签
			async getLabel() {
				let labelText = this.merchantType == 0? 'HOTEL_EVALUATION_LABEL'
				: this.merchantType == 1? 'FOOD_EVALUATION_LABEL'
				: this.merchantType == 2? 'RECREATION_EVALUATION_LABEL' : 'SUPERMARKET_EVALUATION_LABEL'
				let res = await this.$get('/dev/dict/subordinate/list',{
					dictValue:labelText
				})
				// console.log('标签列表', res)
				if (res.code == 200) {
					if (res.data) {
						res.data.map(d => {
							d.check = false
							d.labelName = d.dictLabel
						})
					}
					this.customLabel = res.data || []
				}
			},
			chooseLabel(index) {
				this.customLabel[index].check = !this.customLabel[index].check
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment {
		position: relative;

		.label {
			padding: 20rpx;

			.labelList {
				display: flex;
				flex-wrap: wrap;

				.labelItem {
					background: #F2F2F2;
					border-radius: 19px;
					padding: 16rpx 44rpx;
					font-size: 12px;
					color: #121212;
					margin: 0 14rpx 14rpx 0;
				}

				.active {
					color: white;
					background-color: #2972DE;
				}
			}
		}

		.shopInfo {
			display: flex;
			align-items: center;
			border-bottom: 1px solid #F5F5F5;
			padding: 20rpx;

			.shopPicture {
				width: 160rpx;
				height: 160rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.score {
				display: flex;
				align-items: center;
			}
		}

		.commentContent {
			padding: 20rpx;
		}

		.pictureList {
			color: #121212;
			font-size: 32rpx;
			font-weight: bold;
			padding: 20rpx;
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

			.bButton {
				padding: 20rpx;
				text-align: center;
				color: white;
				border-radius: 10rpx;
				background: linear-gradient(90deg, #FFAA65 0%, #FB8146 100%);

				&:active {
					color: #eeeeee;
					background: linear-gradient(90deg, #ef9d5f 0%, #ec7841 100%);
				}

			}
		}

		.title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
	}
</style>
