2<template>
  <div class="input_Container">
    <input
      type="text"
      id="inputText"
      name="inputText"
      autocomplete="off"
      @focus="inputFocus"
      @blur="inputBlur"
      v-model="inputObj.inputText">
    <div class="input_border"
         :class="{'border_notActive' : !inputObj.inputText || inputObj.tipsActive, 'border_Active' : inputObj.inputText  || inputObj.tipsActive, 'border_error' : inputObj.errStatus}"></div>
    <span class="input_tips"
          :class="{'tips_notActive' : !inputObj.inputText || inputObj.tipsActive, 'tips_Active' : inputObj.inputText || inputObj.tipsActive, 'font_error' : inputObj.errStatus}">{{tips}}</span>
    <span class="input_tips_bg" :style="{visibility : inputObj.tipsActive || inputObj.inputText ? 'visible' : 'hidden'}"></span>
  </div>
</template>

<script>
export default {
  name: 'inputGoogle',
  props: ['tips'],
  data () {
    return {
      inputObj: {
        inputText: '',
        tipsActive: false, // 输入框内提示内容状态（电子邮箱或用户名是否缩小）
        errStatus: false, // 服务器返回错误时为true
        errInfo: ''
      }
    }
  },
  methods: {
    inputFocus () {
      this.inputObj.tipsActive = true
    },
    inputBlur () {
      this.inputObj.tipsActive = false
    }
  }
}
</script>

<style scoped>
  .input_Container {
    --common-color: #1A73E8;
    --error-color: #F25022;
    height: 80px;
    width: calc(32px * 10);
    margin: auto;
    position: relative;
  }

  #inputText {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 58px;
    font-size: 18px;
    color: #333333;
    box-sizing: border-box;
    border: none;
    outline: none;
    padding-left: 12px;
    background: none;
    z-index: 3;
  }

  #inputText:hover{
    will-change: auto;
  }

  .input_border {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 58px;
    border-radius: 4px;
    box-sizing: border-box;
    background: #ffffff;
  }

  .input_tips {
    position: absolute;
    top: 0;
    left: 0;
    height: 80px;
    width: 100%;
    color: #888888;
    box-sizing: border-box;
    transition: padding .15s, font-size .15s;
    z-index: 2;
  }

  .input_tips_bg {
    background: #ffffff;
    position: absolute;
    height: 4px;
    width: 120px;
    top: 21px;
    left: 5px;
    z-index: 1;
    visibility: hidden;
  }

  .border_notActive {
    border: 1px solid #ccc;
  }

  .border_Active {
    border: 2px solid var(--common-color);
  }

  .border_error {
    border: 2px solid var(--error-color) !important;
  }

  .font_error {
    color: var(--error-color) !important;
  }

  .tips_notActive {
    font-size: 15px;
    padding: 40px 16px 0;
  }

  .tips_Active {
    padding: 12px 10px 0;
    font-size: 14px;
    color: var(--common-color);
  }
</style>
