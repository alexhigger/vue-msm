<template>
  <div>
    <h1>欢迎来到vue-会员管理系统</h1>
    <h1>---------------------------------------------------------</h1>
    <h2>会员管理系统项目技术架构</h2>

    <el-button type="primary" plain @click="detail">Vue.js</el-button>
    <el-tooltip placement="top">
      <div slot="content">
        一个chrome浏览器的插件
        <br />Vue Devtools 插件让我们在一个更友好的界面中审查和调试 Vue 项目
      </div>
      <el-button type="success" plain>Vue DevTools</el-button>
    </el-tooltip>
    <el-tooltip placement="top">
      <div slot="content">
        Vue Router 是 Vue.js 官方的路由管理器。
        <br />它和 Vue.js 的核心深度集成，让构建单页面应用变得非常简单。
        <br />通过根据不同的请求路径，切换显示不同组件进行渲染页面。
      </div>
      <el-button type="warning" plain>Vue Router</el-button>
    </el-tooltip>
    <el-tooltip placement="top">
      <div slot="content">
        Vue Loader是一个webpack的loader，允许以一种名为单文件组件的格式撰写Vue组件
        <br />template+script+style
      </div>
      <el-button type="danger" plain>Vue Loader</el-button>
    </el-tooltip>

    <br />
    <br />
    <el-tooltip placement="top">
      <div slot="content">
        Vue-CLI 是 Vue 官方提供的, 用来搭建项目脚手架的工具，
        <br />它是 Vue.js 开发的标准工具，它已经集成了
        webpack ,
        <br />内置好了很多常用配置, 使得我们在使用 Vue 开发项目时更加的标准化。
      </div>
      <el-button type="primary" plain>Vue CLI3.x</el-button>
    </el-tooltip>

    <el-button type="success" plain @click="detail">VueX</el-button>
    <el-tooltip placement="top">
      <div slot="content">
        NPM 全称 Node Package Manager，
        <br />它是 JavaScript 的包管理工具,
        <br />并且是 Node.js 平台的默认包管理工具。
        <br />通过NPM 可以安装、共享、分发代码,管理项目依赖关系。
      </div>
      <el-button type="warning" plain>NPM</el-button>
    </el-tooltip>
    <el-button type="success" plain @click="detail">VueX</el-button>
    <el-tooltip placement="right">
      <div slot="content">编译软件</div>
      <el-button type="danger" plain>VS Code</el-button>
    </el-tooltip>
    <br />
    <br />
    <el-tooltip placement="left">
      <div slot="content">
        在 vue2+版本中官方推荐使用的第三方 ajax 请求库
        <br />使用：结合生命钩子获取数据，渲染数据
      </div>
      <el-button type="primary" plain>Axios</el-button>
    </el-tooltip>

    <el-tooltip placement="top">
      <div slot="content">ECMAScript 6（简称ES6）是于2015年6月正式发布的JavaScript语言的标准</div>
      <el-button type="success" plain>EcmaScript6</el-button>
    </el-tooltip>

    <el-button type="warning" plain @click="detail">Webpack 4.x</el-button>
    <el-tooltip placement="top">
      <div slot="content">一套为开发者、设计师和产品经理准备的基于Vue2.0的桌面端组件库</div>
      <el-button type="danger" plain>Element UI</el-button>
    </el-tooltip>

    <br />
    <br />
    <el-tooltip class="item" placement="bottom">
      <div slot="content">浏览器兼容性</div>
      <el-button type="primary" plain>Babel</el-button>
    </el-tooltip>
    <el-tooltip class="item" placement="bottom">
      <div slot="content">ESLint 是一个语法规则和代码风格的检查工具，可以 用来保证写出语法正确、风格统一的代码。</div>
      <el-button type="success" plain>Eslint</el-button>
    </el-tooltip>

    <el-button type="warning" plain @click="detail">Mock.js</el-button>
    <el-tooltip class="item" placement="bottom">
      <div slot="content">
        Easy Mock 是一个可视化，并且能快速生成模拟数据的服务。
        <br />是杭州大搜车无线团队出品的一个极其简单、高效、
        可视化、并且能快速生成模拟数据的在线 Mock 服务 。
        <br />现在 Easy Mock 内置了 Mock.js，我们可以更愉快的伪造数据了。
      </div>
      <el-button type="danger" plain>Easy-Mock</el-button>
    </el-tooltip>

    <br />
    <br />
    <!-- 细节弹出-------------------------------------------------------------------------------- -->
    <!-- vue.js -->
    <el-dialog title="Vue.js" :visible.sync="dialogFormVisible" width="500px">
      <div style=" overflow:auto; width:470px; height:300px;">
        <p>
          Vue.js是一套构建用户界面的渐进式框架。与其他重量级框架不同的是，Vue 采用自底向上增量开发的设计。Vue 的核心库只关注视图层，并且非常容易学习，非常容易与其它库或已有项目整合。另一方面，Vue 完全有能力驱动采用单文件组件和Vue生态系统支持的库开发的复杂单页应用。
          Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件 [2] 。
          Vue.js 自身不是一个全能框架——它只聚焦于视图层。因此它非常容易学习，非常容易与其它库或已有项目整合。另一方面，在与相关工具和支持库一起使用时 [3] ，Vue.js 也能完美地驱动复杂的单页应用。
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a href="https://cn.vuejs.org/" target="_blank">
          <el-button type="primary">前往官网</el-button>
        </a>
      </div>
    </el-dialog>
    <!-- vuex -->
    <el-dialog title="VueX" :visible.sync="dialogFormVisible" width="500px">
      <div style=" overflow:auto; width:470px; height:300px;">
        <p>
          Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状
          态，并以相应的规则保证状态以一种可预测的方式发生变化。
          Vue 应用中的每个组件在 data() 中封装着自己数据属性，而这些 data 属性都是私有的，完全隔离的。
          如果我们希望多个组件都能读取到同一状态数据属性，或者不同组件的行为需要更新同一状态数据属
          性，
          这就需要一个将共享的状态数据属性进行集中式的管理。
          这就是 Vuex 状态管理所要解决的问题。
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a href="https://vuex.vuejs.org/zh/" target="_blank">
          <el-button type="primary">前往官网</el-button>
        </a>
      </div>
    </el-dialog>
    <!-- webpack -->
    <el-dialog title="WebPack" :visible.sync="dialogFormVisible" width="500px">
      <div style=" overflow:auto; width:470px; height:300px;">
        <p>
          Webpack 是一个前端的静态模块资源打包工具，能让浏览器也支持模块化。它将根据模块的依赖关系进行静态分
          析，然后将这些模块按照指定的规则生成对应的静态资源。
          <br />Webpack 核心主要进行 JavaScript 资源打包
          <br />它可以结合其他插件工具，将多种静态资源css、png、sass 分类转换成一个个静态文件，这样可以减少页面的请求。
          可集成 babel 工具实现 EcmaScript 6 转 EcmaScript 5 ，解决兼容性问题
          <br />可集成 http 服务器
          <br />可集成模块热加载，当代码改变后自动刷新浏览器 等等功能
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a href="https://webpack.docschina.org/" target="_blank">
          <el-button type="primary" plain>webpack2.x 中文官网</el-button>
        </a>
        <a href="https://webpack.docschina.org/guides/" target="_blank">
          <el-button type="success" plain>webpack2.x 指南文档</el-button>
        </a>
      </div>
    </el-dialog>
    <!-- Mock.js-->
    <el-dialog title="Mock.js" :visible.sync="dialogFormVisible" width="500px">
      <div style=" overflow:auto; width:470px; height:300px;">
        <p>
          问题：
          前后端分离项目，前端和后端人员都是根据 API 文档进行开发项目的，不应该直接相互依赖， 前端人员不应该等
          待后端开发好接口后再进行测试，既然不依赖后端接口，那前端人员应该如何测试呢？
          解决：
          可以通过模拟数据生成器，通过一定规则 （API文档）生成模拟数据接口, 提供给前端人员进行测试。
          Mock.js 是用于生成随机数据，拦截 Ajax 请求。
          通过拦截 Ajax 请求，根据数据模板生成并返回模拟数据，让前端攻城师独立于后端进行开发，帮助编写单元
          测试。
          Mock.js 作用：
          1. 前后端分离
          让前端攻城师独立于后端进行开发。
          2. 增加单元测试的真实性
          通过随机数据，模拟各种场景。
          3. 开发无侵入
          不需要修改既有代码，就可以拦截 Ajax 请求，返回模拟的响应数据。
          4. 用法简单
          符合直觉的接口。
          5. 数据类型丰富
          支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等。
          6. 方便扩展
          支持扩展更多数据类型，支持自定义函数和正则。
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a href="http://mockjs.com/" target="_blank">
          <el-button type="primary">前往官网</el-button>
        </a>
      </div>
    </el-dialog>
  </div>
</template>
 <script>
export default {
  data() {
    return {
      dialogFormVisible: false // 控制新增对话框,
    };
  },
  methods: {
    //点击弹出详情框
    detail() {
      this.dialogFormVisible = true;
    }
  }
};
</script>
<style scoped>
div {
  text-align: center;
}
</style>
