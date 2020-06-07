<template>
  <div class="loading_container">
    <div class="loading"></div>
  </div>
</template>

<script>
export default {
  name: 'loading_line'
}
</script>

<style scoped>
  .loading_container{
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    width: 100%;
  }

  .loading {
    height: 4px;
    width: 100%;
    background: transparent;
    position: relative;
    overflow: hidden;
  }

  .loading::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 50%;
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
    background-color: #1A73E8;
    animation: loadingAft 2s ease-out infinite;
    animation-delay: .4s;
  }

/*  .loading::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 50%;
    transform: translate(-100%);
    background-color: #1A73E8;
    animation: loadingAft 2s ease-out infinite;
    animation-delay: 1.6s;
  }*/

  @keyframes loadingAft {
    0% {
      transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
      -webkit-transform: translateX(200%);
    }
  }
</style>
