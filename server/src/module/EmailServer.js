const nodemailer = require('nodemailer')
const Config = require('../../config')

/**
 * 封装邮箱服务器
 */
module.exports = (data) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: Config.email.host,
      port: Config.email.port,
      secure: Config.email.secure,
      auth: {
        user: Config.email.user,
        pass: Config.email.pass
      }
    })

    transporter.sendMail({
      from: `WeCat👻 <${Config.email.user}>`,
      to: data.obj,
      subject: `${data.code} 是您的 WeCat 验证码`,
      text: '验证码',
      html: `
      <table border="0" style="border: none; padding: 20px 30px; margin: auto; height: 400px; width: 470px">
        <tr style="display: inline-block"><td style="display: inline-block"><h1 style="text-align: left">确认您的邮件地址</h1></td></tr>
        <tr style="display: inline-block"><td style="display: inline-block"><p style="text-align: left">在创建 Wecat 账号之前，你需要完成一个简单的步骤。让我们确保这是正确的邮件地址 — 请确认这是用于你的新账号的正确地址。</p></td></tr>
        <tr><td><br/></td></tr>
        <tr style="display: inline-block;"><td style="display: inline-block"><p style="text-align: left">请输入此验证码以开始使用 Wecat：</p></td></tr>
        <tr><td><br/></td></tr>
        <tr><td style="text-align: center;"><h1 style="padding: 5px 12px; letter-spacing: .5px; margin: 0 border: none; border-radius: 6px; display: inline-block">${data.code}</h1></td></tr>
        <tr><td><br/></td></tr>
        <tr style="display: inline-block"><td style="display: inline-block"><p style="text-align: left">WeCat</p></td></tr>
      </table>
      `
    }, (error) => {
      if (error) {
        console.error('发送邮件出现错误', error)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
