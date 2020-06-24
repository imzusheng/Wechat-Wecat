WeCat
======

学习`WebSocket`、`nodejs`、`VUE`路上的动手实践项目，
以实现微信网页版功能的基础上加入一些小功能.

### 基于WebSocket的网页端即时通讯
* 前端项目基于`vue-cli 3.0`搭建，使用到`vue`、`vue-router`、`vuex`、`axios`
* 服务器`nodejs`、`mongodb`、`koa2`、`ws`、`jwt`

<br />
<br />

起步时到现在共经历了三次重构，以下是遇到的一些问题
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

## 版本三（目前）
* 费心机的还是找`logo素材`，`设计排版`
* 使用`vue-cli`之前没接触过`webpack`，不理解原理。以至于初次构建项目时生成了一堆没见过的文件
* vue 在初始化项目配置的时候，有两个运行环境配置的版本：`Compiler 版本、Runtime 版本`
* `组件通信`初次接触有点绕
* `router-view`有很多高级功能有待研究
* 跨域问题，请求类型变成`options`，涉及到`复杂请求`和`简单请求`
