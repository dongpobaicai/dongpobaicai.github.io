### 使用 vuepress 快速搭建技术文档网站

#### 项目结构

```js
.
├── README.md     // Github项目展示文件
├── docs     //vuepress项目根目录
│   ├── .vuepress      //存放核心内容的文件夹
│   │   ├── public     //存放静态文件，如图片等
│   │   └── config.js     //设定顶部导航栏、侧边导航栏等项目配置的核心文件
│   ├── pages      //存放markdown页面的文件
│   ├── README.md     //vuepress首页展示用的markdown文件
├── deploy.sh     //用于编写TravisCI上传、发布的脚本文件
├── LISENSE     //许可证文件
├── package.json     //Node.js项目描述文件
└── .travis.yml //Travis CI 自动部署文件
```

### travis CI 自动部署文件 (因为收费，已废弃)

1. 创建 master 分支提交源代码，gh-pages 分支放置网站静态资源
2. github 生成 token
3. 登录 travis，创建 token 环境变量
4. 项目根目录下创建.travis.yml 文件
5. 修改代码，push 上去 travis 自动更新网站

## vuepress-deploy

1. 新建 `.github/workflows/vuepress-deploy.yml`
2. 填入以下配置

```js
name: Build and Deploy
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: vuepress-deploy
      uses: jenkey2011/vuepress-deploy@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        TARGET_REPO: dongpobaicai/dongpobaicai.github.io
        TARGET_BRANCH: gh-pages
        BUILD_SCRIPT: yarn && yarn docs:build
        BUILD_DIR: docs/.vuepress/dist/
```
3. 需要注意：`secrets.ACCESS_TOKEN` 获取，`Settings / Developer Settings / Personal access tokens (classic)` 创建 `access_token`
4. 去网站源码仓库 `dongpobaicai / dongpobaicai.github.io / Actions secrets and variables` 创建名为 `ACCESS_TOKEN` 密钥对