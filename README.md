WeCat
======

启动方式
-----------
需要node/mongodb环境，数据库备份在wecat文件夹，配置完mongodb后执行
```
// 导入数据库
mongorestore -d wecat ./db
// 跑起来
npm i
npm run serve

// 服务器
cd ./server
npm i
node app
```

[项目部署地址](https://zusheng.club/chatV2)
```
测试账号
imzusheng@163.com
a123456
```

feat: 添加新特性
fix: 修复bug
docs: 仅仅修改了文档
style: 仅仅修改了空格、格式缩进、都好等等，不改变代码逻辑
refactor: 代码重构，没有加新功能或者修复bug
perf: 增加代码进行性能测试
test: 增加测试用例
chore: 改变构建流程、或者增加依赖库、工具等
