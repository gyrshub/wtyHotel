<template>
	<view class="personal">
		<view class="list">
			<view class="row">
				<image class="userImg" :src="detail.avatar"></image>
				<button class="text" type="balanced" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
					上传头像
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</button>
			</view>
			<view class="row">
				<view class="row_left">
					昵称
				</view>
				<view class="row_right">
					<input type="nickname" class="weui-input" :value="detail.nickName" @blur="bindblur"
						placeholder="请输入昵称"/>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:{
					avatar:'',
					nickName:'',
					id:''
				}
			};
		},
		created() {
			let info = JSON.parse(uni.getStorageSync('userInfo'))
			this.detail = info
		},
		methods:{
			onChooseavatar(e){
				let that = this
				uni.uploadFile({
					url: 'https://zy.xry.ink/file-api/upload', // 仅为示例，非真实的接口地址
					filePath: e.target.avatarUrl,
					name: 'file',
					formData: {
						user: 'test'
					},
					success: (res) => {
						if(res.statusCode == 200){
							let onlineImage = JSON.parse(res.data)
							setTimeout(() => {
								that.detail.avatar = onlineImage.data.url
								that.upLoad()
							}, 1000)
						}else{
							setTimeout(() => {
								uni.showToast({
									title:'上传失败',
									icon:'none'
								})
							}, 1000)
						}
					},
				});
			},
			async upLoad(){
				uni.showLoading({
					title:'加载中...'
				})
				let upload = await this.$post('/user/edit',this.detail)
				if(upload.code == 200){
					uni.hideLoading()
					console.log('结果',upload)
					uni.showToast({
						title:'更新成功',
						icon:'none'
					})
				}else{
					uni.hideLoading()
					uni.showToast({
						title:'更新失败',
						icon:'none'
					})
				}
			},
			bindblur(e){
				this.detail.nickName = e.detail.value
				this.upLoad()
			}
		}
	}
</script>
<style>
	page{
		background: #FFF;
	}
</style>
<style lang="less" scoped>
.personal{
	.list{
		padding: 0 32rpx;
		box-sizing: border-box;
		.row{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			&:not(:last-child){
				border-bottom: 1px solid #F5F5F5;
			}
			.row_left{
				margin-right: 20rpx;
			}
			.row_right{
				text-align: right;
				display: flex;
				align-items: baseline;
			}
		}
	}
	.text{
		width: 70%;
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		font-size: 32rpx;
		padding: 0;
		margin: 0;
		background-color: transparent;
		&::after{
			border: 0;
		}
	}
	.userImg{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		flex-shrink: 0;
		margin-right: 20rpx;
	}
}
</style>
