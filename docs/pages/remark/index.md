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
2. 玩转 webpack 【完结】
3. node.js 开发实战 【进行中】

## 2023 年任务安排

### 1 月

- 【组件库】`dplusui`更新 增加数据监测模型，更细粒度更新组件
- 【语言】根据课程资料，复习下`typescript vue react node`
  - react 2.3

### 2 月

- 【开源仓库】`ChatGPT` 学习

### 研究方向

1. 3d 方向：http://mars3d.cn/
2. 微前端：qiankun
3. bff（前端的后端）：https://github.com/eshengsky/node-bff
4. ai 识别：https://google.github.io/mediapipe/

### 3 月

- 3d 框架 【babaylon.js】
- 游戏框架 【unity3d - webgl】运用

### 4 月

- 辅助线
- 自定义组件开发

### 5 月

- 大厂 h5
- canvas 制作酷炫的网页背景特效
- 前端性能优化原理与实践

  - vue add dll 添加 vue-cli-plugin-dll 插件
  - 缓存概念
  - 强缓存 expires => cache-control: max-age=1321321 s-maxage=132121 => cache-control: no-cache 直接走协商缓存，不使用客户端缓存
    => cache-control: no-store 不使用缓存，直接请求服务器
  - 协商缓存 If-Modified-Since => Last-Modified 更加可靠 If-None-Match => Etag
  - 本地缓存 Cookie
  - 渲染篇
    - 服务端渲染
    - 客户端渲染过程 DomTree CssTree 渲染树 布局渲染树 绘制渲染树

- 第三方组件平台
  - 本地一键安装

### 6 月

- 金华消防大管家开发
- 视频天枢平台
- 4.0 迭代需求开发

### 7 月

- 应届生培训计划
- 慕课网 webgl 学习
- 可视化入门：从 0 到 1 开发一个图表库

### 8 月

- 应届生培训计划
- 慕课网 webgl 学习
- 可视化入门：从 0 到 1 开发一个图表库

### 9 月

- 学习
- English 学习

### 10 月

- 一表通 1.0 easy-forms-project

### 11 月

- 一表通 2.0 jnpf-web-vue3
- openAI 的项目实战 开源项目：chatGPTWeb

### 12 月

- edu-hub 文档补充

  - 大文件上传
  - less 使用技巧 https://zhuanlan.zhihu.com/p/603009769

## 2024 年任务安排

> 2023 成为过去，2024 继续加油
> vue3 相关生态库源码分析，ai 相关技术学习

### 1 月

- webVR 学习 https://photo-sphere-viewer.js.org/guide/
- [unplugin-vue-components](!https://github.com/unplugin/unplugin-vue-components) 按需导入原理了解
- vueuse 的使用
  - useVirtualList 虚拟列表实现原理
  - useElementSize 实时获取元素实际大小
