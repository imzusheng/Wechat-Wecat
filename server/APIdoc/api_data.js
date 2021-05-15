define({ "api": [
  {
    "type": "Post",
    "url": "/wechatAPI/sign/verify",
    "title": "注册前验证",
    "name": "1",
    "version": "1.0.0",
    "group": "注册",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "nickName",
            "description": "<p>昵称</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n  \"email\": \"imzusheng@163.com\",\n  \"nickName\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Number",
            "optional": false,
            "field": "data.code",
            "description": "<p>验证码</p>"
          },
          {
            "group": "成功响应参数",
            "type": "Number",
            "optional": false,
            "field": "data.msg",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email.value",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "data.email.error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email.msg",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName.value",
            "description": "<p>昵称</p>"
          },
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "data.nickName.error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName.msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  data: {\n     email: {\n       \"value\": \"imzusheng@163.com\",\n       \"error\": false,\n       \"msg\": \"success\"\n     },\n     nickName: {\n       \"value\": 'test',\n       \"error\": false,\n       \"msg\": \"success\"\n     },\n     msg: \"验证码发送成功\"\n     code: 123456\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Number",
            "optional": false,
            "field": "data.code",
            "description": "<p>验证码</p>"
          },
          {
            "group": "失败响应参数",
            "type": "Number",
            "optional": false,
            "field": "data.msg",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email.value",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "data.email.error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email.msg",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName.value",
            "description": "<p>昵称</p>"
          },
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "data.nickName.error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName.msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  data: {\n     email: {\n       \"value\": 'imzusheng@163.com',\n       \"error\": true,\n       \"msg\": '该邮箱已被注册'\n     },\n     nickName: {\n       \"value\": '',\n       \"error\": true,\n       \"msg\": '该昵称已被注册'\n     },\n     \"msg\": \"验证码发送失败\"\n     code: 123445\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "注册",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/sign/verify"
      }
    ]
  },
  {
    "type": "Post",
    "url": "/wechatAPI/sign/success",
    "title": "注册成功",
    "name": "2",
    "version": "1.0.0",
    "group": "注册",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "nickName",
            "description": "<p>昵称</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "trueName",
            "description": "<p>真实名字</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "pwd",
            "description": "<p>密码</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "avatar",
            "description": "<p>头像链接</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n  \"email\": \"imzusheng@163.com\",\n  \"nickName\": \"\"\n  \"trueName\": \"\"\n  \"pwd\": \"\"\n  \"avatar\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  msg: \"注册成功\",\n  error: false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  msg: \"注册失败\",\n  error: true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "注册",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/sign/success"
      }
    ]
  },
  {
    "type": "Post",
    "url": "/wechatAPI/login/userID",
    "title": "验证用户名",
    "name": "1",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "nickName",
            "description": "<p>昵称</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n  \"userID\": \"imzusheng@163.com\",\n  \"nickName\": \"zusheng\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>信息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName",
            "description": "<p>昵称</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.avatar",
            "description": "<p>头像</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  \"msg\": \"success\",\n  \"error\": false,\n  \"data\": {\n      \"email\": \"imzusheng@163.com\",\n      \"nickName\": \"zusheng\",\n      \"avatar\": \"\",\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  \"msg\": \"请输入有效的邮箱地址或账号\"\n  \"error\": true,\n  \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/userID"
      }
    ]
  },
  {
    "type": "Post",
    "url": "/wechatAPI/login/pwd",
    "title": "验证密码",
    "name": "2",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "pwd",
            "description": "<p>密码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Sample:",
          "content": "{\n  \"email\": \"imzusheng@163.com\",\n  \"pwd\": \"123456\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>信息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>令牌</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName",
            "description": "<p>昵称</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.trueName",
            "description": "<p>真实姓名</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.avatar",
            "description": "<p>头像</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.access",
            "description": "<p>权限</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"error\": false,\n  \"msg\": \"success\",\n  \"token\": \"......\"\n  \"data\": {\n      \"email\": \"imzusheng@163.com\",\n      \"nickName\": \"zusheng\",\n      \"trueName\": \"zusheng\",\n      \"avatar\": \"\",\n      \"access\": \"user\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"msg\": \"密码错误，请重试或点击“忘记密码”以重置密码\"\n  \"error\": true,\n  \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/pwd"
      }
    ]
  },
  {
    "type": "Get",
    "url": "/wechatAPI/login/checkRepeatLogin",
    "title": "验证是否重复登录",
    "name": "3",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Sample:",
          "content": "{\n  \"email\": \"imzusheng@163.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>信息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email",
            "description": "<p>用户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"msg\": \"\",\n  \"error\": false\n  \"data\": {\n      \"email\": \"imzusheng@163.com\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email",
            "description": "<p>用户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"msg\": \"请勿重复登录\"\n  \"error\": true,\n  \"data\": {\n      \"email\": \"imzusheng@163.com\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/checkRepeatLogin"
      }
    ]
  },
  {
    "type": "Put",
    "url": "/wechatAPI/login/update",
    "title": "登录后更新用户信息",
    "name": "4",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "time",
            "description": "<p>登录时间</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "address.Country",
            "description": ""
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "address.Province",
            "description": ""
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "address.City",
            "description": ""
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "address.Isp",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Sample:",
          "content": "{\n  \"email\": \"imzusheng@163.com\",\n  \"time\": \"\",\n  \"address\": {\n     Country: '中国',\n     Province: '广东省',\n     City: '广州',\n     Isp: '移动'\n  }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"msg\": \"更新成功\",\n  \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"msg\": \"更新失败\",\n  \"error\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/update"
      }
    ]
  },
  {
    "type": "Post",
    "url": "/wechatAPI/login/forget",
    "title": "忘记密码",
    "name": "5",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n  \"email\": \"imzusheng@163.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>验证码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  code: 123456\n  msg: \"验证码发送成功\",\n  error: false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>验证码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  code: \"\",\n  msg: \"验证码发送失败\" / \"该邮箱地址不存在\",\n  error: true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/forget"
      }
    ]
  },
  {
    "type": "Put",
    "url": "/wechatAPI/login/modifyPwd",
    "title": "修改密码",
    "name": "6",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "pwd",
            "description": "<p>邮箱</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n  \"email\": \"imzusheng@163.com\",\n  \"pwd\": \"123456\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  msg: \"修改密码成功\",\n  error: false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  msg: \"修改密码失败\",\n  error: true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/modifyPwd"
      }
    ]
  },
  {
    "type": "Get",
    "url": "/wechatAPI/login/userOrigin",
    "title": "获取用户真实IP",
    "name": "7",
    "version": "1.0.0",
    "group": "登录",
    "parameter": {
      "examples": [
        {
          "title": "请求示例:",
          "content": "{}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.IPAddress",
            "description": "<p>IP地址</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.result.Country",
            "description": "<p>国家</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.result.Province",
            "description": "<p>省份</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.result.City",
            "description": "<p>城市</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.result.Isp",
            "description": "<p>运营商</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  msg: \"获取成功\",\n  error: false,\n  data: {\n    \"IPAddress\": \"192.168.1.1\",\n    \"result\": {\n       Country: '中国',\n       Province: '广东省',\n       City: '广州',\n       Isp: '移动'\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>消息</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "data.IPAddress",
            "description": "<p>IP地址</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  msg: \"获取失败\",\n  error: true,\n  data: {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/login.js",
    "groupTitle": "登录",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/login/userOrigin"
      }
    ]
  },
  {
    "type": "Get",
    "url": "/wechatAPI/common/chatHistory",
    "title": "获取历史聊天记录",
    "name": "1",
    "version": "1.0.0",
    "group": "通用",
    "parameter": {
      "fields": {
        "请求参数": [
          {
            "group": "请求参数",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>用户名</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "请求示例:",
          "content": "{\n  \"userID\": \"imzusheng@163.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "成功响应参数": [
          {
            "group": "成功响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>信息</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.email",
            "description": "<p>用户名</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.nickName",
            "description": "<p>昵称</p>"
          },
          {
            "group": "成功响应参数",
            "type": "String",
            "optional": false,
            "field": "data.avatar",
            "description": "<p>头像</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功响应示例:",
          "content": "{\n  \"msg\": \"success\",\n  \"error\": false,\n  \"data\": {\n      \"email\": \"imzusheng@163.com\",\n      \"nickName\": \"zusheng\",\n      \"avatar\": \"\",\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "失败响应参数": [
          {
            "group": "失败响应参数",
            "type": "Boolean",
            "optional": false,
            "field": "error",
            "description": "<p>错误</p>"
          },
          {
            "group": "失败响应参数",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>错误信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "失败响应示例:",
          "content": "{\n  \"msg\": \"请输入有效的邮箱地址或账号\"\n  \"error\": true,\n  \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "route/commonRouter.js",
    "groupTitle": "通用",
    "sampleRequest": [
      {
        "url": "localhost:3000/wechatAPI/common/chatHistory"
      }
    ]
  }
] });
