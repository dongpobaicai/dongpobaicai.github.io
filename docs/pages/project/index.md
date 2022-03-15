---
title: 项目实战
---

## 微前端项目

> 我们的业务场景是一个主应用包含多个子应用，为了各个应用相对独立，使用 qiankun 框架来开发

### 相关资料

- [qiankun 在线文档](https://qiankun.umijs.org/zh)
- [ant design vue](https://www.antdv.com/docs/vue/introduce-cn/)

### 项目结构

> 这里截取一部分项目

- student-health-platform 主应用
  - stu-caries-application 龋齿应用
  - stu-eyescreen-application 视力筛查应用

### 主应用（student-health-platform）

在入口 permission.js 获取子应用的配置

```js
// 获取微服务
await store.dispatch("GetApps");
```

这里我们是放到 store 的 action 中完成

```js
// 获取微服务
GetApps({ commit }) {
  return new Promise((resolve, reject) => {
    getMicroApps()
      .then(({ data }) => {
        commit('SET_APPS', data)
        resolve(data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
```

微服务注册这块封装成一个 js

```js
/**
 * @name 启用qiankun微前端应用
 * @param {Array} list 应用注册表信息
 */
const qianKunStart = (list) => {
  let apps = [];
  list.forEach((item) => {
    const { module, url, routerBase, appId, site } = item;
    apps.push({
      name: module,
      entry: prod ? url : site,
      container: appContainer,
      activeRule: routerBase,
      props: { store, emits, global, routerBase, appId },
    });
  });

  // 注册子应用
  registerMicroApps(apps, {
    beforeLoad: (app) => console.log("[LifeCycle] before load %c%s", "color: green;", app.name),
    beforeMount: (app) => console.log("[LifeCycle] before mount %c%s", "color: green;", app.name),
    afterUnmount: (app) => console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name),
  });

  // 启动微前端
  start();

  // 启动qiankun应用间通信机制
  appStore(initGlobalState);

  // 添加全局的未捕获异常处理器
  !prod &&
    addGlobalUncaughtErrorHandler((event) => {
      console.error(event);
    });
};

export default qianKunStart;
```

这里对 app 对象做一个详细说明

```js
{
  name 微应用名称，必须唯一
  entry 必选，微应用的入口
  container 微应用的容器节点的选择器或者 Element 实例
  activeRule 路由匹配规则
  props 传给微应用的属性
}
```

接下来看看子应用的配置

### 子应用（stu-eyescreen-application）

首先来看下子应用项目入口 js，重点关注 **bootstrap**、**mount**、**unmount** 三个生命周期钩子

1. 首先是子应用渲染函数
2. 三个生命周期函数
3. 兼容微应用项目独立运行情况
4. webpack 导出包的相关信息

这里 routerBase，来自主应用或独立运行为空
container，来自主应用或独立运行当前 html

```js
let router = null;
const __qiankun__ = window.__POWERED_BY_QIANKUN__;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render({ routerBase, container } = {}) {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = createRouter({ routerBase });

  // 挂载应用
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}
```

bootstrap 应用初始化函数，项目启动执行一次
mount 应用加载函数
unmount 应用卸载函数

```js
export async function bootstrap(props) {
  appStore(props);
}

export async function mount(props) {
  render(props);

  await store.dispatch("user/GetInfo");
  await store.dispatch("permission/GenerateRoutes");
  // 动态添加可访问 路由
  router.addRoutes(store.getters.addRouters);
}

export async function unmount() {
  instance.$destroy?.();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}

export async function update(props) {
  console.log("update props", props);
}
```

```js
// 独立运行时，直接挂载应用
__qiankun__ || render();
```

```js
{
  configureWebpack: {
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
}
```

## vue vben admin2 的学习借鉴

### 国际化处理

### 路由

- 权限控制三种方式
  - 全局路由动态生成：前台写死路由通过接口返回权限控制，直接后端判断权限返回
  - 细粒度控制，通过权限方法
  - 权限指令控制

### 请求对象的封装

- 通过类方法形式创建请求实例
- 通过配置方式，设置请求拦截，响应拦截

## vue-json-schema-form 架构

- `yarn workspace` 目录管理
- `lerna` 打包发布

### 目录结构

```
- packages
  - demo   // 表单渲染的应用 编辑器、预览器、活动编辑器
  - docs
  - lib   // 框架核心包  封装过后的表单
```

### lib/vue2/vue2-form-element element ui 的表单

- `package.json` 通过 rollup 打包 => esm，umd 供外界使用

```js
[
  {
    format: "esm",
    file: "",
    name: "",
    sourcemap,
  },
  {
    format: "umd",
    file: "",
    name: "",
    sourcemap,
  },
];
```

- `createVue2Core(globalOptions)` 工厂模式，创建 form 表单实例
- `globalOptions` 结构

```js
{
  // 基础类型
  types: {
      boolean: 'el-switch',
      string: 'el-input',
      number: 'el-input-number',
      integer: 'el-input-number',
  },
  // 数据处理类
  formats: {
      color: 'el-color-picker',
      time: TimePickerWidget, // 20:20:39+00:00
      date: DatePickerWidget, // 2018-11-13
      'date-time': DateTimePickerWidget, // 2018-11-13T20:20:39+00:00
  },
  common: {
      select: SelectWidget,
      radioGroup: RadioWidget,
      checkboxGroup: CheckboxesWidget,
  },
  widgetComponents
}
```

- `@lljj/vue2-form-core` => `createVue2Core` 具体实现

```js
/**
 * 返回一个vue组件
 **/
function createVue2Core() {
  return {
    name: "vueForm",
    props: {
      globalOptions: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {};
    },
    render() {},
  };
}
```

1. 注册`globalOptions.WIDGET_MAP.widgetComponents` => 自定义组件 widget (最小渲染元素)
2. `render` => 本质通过 h 函数，渲染 globalOptions 中提供 form 表单
3. 关于表单`formData`的处理

```js
var formData = getDefaultFormState(schema, value); // formData 受 schema + value  影响
// 看下这个getDefaultFormState具体实现
function getDefaultFormState() {
  // 处理allof $ref 合并相关数据
  // 获取default值，和传入formData进行合并
}
```
4. 渲染子元素 `[h(SchemaField, { props }), defaultSlot]`
5. `SchemaField` 的实现
  - 查询`ui:field`是否存在，存在渲染自定义组件
  - 查询当前配置type，渲染不同内置组件
    - 基本数据类型   => formItem => 通过type + 结合 globalOptions.
    ```js
    <FormItem>
      h(globalOptions.WIDGET_MAP.types[item.type])
    </FormItem>
    ```
    - Object类型处理   遍历排过序的 propertiesVNodeList => SchemaField => Widget
    - Anyof 单选逻辑   
    - Oneof 下拉选择，单选
     

## 设计模式

> 提高代码可重复行，健壮性

### 单例模式

- 全局只存在一个实例
- 代码实现

  ```js
  function getSingle(fn) {
    let instance = null;

    return function () {
      if (!instance) {
        instance = fn.apply(this, arguments);
      }

      return instance;
    };
  }

  function teacher(name) {
    this.name = name;
  }

  teacher.prototype.getName = function () {
    console.log(this.name);
  };

  const createTeacher = getSingle(function (name) {
    const instance = new teacher(name);

    return instance;
  });

  createTeacher("吴老师").getName();
  createTeacher("大大老师").getName();
  ```

### 工厂模式

- 创建对象，通过 create 函数来完成，不通过 new 方式，不暴露实例类

  ```js
  class Dog {
    constructor(name) {
      this.name = name;
    }
    getName() {
      console.log(this.name);
    }
  }

  class Factory {
    create(name) {
      return new Dog(name);
    }
  }

  const factory = new Factory();
  const dog1 = factory.create("狼狗");
  const dog2 = factory.create("柯基");

  dog1.getName();
  dog2.getName();
  ```

### 代理模式

- 保护模式
- 防抖模式
- 缓存模式

### 订阅发布模式

- vue 的数据监测和更新

### 装饰器模式

- 在原先对象进行扩展，不影响之前方法

### 适配器模式

- 对数据做统一的处理，以满足执行函数

## 经典题分享

收集平时做过，觉得好的题目

1. 函数柯里化
   说明：是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术

```js
a(1, 2) 3
a(1, 2, 3) 6
a(1, 2, 3, 4) 10

// 柯里化
a(1)(2)
a(1)(2)(3)
a(1)(2)(3)(4)

function a(x) {
  return function(y) {
    return x + y
  }
}
// 通用版
var currying = function(fn) {
  // 获取第一个方法参数
  var args = Array.prototype.slice.call(arguments, 1)
  return function() {
    var newArgs = args.concat(Array.prototype.slice.call(arguments))
    return fn.apply(this, newArgs)
  }
}

// 上面只能算两个参数，如果多个还需要调整

// 支持多参数传递
function progressCurrying(fn, args) {

    var _this = this
    var len = fn.length;
    var args = args || [];

    return function() {
        var _args = Array.prototype.slice.call(arguments);
        Array.prototype.push.apply(args, _args);

        // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
        if (args.length < len) {
            return progressCurrying.call(_this, fn, _args);
        }

        // 参数收集完毕，则执行fn
        return fn.apply(this, args);
    }
}
function test(a, b) {
  return a + b
}
console.log(progressCurrying(test)(1)(2)(3) )
t(1)(2)(3)
t(2)(3)
```

2. 对象键值，以下输出什么

```js
const a = {};
const b = { key: "b" };
const c = { key: "c" };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
```

3. js 事件环机制，结合 setTimeout 说明

以下的打印顺序

```js
var a = () => {
  console.log("first");
};
var b = () =>
  setTimeout(() => {
    console.log("second");
  });
var c = () => {
  console.log("three");
};

a();
b();
c();
```

- 执行上述代码，依次放入执行栈中
- 开始执行，执行 a，打印 first
- 执行 b，WebAPI 不能随时向栈内添加内容。相反，它将回调函数推到名为 queue 的地方。
- 执行 c，打印 three
- 一个事件循环查看栈和任务队列。如果栈是空的，它接受队列上的第一个元素并将其推入栈
- 打印 second

4. 事件的响应顺序

- Capturing > Target > Bubbling
- 在捕获阶段，从父元素到目标元素
- 在冒泡阶段，从目标元素一直向上冒泡
- 默认事件在冒泡阶段执行，除非设置 useCapture 为 true

5. falsy（能转化为 false 的值）值有哪些

- null，undefined，''，NaN，0，false

6. 关于堆栈、运算符的问题

```js
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };

a.x;
b.x;
```

- 前面两句比较容易理解，堆中存放了{ n: 1 }，栈中存放这个对象地址，a, b 赋值为这个对象地址
- 首先计算左边表达式 a.x，堆中对象变成 { n: 1, x: undefined }，并生成一个引用
- 接着开始赋值操作，按照运算符优先级，从右到左。 a 这个变量指向了 { n: 2 } 这个地址
- 因为 a.x 先计算，实际上此刻它为 { n: 1, x: undefined } 这个对象引用，所以赋值为 { n: 1, x: { n: 2 } }
- 打印 a.x a: { n: 2 } 故 undefined
- 打印 b.x b: { n: 1, x: { n: 2 } } 故 { n: 2 }

7. 关于 this 指向

> 默认规则，隐式绑定

```js
var num = 1;
var myObject = {
  num: 2,
  add: function () {
    this.num = 3;
    (function () {
      console.log(this.num);
      this.num = 4;
    })();
    console.log(this.num);
  },
  sub: function () {
    console.log(this.num);
  },
};
myObject.add();
console.log(myObject.num);
console.log(num);
var sub = myObject.sub;
sub();
```

```js
var obj = {
  say: (function () {
    function _say() {
      console.log(this);
    }
    console.log(obj);
    return _say.bind(obj);
  })(),
};
obj.say();
```

8. 扁平化去重

已知如下数组，编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

```js
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b);
```
