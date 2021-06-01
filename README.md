<h1 align="center">WeCat</h1>

<p align="center">
    <a href="https://zusheng.club/chatV2">
        <img src="https://img.shields.io/badge/项目地址-zusheng.club/chatV2-green.svg?style=flat-square" alt="项目地址">
    </a>
    <a href="https://zusheng.club">
        <img src="https://img.shields.io/badge/博客-zusheng-blue.svg?style=flat-square" alt="博客地址">
    </a>
</p>

### 介绍

* 基于Vue.js全家桶 + WebSocket + Node.js + Koa2 + MongoDB的即时聊天项目
* 这是我的毕设项目，功能部分参考微信，附加上一些有意思的功能。项目代码注释非常详细，是学习Vue、Node.js、koa一个不错的全栈入门项目。  
* 项目前后端和部署独立完成，各种交互以及各种业务逻辑功能上有不完善的地方欢迎提出😄

### 项目展示

>#####   1. 登录

![登录](https://zusheng.club/public/login.png)

>#####   2. 注册

![注册](https://zusheng.club/public/sign.png)

>#####   3. 找回密码

![找回密码](https://zusheng.club/public/forget.png)

>#####   4. 注册成功，选择头像

![注册成功](https://zusheng.club/public/sign_success.png)

>#####   5. 主面板

![主面板](https://zusheng.club/public/index.png)

>#####   6. 添加好友

![添加好友](https://zusheng.club/public/addFri.png)

>#####   7. 好友信息面板

![好友信息面板](https://zusheng.club/public/friendInfo.png)

>#####   8. 发送信息和文件

![发送信息和文件](https://zusheng.club/public/sendFile.png)

>#####   9. 多功能面板，发送表情

![多功能面板](https://zusheng.club/public/emoji.png)

>#####   10. 个性化设置菜单

![个性化设置菜单](https://zusheng.club/public/setting.png)

>#####   11. 管理员页，用户信息

![管理员页](https://zusheng.club/public/admin_userInfo.png)

>#####   12. 查询所有聊天记录

![查询所有聊天记录](https://zusheng.club/public/admin_chat.png)

>#####   13. 聊天记录详情

![聊天记录详情](https://zusheng.club/public/admin_chat_detail.png)

>#####   14. API 文档

![API](https://zusheng.club/public/apiDoc.png)

### 目录结构

>   1. server 是服务器
>   2. public 是静态文件
>   3. db 是MongoDB导出备份
>   4. src 是项目文件夹

### 安装教程

>   1. 克隆项目```git clone https://github.com/imzusheng/Wecat.git```
>   2. cd 项目根目录，安装依赖 ```npm install```
>   3. 运行服务 ```npm run serve```
>   4. cd ./server，再安装服务器依赖 ```npm install```
>   5. 导入数据库 ```mongorestore -d wecat ./db```
>   6. 运行服务器 ```npm run dev```

### 测试账号

> userID：**test@163.com**  
> password：**a123456**

### TODO
- [x] 登录
- [x] 防止重复登录
- [x] 最近登录时间
- [x] 最近登录地点（省-市-区）
- [x] 注册（邮箱验证）
- [x] 找回密码（邮箱验证）
- [x] 选择用户头像
- [x] 登出
- [x] 好友点对点聊天
- [x] ws心跳连接与掉线重连
- [x] 好友上线和下线提示
- [x] 加好友及验证好友请求
- [x] 好友请求通知
- [x] 未读消息提示
- [x] 搜索用户
- [x] 用户个性化配置
- [x] 聊天记录懒加载
- [x] 好友输入状态实时更新
- [x] 网站标题实时显示未读消息条数
- [x] 最近聊天的好友置顶
- [x] 后台管理
- [x] 聊天图片与文件上传（分片上传）
- [x] 聊天图片与文件预览和下载
- [ ] 群聊
- [ ] 用户资料卡
- [ ] 删除好友
- [ ] 创建群
- [ ] 群资料卡
- [ ] 加群
- [ ] 退群

### 相关技术栈

* **VueCli 3**
* **Vuex**
* **Node.js**
* **Element-ui**
* **axios**
* **MongoDB**
* **koa2**
* **WebSocket**
* **ws**

###关于
* 👉 **邮箱 imzusheng@163.com**
* 👉 [项目地址](https://zusheng.club/chatV2)  
* 👉 [关于我](https://zusheng.club)
* 👉 [github](https://github.com/imzusheng/Wecat)  
* 👉 [gitee](https://gitee.com/imzusheng/Wecat)




[comment]: <> (feat: 添加新特性)

[comment]: <> (fix: 修复bug)

[comment]: <> (docs: 仅仅修改了文档)

[comment]: <> (style: 仅仅修改了空格、格式缩进、都好等等，不改变代码逻辑)

[comment]: <> (refactor: 代码重构，没有加新功能或者修复bug)

[comment]: <> (perf: 增加代码进行性能测试)

[comment]: <> (test: 增加测试用例)

[comment]: <> (chore: 改变构建流程、或者增加依赖库、工具等)
