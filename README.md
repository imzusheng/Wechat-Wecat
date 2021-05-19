WeCat
======

启动方式
-----------
需要node/mongodb环境，数据库备份在wecat文件夹，配置完mongodb后执行
```
mongorestore -d wecat ./wecat
npm i
npm run serve
node appModule
```

[项目部署地址](https://zusheng.club/chatV2)
```
测试账号
imzusheng@163.com
a123456
```
<br/>
简介
-----
学习`WebSocket`、`nodejs`、`VUE`路上的动手实践项目，
以实现微信网页版功能的基础上加入一些小功能.

### 基于WebSocket的网页端即时通讯
* 前端项目基于`vue-cli 3.0`搭建，使用到`vue`、`vue-router`、`vuex`、`axios`
* 服务器`nodejs`、`mongodb`、`koa2`、`ws`、`jwt`

<br />
<br />

以下是遇到的一些问题
## 版本一
* 刚接触后台，用`nodejs`的`ws模块`实现`Websocket连接`，不理解`路由、组件、模块化`    
* 相对于`nodejs`更熟悉`PHP、mysql、Nignx`，所以需要切换多种语言    
* 如何判断客户端上线离线，实现私发消息
* 微信网页端切换好友窗口时，聊天记录是不需要请求的。也没有使用indexDB保存，为了实现这个功能创建了一个对象`chatRecord`用于保存临时聊天记录
* 实现拖动发送图片，且显示预览图。发送成功后将图片本地路径替换为服务器地址。文件上传涉及的`nodejs buffer`，拖动上传图片仍然要PHP实现，nodejs上传后保存无法打开，仍未解决
* 没有`vue`，大量交互需要靠`jQuery`编写
* `iframe`窗口的父子间通信，相互调用方法传递参数
* 正则表达式学了就忘，每次都要查手册

## 版本二
* 引入`vue.js`重构之后，`iframe`窗口的父子间相互访问vue实例变得更加复杂
* `bootstrap栅格系统、组件`完成管理员界面、实现不同分辨率适应
* `mysql`到`mongodb`，`PHP`到`nodejs`
* `mongodb` 频繁查询都涉及到js的`Promise、async、await`    
* `es6 module`及`class`封装一个`websocket服务、mongodb数据库`

## 版本三
* 费心机的还是找`logo素材`，`设计排版`
* 使用`vue-cli`之前没接触过`webpack`，不理解原理。以至于初次构建项目时生成了一堆没见过的文件
* vue 在初始化项目配置的时候，有两个运行环境配置的版本：`Compiler 版本、Runtime 版本`
* `组件通信`初次接触有点绕
* `router-view`有很多高级功能有待研究
* 跨域问题，请求类型变成`options`，涉及到`复杂请求`和`简单请求`

## 目前
* 总体设计：前端和后端两大部分
  前端：VUE，后端：nodejs+mongodb
  前端分为两大模块，
  一个是用户界面，主要功能是即时聊天
  一个是后台管理模块，管理用户信息和聊天消息
  
* 亮点：精心打磨的拟态UI设计,
  流畅的过渡动画
  聊天自动过滤粗口

* 难点：
  注册时发送邮箱验证码（模仿APPLE的验证邮箱，用table），
  后端消息管理搜索时间区间内聊天记录时（转换为相同的格式再比较大小），
  获取用户登录的外网IP地址、经纬度信息（通过服务器请求头获取再发送回客户端）
