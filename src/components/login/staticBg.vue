<template>
  <!--  猫背景-->
  <ul class="login_cats" :class="{bgFilter : bgFade}">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</template>

<script>
export default {
  name: 'staticBg',
  props: ['bgFade']
}
</script>

<style scoped>
/* -- 猫背景 开始 -- */
.login_cats {
  background: url("../../assets/img/staticBg.png") no-repeat 50%;
  background-size: calc(1920px / 1.2) calc(1080px / 1.4);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  --cat-width: 16px;
  --cat-heigth: 10px;
  z-index: 1;
  overflow: hidden;
}

.bgFilter{
  animation: bgFilter .4s forwards;
}

@keyframes bgFilter {
  0%{
    filter: none;
  }
  100%{
    filter: blur(30px);
  }
}
</style>
