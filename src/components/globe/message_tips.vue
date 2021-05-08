<template>
  <div :class="$store.state.globe.messageTips ? 'message_tips wrap_slide_top' : 'message_tips wrap_slide_top_out'">
    <!--    -->
    <div class="message_tips_name">{{ $store.state.globe.messageName }}</div>
    <div class="message_tips_content">
      <img
        :style="{display : $store.state.globe.messageImgDisplay ? 'block' : 'none'}"
        :src="$store.state.globe.messageImgSrc"
        alt=""
      />
      <span>{{ this.$store.state.globe.messageContent }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message_tips',
  data () {
    return {}
  },
  methods: {},
  watch: {
    /*    '$store.state.globe.messageEventLoop': function () {
      if (this.$store.state.globe.messageEventLoop.length > 0) {
        this.$store.dispatch('showTips', this.$store.state.globe.messageEventLoop[0]).then(data => {
          if (data) this.$store.state.globe.messageEventLoop.shift()
        })
      }
    } */
  }
}
</script>

<style scoped>
.message_tips {
  padding: 14px 20px;
  box-sizing: border-box;
  background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1));
  box-shadow: 4px 4px 20px rgb(225, 225, 235),
  -4px -4px 20px rgba(235, 235, 235, 1);
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 4px;
  transform: translate(-50%, -100%);
  z-index: 99;
}

.message_tips_name {
  box-sizing: border-box;
}

.message_tips_content {
  letter-spacing: 1px;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-items: center;
  align-items: center;
}

.message_tips_content img {
  height: 19px;
  margin: 0 6px;
}

/** 以下动画效果 */

.wrap_slide_top {
  animation: wrap_slide_top .4s forwards;
}

@keyframes wrap_slide_top {
  0% {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.wrap_slide_top_out {
  animation: wrap_slide_top_out .4s forwards;
}

@keyframes wrap_slide_top_out {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
}
</style>
