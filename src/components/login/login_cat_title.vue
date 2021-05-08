<template>
  <div class="logo_container">
    <figure class="logo"></figure>
  </div>
</template>

<script>
export default {
  name: 'catTitle'
}
</script>

<style scoped>
  .logo_container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .logo_container:hover {
    will-change: contents;
  }

  .logo_container .logo {
    width: 200px;
    height: 100px;
    background: url("../../assets/img/logo.svg") no-repeat 50%;
    background-size: 100%;
  }
</style>
