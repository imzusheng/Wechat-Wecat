<template>
  <div class="avatarCropper">
    <div class="avatarCropperPadding">

      <!--  图片裁剪面板 s -->
      <div class="avatarCropperContainer">
        <img ref="avatar" :src="$store.state.globe.user.avatarUrl" alt="">
      </div>

      <!--  操作面板 s -->
      <div class="avatarCropperPreviewContainer">
        <h1 class="avatarCropperPreviewTitle">预览</h1>
        <!--    预览   s   -->
        <div class="avatarCropperPreview">
          <div ref="avatarCropperPreviewCircle" class="preview1"></div>
          <div ref="avatarCropperPreviewSquare" class="preview2"></div>
        </div>
        <!--    预览   e   -->
        <div class="controlContainer">
          <span>图像尺寸 {{ scale }} x</span>
          <div class="control">
            <el-slider
              @input="scaleCropper"
              v-model="scale"
              :step="0.1"
              :min="0.1"
              :max="3"
              :show-tooltip="false"
            >
            </el-slider>
          </div>
        </div>
        <div class="controlContainer">
          <span>旋转角度 {{ rotate }}°</span>
          <div class="control">
            <el-slider
              @input="rotateCropper"
              v-model="rotate"
              :step="1"
              :min="-180"
              :max="180"
              :show-tooltip="false"
            >
            </el-slider>
          </div>
        </div>
        <div class="avatarCropperPreviewButton">
          <div class="buttonGroup">
            <button class="buttonGroupRepeat">
              <label for="uploadFile"
                     style="position: absolute; height: 100%; width: 100%; top: 0; left: 0; cursor: pointer"></label>
              <input
                id="uploadFile"
                type="file"
                ref="uploadFile"
                :accept="['.png', '.jpg', '.jpeg']"
                style="position: absolute; visibility: hidden; height: 100%; width: 100%; z-index: 999"
                @change="uploadAvatar($event)">
              重新上传
            </button>
            <button class="buttonGroupReset" @click="resetCropper">还原</button>
          </div>
          <div class="buttonGroup">
            <button class="buttonGroupEnter" @click="outputAvatar">确定</button>
            <button class="buttonGroupCancel" @click="$store.state.globe.avatarCropperVisible = false">取消</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs/dist/cropper.min'
import 'cropperjs/dist/cropper.min.css'
import { API_COMMON } from '@/assets/js/api'
import { apiService, apiUpload, fileHandle } from '@/assets/js/Functions'

export default {
  name: 'avatarCropper',
  data () {
    return {
      cropper: '',
      scale: 1,
      rotate: 0
    }
  },
  mounted () {
    // const that = this
    /** [掘金教程](https://juejin.cn/post/6844903955915341831) */
    this.cropper = new Cropper(this.$refs.avatar, {
      dragMode: 'move',
      zoomable: false, // 鼠标不允许缩放图像
      aspectRatio: 1, // 宽高比
      minContainerWidth: 400, // 容器最小的宽度
      minContainerHeight: 400, // 容器最小的高度
      viewMode: 0,
      autoCropArea: 0.8, // 可设置裁剪框的范围，为1则是与整个裁剪区域一样大
      preview: [ // 实时预览
        this.$refs.avatarCropperPreviewCircle,
        this.$refs.avatarCropperPreviewSquare
      ],
      zoom (event) {
        console.log(event.detail.ratio)
        // that.zoom = parseFloat((event.detail.ratio + 1).toFixed(2))
        // if ((event.detail.ratio + 1).toFixed(1) > 3) {
        //   that.zoom = 3
        //   event.preventDefault()
        // }
      },
      crop (event) {
        this.rotate = event.detail.rotate
      }
    })
  },
  methods: {
    /** 缩放头像 */
    scaleCropper () {
      this.cropper.scale(this.scale, this.scale)
    },
    /** 旋转头像 */
    rotateCropper () {
      this.cropper.rotateTo(this.rotate)
    },
    /** 重设头像编辑 */
    resetCropper () {
      this.cropper.reset()
    },
    /** 重新上传新头像 */
    async uploadAvatar (evt) {
      const file = evt.target.files[0]
      const base64Url = await fileHandle.readFileAsync(file)
      // noinspection JSUnresolvedFunction
      this.cropper.replace(base64Url)
    },
    /** 重新设置新头像 */
    // reCropper () {
    //   if (this.cropper) this.cropper.destroy()
    //   this.cropper = new Cropper(this.$refs.avatar, {
    //     dragMode: 'move',
    //     aspectRatio: 1, // 宽高比
    //     minContainerWidth: 400, // 容器最小的宽度
    //     minContainerHeight: 400, // 容器最小的高度
    //     viewMode: 0,
    //     autoCropArea: 0.8, // 可设置裁剪框的范围，为1则是与整个裁剪区域一样大
    //     preview: [ // 实时预览
    //       this.$refs.avatarCropperPreviewCircle,
    //       this.$refs.avatarCropperPreviewSquare
    //     ]
    //   })
    // },
    outputAvatar () {
      this.cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      }).toBlob(async blob => {
        const formData = new FormData()
        formData.append('croppedImage', blob, 'avatar.png')
        const file = formData.get('croppedImage') // 转换为file对象
        apiUpload.upload(file, {
          chunk: false, // 是否分片
          flag: 'avatar'
        }, Progress => {
          console.log(Progress)
        }).then(res => {
          this.uploadSuccess(file, res)
        })
      })
    },
    /** 头像上传成功 */
    async uploadSuccess (file, res) {
      // 获取临时url,将头像显示
      const base64Url = await fileHandle.readFileAsync(file)
      window.sessionStorage.setItem('avatar', base64Url)
      this.$store.state.globe.user.avatarUrl = base64Url
      apiService.updateData(API_COMMON.PUT_COMMON_USER_AVATAR, {
        uid: window.sessionStorage.getItem('uid'),
        avatar: res.data.fileName
      }).then(() => {
        this.$store.state.globe.avatarCropperVisible = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      })
    }
  },
  computed: {},
  watch: {}
}
</script>

<style scoped>

img {
  display: block;
}

.avatarCropper {
  --avatarCropper-height: 400px;
  --avatarCropper-width: 800px;
  height: var(--avatarCropper-height);
  width: var(--avatarCropper-width);
  background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
  box-shadow: 10px 10px 30px rgb(235 235 235), -10px -10px 30px rgb(235 235 235);
  border-radius: 8px;
  transform: translate(-50%, -50%);
  position: absolute;
  overflow: hidden;
  left: 50%;
  top: 50%;
  z-index: 3;
}

.avatarCropperPadding {
  height: 100%;
  width: 100%;
  display: flex;
}

.avatarCropperContainer {
  height: var(--avatarCropper-height);
  width: var(--avatarCropper-height);
  position: relative;
}

.avatarCropperContainer img {
  max-height: var(--avatarCropper-height);
  max-width: var(--avatarCropper-height);
}

.avatarCropperPreviewContainer {
  height: var(--avatarCropper-height);
  width: var(--avatarCropper-height);
  padding: 24px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

.controlContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controlContainer span {
  width: 120px;
}

.control {
  flex: 1;
  font-size: 15px;
  color: #444;
  box-sizing: border-box;
  padding: 0 10px;
}

.avatarCropperPreviewTitle {
  font-size: 18px;
}

.avatarCropperPreview {
  height: 140px;
  margin: 24px 0;
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.avatarCropperPreview .preview1 {
  height: 140px;
  width: 140px;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.avatarCropperPreview .preview2 {
  height: 140px;
  width: 140px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.avatarCropperPreviewButton {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
}

.avatarCropperPreviewButton .buttonGroup {
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.avatarCropperPreviewButton .buttonGroup button {
  box-sizing: border-box;
  border: none;
  padding: 2px 10px;
  border-radius: 4px;
  height: 32px;
  cursor: pointer;
  box-shadow: 2px 2px 8px #d5d5d5,
  -2px -2px 8px #ffffff;
  position: relative;
}

.buttonGroup .buttonGroupRepeat {
  color: #fff;
  background: linear-gradient(145deg, #44a9ff, #3a8ee6);
}

.buttonGroup .buttonGroupReset {
  margin-left: 16px;
  color: #fff;
  background: linear-gradient(145deg, #ff4444, #e63a3a);
}

.buttonGroup .buttonGroupEnter {
  color: #444;
  margin-right: 16px;
  background: linear-gradient(145deg, #92ff92, #7ae67a);
}

.buttonGroup .buttonGroupCancel {
  color: #444;
  background: #F2F2F2;
}

/*.avatarCropperPreviewTitle {*/
/*  height: 70px;*/
/*  width: 100%;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  color: #444;*/
/*  font-size: 18px;*/
/*}*/

/*.avatarUpload {*/
/*  height: 50px;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  font-size: 14px;*/
/*  color: blue;*/
/*}*/

/*.avatarCropperPreviewOutput {*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: flex-end;*/
/*  margin-top: 66px;*/
/*}*/

/*.avatarCropperPreviewOutput button {*/
/*  border: none;*/
/*  height: 36px;*/
/*  width: 80px;*/
/*  background: #65C564;*/
/*  color: rgba(250, 250, 250, 1);*/
/*  cursor: pointer;*/
/*}*/

/*.avatarCropperPreviewOutput button:first-child {*/
/*  background: rgba(220, 220, 220, 1);*/
/*  margin-right: 24px;*/
/*  color: #666;*/
/*}*/
</style>
