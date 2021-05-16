<template>
  <div class="input_Container">
    <input
      type="text"
      class="inputText"
      name="inputText"
      autocomplete="off"
      v-model="inputText"
      @change="$emit('inputChange', inputText)"
      @focus="inputFocus"
      @blur="inputBlur"/>
    <div class="input_Tips"
         :class="{'input_Tips_active': inputActive || inputText, 'input_Tips_color': inputActive, 'input_Tips_err': inputObj.errStatus}">
      {{inputObj.tips}}
    </div>
    <div class="input_Border"
         :class="{'input_Border_active': inputActive, 'input_Border_err': inputObj.errStatus}"></div>
    <div class="warning" v-if="inputObj.errStatus" :style="{color: inputObj.errStatus ? '#d93025' : '#1A73E8'}">
      <span class="warning_img"></span>
      {{inputObj.errInfo}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'inputCommon',
  props: ['inputObj'],
  data () {
    return {
      inputText: '',
      inputActive: false
    }
  },
  methods: {
    inputFocus () {
      this.inputActive = true
    },
    inputBlur () {
      this.inputActive = false
      // 每次失去焦点都会检查一次是否符合标准,并同步到store
    }
  }
}
</script>

<style scoped>
  .input_Container {
    --common-color: #1A73E8;
    --error-Color: #d93025;
    --content-height: 70px;
    --active-Color: #1A73E8;
    height: var(--content-height);
    position: relative;
  }

  .inputText {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--content-height) * 0.7);
    font-size: calc(var(--content-height) / 3.5);
    line-height: calc(var(--content-height) * 0.7);
    color: #333333;
    box-sizing: border-box;
    border: none;
    outline: none;
    padding: 0 10px;
    background: none;
    z-index: 3;
  }

  .input_Tips {
    text-align: center;
    display: inline-block;
    height: calc(var(--content-height) / 3.6);
    font-size: calc(var(--content-height) / 3.6);
    line-height: calc(var(--content-height) / 3.6);
    bottom: calc(((var(--content-height) * 0.7) - calc(var(--content-height) / 3.6)) / 2);
    left: 12px;
    z-index: 2;
    color: #888888;
    padding: 0 3px;
    position: absolute;
    background: #FFFFFF;
    transition: all .15s;
  }

  .input_Border {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--content-height) * 0.7);
    border-radius: 4px;
    border: 1px solid #CCCCCC;
    z-index: 1;
  }

  .warning {
    position: absolute;
    left: 4px;
    top: 76px;
    color: var(--error-Color);
    font-size: 13px;
    display: flex;
    justify-content: left;
  }

  .warning_img {
    display: block;
    height: 18px;
    width: 18px;
    min-width: 18px;
    min-height: 18px;
    background: url("../../assets/img/warning.png") no-repeat 50%;
    background-size: 100% auto;
    margin-right: 8px;
  }

  .input_Border_active {
    border: 2px solid var(--active-Color);
  }

  .input_Border_err {
    border: 2px solid var(--error-Color);
  }

  .input_Tips_active {
    bottom: calc((var(--content-height) * 0.7) - (calc(var(--content-height) / 4.6)) / 2);
    font-size: calc(var(--content-height) / 4.6);
  }

  .input_Tips_color {
    color: var(--active-Color);
  }

  .input_Tips_err {
    color: var(--error-Color);
  }
</style>
