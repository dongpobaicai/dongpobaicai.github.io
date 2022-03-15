---
title: 浏览器
---

> 目前 chrome 市场占有率最高，这里以 chrome 为例

## 宏观上看浏览器

### 进程和线程

- `进程` 管理浏览器的内存资源，线程。一个进程可以调度多个线程
- `线程` 最基本的任务执行单位

### 浏览器架构

1. 早期单进程架构，所有的页面都在一个进程，只要一个页面崩溃，就导致整个浏览器崩溃
2. 当前的架构，将浏览器分成好几进程

- 负责进程间通信，资源调配的浏览器进程
- 负责网络请求，资源下载的进程
- 负责页面渲染的进程 放置沙箱中，避免风险
- 负责插件管理的进程
- GPU 进程 3d css 渲染

3. 未来的架构，面向服务的，一个相对独立模块为一个进程服务

## 数据包的传输

- 唯一 ip 地址标识一台电脑应用
- 端口号能让电脑知道是哪个应用
- ip:端口号 就可以完成电脑于电脑之间的数据传输

### UDP TCP

- UDP 适用于对数据完整性不高的场景 因为他是 ip 与 ip 之间传输，没有加上确认机制
- TCP 客户端 3 次握手连接服务端 + 中间数据传入 + 4 次握手断开连接
- TCP 一个来回就回自动断开，需要设置请求头 connection: keep-alive 保证长连接

## 缓存

### HTTP

- 建立在 tcp 连接之上 应用协议

- DNS 域名系统 用来将域名解析成 ip 故也存在 dns 缓存
- 请求部分
  - 请求行 方法名 资源路径 http 版本
  - 请求头 与缓存相关字段
  - 浏览器缓存机制 Cache-Control: no-store/no-cache/max-age > expires > Last-Modified
  - 服务端的缓存 弱检验 Last-Modified => If-Modified-Since
  - 服务端的缓存 强校验 Etag => if-none-match 服务端返回 false/304 资源没有发生改变 true/200 资源发生改变
  - 请求体 携带请求数据
- 响应部分
  - 响应行 http 版本 状态码 状态描述
  - 响应头 Etage Last-Modified expires max-age age content-type 告诉浏览器以何种方式渲染响应体内容
  - set-cookie
  - 响应体 响应返回的内容

### url 到网页显示整个流程

- 涉及 3 个进程
- 浏览器进程 用户输入 => 提交导航 => 文档确认
- 网络进程 发起 http 请求 => 服务端响应头 => 重定向/文档资源/其他响应
- 渲染进程 => 建立数据管道 => 提交文档（准备资源和解析） => 浏览更新

## 执行上下文

> 代码的执行过程分为两个阶段
> 编译阶段 生成执行上下文 变量环境 + 词法环境 + 可执行代码
> 执行阶段

## 执行上下文栈

- 调用栈 也叫执行上下文栈，用来管理执行上下文
- console.trace() 打印出执行上下文调用关系

```js
var a = 2;
function add(b, c) {
  return b + c;
}
function addAll(b, c) {
  var d = 10;
  result = add(b, c);
  return a + result + d;
}
addAll(3, 6);

function runStack(n) {
  if (n === 0) return 100;
  return runStack(n - 2);
}
runStack(50000);

function runStack(n) {
  var arr = [];
  while (n >= 0) {
    if (n == 0) {
      arr[0] = 100;
      break;
    }
    arr[n] = arr[n - 2];
    n--;
  }
  return arr[n];
}
runStack(50000);
```

## 作用域

```js
function foo() {
  var a = 1;
  let b = 2;
  {
    let b = 3;
    var c = 4;
    let d = 5;
    console.log(a);
    console.log(b);
  }
  console.log(b);
  console.log(c);
  console.log(d);
}
foo();

// Function foo   =>  var a, c, b =>  b, d

//  1  3    2   4  undefined
```

- 块级作用域 通过词法环境栈来维护
