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
    scrollbar-width: thin!important;
  }

  html,body{
    overflow: hidden;
  }

  .noSelect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    user-select: none;
  }

  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    /*width: 12px;*/
    width: 0;
    background-color: transparent;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #888;
  }
</style>
