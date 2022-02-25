module.exports = {
  base: "/vuepress-githubpages/", // 目录根地址，应与Github仓库名字相同
  title: "东坡白菜技术分享",
  description: "让你快速熟悉项目内容",
  head: [
    [
      "link",
      { rel: "icon", href: "/logo.ico" }, //浏览器的标签栏的网页图标,基地址/docs/.vuepress/public
    ],
  ],
  markdown: {
    lineNumbers: true, //是否在每个代码块的左侧显示行号
  },
  themeConfig: {
    sidebarDepth: 2,
    sidebar: 'auto',
    nav: [
      // 导航栏配置
      { text: "组件库", link: "/pages/comlibrary/index.md" },
      { text: "前端框架", link: "/pages/frame/index.md" },
      { text: "项目说明", link: "/pages/project/index.md" },
      { text: "浏览器", link: "/pages/browser/index.md" },
    ],
    repo: "dongpobaicai/vuepress-githubpages",
    repoLabel: "Github",
    smoothScroll: true,
    lastUpdated: '最后更新'
  },
  plugins: [
    "@vuepress/medium-zoom", //zooming images like Medium（页面弹框居中显示）
    "@vuepress/nprogress", //网页加载进度条
    "@vuepress/plugin-back-to-top", //返回页面顶部按钮
  ]
};
