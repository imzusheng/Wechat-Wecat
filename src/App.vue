<template>
  <div id="root">
    <router-view></router-view>
  </div>
</template>

<style>
  * {
    font-family: Microsoft YaHei, sans-serif, monospace;
    padding: 0;
    margin: 0;
    list-style: none;
    text-decoration: none;
    scrollbar-width: thin !important;
  }

  html, body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .noSelect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    user-select: none;
  }

  .fade-enter-active {
    transition: all .4s;
  }

  .fade-leave-active {
    transition: all .4s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  /* 设置滚动条的样式 */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: transparent;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #888888;
  }

</style>
