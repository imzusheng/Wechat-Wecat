<template>
  <div class="input_Container">
    <input
      type="text"
      id="inputText"
      name="inputText"
      autocomplete="off"
      v-model="G.inputText"
      @focus="inputFocus"
      @blur="inputBlur"/>
    <div class="input_Tips"
         :class="{'input_Tips_active': G.inputActive || G.inputText, 'input_Tips_color': G.inputActive, 'input_Tips_err': $store.state.signPage[typeStatus] && $store.state.signPage[typeStatus] !== '您需要验证此电子邮件地址属于您'}">
      {{tips}}
    </div>
    <div class="input_Border"
         :class="{'input_Border_active': G.inputActive, 'input_Border_err': $store.state.signPage[typeStatus] && $store.state.signPage[typeStatus] !== '您需要验证此电子邮件地址属于您'}"></div>
    <div class="warning"
         :style="{color: $store.state.signPage[typeStatus] && $store.state.signPage[typeStatus] !== '您需要验证此电子邮件地址属于您' ? '#d93025' : '#1A73E8'}">
      <span class="warning_img"
            v-if="$store.state.signPage[typeStatus] && $store.state.signPage[typeStatus] !== '您需要验证此电子邮件地址属于您'"></span>
      {{$store.state.signPage[typeStatus]}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'inputZs',
  props: ['tips', 'type', 'typeStatus'],
  data () {
    return {
      G: {
        inputText: '',
        inputActive: false,
        warningStatus: false
      }
    }
  },
  methods: {
    inputFocus () {
      this.G.inputActive = true
      /*      if (this.$store.state.signPage[this.typeStatus] !== '您需要验证此电子邮件地址属于您') {
        this.$store.commit('signInputRestore', {
          type: this.type
        })
      } */
    },
    inputBlur (e) {
      this.G.inputActive = false
      // 每次失去焦点都会检查一次是否符合标准,并同步到store
      this.$store.commit('signInputCheck', {
        type: this.type,
        data: this.G.inputText
      })
    }
  }
}
</script>

<style scoped>
  .input_Container {
    --common-color: #1A73E8;
    --error-Color: #d93025;
    --content-height: 60px;
    --active-Color: #1A73E8;
    height: var(--content-height);
    position: relative;
  }

  #inputText {
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
    padding: 0px 3px;
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
    top: 66px;
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
    background: url("../assets/img/warning.png") no-repeat 50%;
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
