<template>
  <div>
    <div class="Avatar_container">
      <figure><img src="../assets/ginger-cat/ginger-cat-720.png" draggable="false"/></figure>
    </div>
    <div class="Avatar_Info">
      <div class="Avatar_name">{{this.$store.state.chatObj}}</div>
      <div class="Avatar_outline">hello world!</div>
    </div>
    <ul class="personal_Info">
      <li>
        <div class="info_position_title">
          <img src="../assets/img/position.png" draggable="false"/>
          <!--          <span>Address：</span>-->
        </div>
        <div class="info_position">
          <img src="../assets/img/lock.png" draggable="false"/>
        </div>
      </li>
      <li>
        <div class="info_phone_title">
          <img src="../assets/img/phone.png" draggable="false"/>
          <!--          <span>Phone：</span>-->
        </div>
        <div class="info_phone">
          <img src="../assets/img/lock.png" draggable="false"/>
        </div>
      </li>
      <li>
        <div class="info_email_title">
          <img src="../assets/img/email.png" draggable="false"/>
          <!--          <span>E-Mail：</span>-->
        </div>
        <div class="info_email">
          <img src="../assets/img/lock.png" draggable="false"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'friendInfo'
}
</script>

<style scoped>
  .Avatar_container {
    width: 100%;
    margin-top: 90px;
    height: 150px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Avatar_container figure {
    height: 150px;
    width: 150px;
    position: absolute;
    border-radius: 50%;
    border: 1px solid #cccccc;
  }

  .Avatar_container figure img {
    height: 100%;
    width: 100%;
  }

  .Avatar_Info {
    padding: 20px 20px;
    text-align: center;
  }

  .Avatar_name {
    font-size: 32px;
    padding-bottom: 15px;
  }

  .Avatar_outline {
    width: 100%;
    padding-bottom: 36px;
    border-bottom: 1px solid #cccccc;
  }

  .personal_Info {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .personal_Info li {
    height: 40px;
    width: 100%;
    line-height: 40px;
    font-size: 13px;
    display: flex;
  }

  .info_position_title,
  .info_phone_title,
  .info_email_title {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999999;
  }

  .info_position_title img {
    height: 18px;
    width: 18px;
    margin: 2px;
  }

  .info_phone_title img {
    height: 22px;
    width: 22px;
  }

  .info_email_title img {
    height: 20px;
    width: 20px;
    margin: 1px;
  }

  .info_position,
  .info_phone,
  .info_email {
    padding: 0 20px;
    line-height: 40px;
  }

  .info_position img,
  .info_phone img,
  .info_email img{
    height: 12px;
    width: 12px;
  }
</style>
