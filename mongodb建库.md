* ### 创建数据库
```
> use wecheck
```

    如果不插入数据，这时用`show dbs`命令是看不到的，现在可以直接插入数据。

* ### 创建集合
````
> db.createCollection("user")
> db.createCollection("chatRecord")
> db.createCollection("friend")
````

    可以在注册页面注册账户，也可以直接在这里插入一条测试。

* ### 插入文档
````
db.user.insert({
    "UID": "zuheng",
    "UPASS": "lzs",
    "access": "root",
    "answer": "hz",
    "question": "你第一次做飞机去哪里？"
})
````

