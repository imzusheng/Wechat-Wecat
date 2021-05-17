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
  name: 'catsBg',
  props: ['bgFade']
}
</script>

<style scoped>
  /* -- 猫背景 开始 -- */
  .login_cats {
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

  .login_cats li {
    position: absolute;
    border-radius: 5px;
  }

  .login_cats li:nth-of-type(1) {
    height: calc(var(--cat-heigth) * 6);
    width: calc(var(--cat-width) * 6);
    background: #FDEEEC;
    top: 5%;
    left: 5%;
    transform: rotateZ(8deg);
    /*transform-style: preserve-3d;*/
    box-shadow: 3px 3px 12px #d7cac9,
    -3px -3px 12px #ffffff;
  }

  .login_cats li:nth-of-type(2) {
    height: calc(var(--cat-heigth) * 9);
    width: calc(var(--cat-width) * 9);
    background: #FBF2E4;
    top: 25%;
    left: 4%;
    transform: rotate(-8deg);
    box-shadow: 8px 8px 16px #d5cec2,
    -8px -8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(3) {
    height: calc(var(--cat-heigth) * 7);
    width: calc(var(--cat-width) * 7);
    background: #BFE2F4;
    top: 9%;
    left: 21%;
    transform: rotate(-14deg);
    box-shadow: 4px 4px 16px #a2c0cf,
    -4px -4px 16px #dcffff;
  }

  .login_cats li:nth-of-type(4) {
    height: calc(var(--cat-heigth) * 10);
    width: calc(var(--cat-width) * 10);
    background: #BFE2F4;
    top: 48%;
    left: 6%;
    transform: rotate(2deg);
    box-shadow: 10px 0px 16px #a2c0cf,
    -4px -4px 16px #dcffff;
  }

  .login_cats li:nth-of-type(5) {
    height: calc(var(--cat-width) * 8);
    width: calc(var(--cat-heigth) * 10);
    background: #FDEEEC;
    top: 70%;
    left: 8%;
    transform: rotate(-6deg);
    box-shadow: 10px -6px 16px #d7cac9,
    -8px 8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(6) {
    height: calc(var(--cat-heigth) * 10);
    width: calc(var(--cat-width) * 10);
    background: #DCDDE4;
    top: 80%;
    left: 22%;
    transform: rotate(8deg);
    box-shadow: 8px -8px 16px #bbbcc2,
    -8px 8px 16px #fdfeff;
  }

  .login_cats li:nth-of-type(7) {
    height: calc(var(--cat-width) * 8);
    width: calc(var(--cat-heigth) * 10);
    background: #FBF2E4;
    top: 78%;
    left: 69%;
    transform: rotate(-8deg);
    box-shadow: -8px -8px 16px #d5cec2,
    8px 8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(8) {
    height: calc(var(--cat-width) * 10);
    width: calc(var(--cat-heigth) * 11);
    background: #DCDDE4;
    top: 70%;
    left: 86%;
    transform: rotate(10deg);
    box-shadow: -8px -8px 16px #bbbcc2,
    8px 8px 16px #fdfeff;
  }

  .login_cats li:nth-of-type(9) {
    height: calc(var(--cat-heigth) * 10);
    width: calc(var(--cat-width) * 10);
    background: #BFE2F4;
    top: 47%;
    left: 80%;
    transform: rotate(-16deg);
    box-shadow: -8px -8px 16px #a2c0cf,
    8px 8px 16px #dcffff;
  }

  .login_cats li:nth-of-type(10) {
    height: calc(var(--cat-heigth) * 6);
    width: calc(var(--cat-width) * 6);
    background: #BFE2F4;
    top: 5%;
    left: 86%;
    transform: rotate(6deg);
    box-shadow: -8px 8px 16px #a2c0cf,
    8px -8px 16px #dcffff;
  }

  .login_cats li:nth-of-type(11) {
    height: calc(var(--cat-heigth) * 7);
    width: calc(var(--cat-width) * 7);
    background: #FBF2E4;
    top: 7%;
    left: 70%;
    transform: rotate(-6deg);
    box-shadow: -8px 8px 16px #d5cec2,
    8px -8px 16px #ffffff;
  }

  .login_cats li:nth-of-type(12) {
    height: calc(var(--cat-heigth) * 7);
    width: calc(var(--cat-width) * 7);
    background: #FDEEEC;
    top: 25%;
    left: 83%;
    transform: rotate(-10deg);
    box-shadow: -8px 8px 16px #d7cac9,
    8px -8px 16px #ffffff;
  }

  .login_cats li::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .login_cats li:nth-of-type(1)::after {
    background: url("../../assets/ginger-cat/ginger-cat-715.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(2)::after {
    background: url("../../assets/ginger-cat/ginger-cat-750.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(3)::after {
    background: url("../../assets/ginger-cat/ginger-cat-722.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(4)::after {
    background: url("../../assets/ginger-cat/ginger-cat-730.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(5)::after {
    background: url("../../assets/ginger-cat/ginger-cat-729.png") no-repeat 50%;
    background-size: 140%;
  }

  .login_cats li:nth-of-type(6)::after {
    background: url("../../assets/ginger-cat/ginger-cat-732.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(7)::after {
    background: url("../../assets/ginger-cat/ginger-cat-733.png") no-repeat 50%;
    background-size: 100%;
  }

  .login_cats li:nth-of-type(8)::after {
    background: url("../../assets/ginger-cat/ginger-cat-735.png") no-repeat 50%;
    background-size: 100%;
  }

  .login_cats li:nth-of-type(9)::after {
    background: url("../../assets/ginger-cat/ginger-cat-734.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(10)::after {
    background: url("../../assets/ginger-cat/ginger-cat-738.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(11)::after {
    background: url("../../assets/ginger-cat/ginger-cat-740.png") no-repeat 50%;
    background-size: 80%;
  }

  .login_cats li:nth-of-type(12)::after {
    background: url("../../assets/ginger-cat/ginger-cat-749.png") no-repeat 50%;
    background-size: 80%;
  }

  /* -- 猫背景 end -- */
</style>
