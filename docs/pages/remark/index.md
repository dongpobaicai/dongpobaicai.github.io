---
title: 杂谈
---

## 2022 年终总结

> 回顾过去自己 2022 一年的工作内容和技术沉淀，总结自己的不足。
> 希望 2023 得以改正

### 语言

> 这一年没有学习其他的语言
> 算是系统学习了 typescript，加强了基本语法的了解

- typescript 安装过程，如何在 vue 项目中使用
- tsconfig.json 一些常见属性配置，比如导出目标包类型 target: "es2016"
- 断言文件作用，全局变量声明，别名配置
- <font color="#00fffff">缺少完整的项目配置，后续补充</font>

### 框架，仓库

1. taro
   1.1 常用 api 使用，类微信小程序语法，一套代码打包多端
   1.2 内置环境变量判断。需要注意的点：这里环境是指编译时环境，而不是运行时环境，不能作为运行时客户端环境判断

2. lowcode-engine 低代码引擎，定制化低代码平台
   2.1 了解架构思想，基本组成部分
   2.2 实战应用

3. three.js
   3.1 基本语法和项目使用

4. superset 快速上手

5. monaco-editor 编辑器使用

6. animate.css 了解使用。自己整理一些动画效果，集合成项目 `animate-collection`

7. common-utils 工具类集合，数据类型判断，正则表达式封装，vue 组件查找，生成唯一 id

8. jeecg-boot / vue-vben-admin 企业中台框架，互相借鉴。
   8.1 按钮级别权限控制，通过 v-指令完成的
   8.2 页面切换过场动画，`<transition>`
   8.3 列表查询封装方案，包含下载，上传，`tooltip`实现原理

9. vuepress 进一步使用
   9.1 组件注册
   9.2 主题配置

10. UI 组件库开发过程 `fighting-design`

### 框架源码

1. 年初时候初步了解 vue3 设计理念
2. <font color="red">这块有待加强</font>

### 书籍，视频

1. vue2 深入浅出 【完结】
2. webpack 课程 【完结】
3. node.js 学习 【进行中】

## 2023 年任务安排

### 1月

- 【组件库】`dplusui`更新   增加数据监测模型，更细粒度更新组件
- 【语言】根据课程资料，复习下`typescript vue react node`