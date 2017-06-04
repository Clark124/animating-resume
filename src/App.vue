<template>
  <div id="app">
    <StyleEditor ref="styleEditor" :code="currentStyle"></StyleEditor>
    <ResumeEditor ref="resumeEditor" :markdown="currentMarkdown" :enableHtml="enableHtml"></ResumeEditor>
  </div>
</template>

<script>
import StyleEditor from './components/StyleEditor'
import ResumeEditor from './components/ResumeEditor'
export default {
  name: 'app',
  components: {
    StyleEditor, ResumeEditor
  },

  data() {
    return {
      interval: 20,
      currentStyle: '',
      enableHtml: false,
      finalStyle: [
        `
      /*
      * Inspired by http://strml.net/
      * 大家好，我是徐阳杰
      * 现在我来做一个非常酷炫的简历了
      */
      /* 首先给所有元素加上过度效果 */
      *{
        -webkit-transition: all .3s;
      }
      /* 白色背景太太单调了，我们来点背景*/
      html {
        color: rgb(222,222,222); background: rgb(0,43,54);
      }
      /* 文字边框太近了 */
      .styleEditor{
        padding: .5em;
        border: 1px solid;
        margin: .5em;
        overflow: auto;
        width: 45vw; height: 90vh;
      }
      /* 代码高亮 */
      .token.selector{ color: rgb(133,153,0); }
      .token.property{ color: rgb(187,137,0); }
      .token.punctuation{ color: yellow; }
      .token.function{ color: rgb(42,161,152); }

      /* 加点 3D 效果*/
       html{
         -webkit-perspective: 1000px;
                 perspective: 1000px;
       }
       .styleEditor{
         position: fixed; left: 0; top: 0;
         -webkit-transition: none;
                 transition: none;
         -webkit-transform: rotateY(10deg) translateZ(-100px);
                 transform: rotateY(10deg) translateZ(-100px);      
       }
      /* 接下来我给自己准备一个编辑器 */
       .resumeEditor{
         position: fixed; right: 0; top: 0;
         padding:  .5em; margin: .5em;
         width: 48vw; height: 90vh;
         border: 1px solid;
         background: white; color: #222;
         overflow: auto;
       } 
      /* 好了，我开始写简历了 */

      `,
        `
      /* 这个简历好像差点什么
      * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
      * 简单，用开源工具翻译成 HTML 就行了
      */
      `,
        `
      /* 再对 HTML 加点样式 */
      .resumeEditor {
          padding: 2em;
      }
      .resumeEditor h2 {
          display: inline-block;
          border-bottom: 1px solid;
          margin: 1em 0 .5em;
      }
      .resumeEditor ul {
          list-style: none;
      }
      .resumeEditor ul {
          counter-reset: section;
      }
      .resumeEditor ul li::before {
          counter-increment: section;
          content: counters(section, ".") ;
          margin-right: .5em;
      }
      .resumeEditor blockquote {
          margin: 1em;
          padding: .5em;
          b
      `
      ],
      currentMarkdown: "",
      finalMarkdown: ` 
徐阳杰
----
前端工程师
技能
----
### 静态开发：
- 熟悉 W3C 规范，写出规范化、语义化的代码，熟悉CSS3，熟悉盒模型、浮动，定位，BFC 等概念。了解响应式和 flex 布局。能使用 HTML5、CSS5做出像素级还原的静态页面。
- 了解 PhotoShop的使用，熟料掌握切图技能。

### 动态交互：
- 熟悉原生 JS 和 jQuery,利用 JS 和 jQuery 实现常见效果，能够不依赖库手写 tab 切换、轮播、瀑布流布局、懒加载等效果。掌握事件模型、DOM 操作、闭包、原型链、面向对象、封装等知识。
- 掌握 AJAX、JSONP API 等，能与后端程序员配合完成动态页面开发。
- 了解 CommonJS、AMD 的模块化方案开发。
- 掌握Bootstrap的用法，能快速开发兼容PC、移动端的网页。
- 了解es6，能使用常见语法及规范编写代码。

### 框架&工具：
- 熟悉MVVM框架，能用vue.js开发SPA单页应用，配合element.ui,mint.ui等UI库能快速开发适配PC端、移动端的页面。
- 了解react.js的基本用法，并有一定的使用经验。
- 熟练使用 VSCode、Webstorm、Git、Linux 命令行等开发工具。

### 后端语言：
- 熟悉原生node.js的特性，能使用Express、MongoDB搭建服务器及数据库。
- 了解LeanCloud第三方数据库的使用方法。
- 了解HTTP协议。

链接
----
* [GitHub](https://github.com/Clark124)
* [我的文章](http://www.jianshu.com/u/ed4670590fc8)
> 如果你喜欢这个效果，Fork [我的项目](https://clark124.github.io/animating-resume/dist)，打造你自己的简历！
      `
    }
  },

  created() {
    this.makeResume()
  },

  methods: {
    makeResume: async function () {
      await this.progressShowStyle(0)
      await this.progressShowResume()
      await this.progressShowStyle(1)
      await this.showHtml()
      await this.progressShowStyle(2)
    },
    showHtml: function () {
      return new Promise((resolve, reject) => {
        this.enableHtml = true
        resolve()
      })
    },
    progressShowStyle(n) {
      return new Promise((resolve, reject) => {
        let interval = this.interval
        let showStyle = (async function () {
          let style = this.finalStyle[n]
          if (!style) { return }
          let length = this.finalStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
          let prefixLength = length - style.length
          if (this.currentStyle.length < length) {
            let l = this.currentStyle.length - prefixLength
            let char = style.substring(l, l + 1) || ' '
            this.currentStyle += char
            if (style.substring(l - 1, l) === '\n' && this.$refs.styleEditor) {
              this.$nextTick(() => {
                this.$refs.styleEditor.goBottom()
              })
            }
            setTimeout(showStyle, interval)
          } else {
            resolve()
          }
        }).bind(this)
        showStyle()
      })
    },
    progressShowResume() {
      return new Promise((resolve, reject) => {
        let length = this.finalMarkdown.length
        let interval = this.interval
        let ShowResume = () => {
          if (this.currentMarkdown.length < length) {
            this.currentMarkdown = this.finalMarkdown.substring(0, this.currentMarkdown.length + 1)
            let lastChar = this.currentMarkdown[this.currentMarkdown.length - 1]
            let prevChar = this.currentMarkdown[this.currentMarkdown.length - 2]
            if (prevChar === '\n' && this.$refs.resumeEditor) {
              this.$nextTick(() => {
                this.$refs.resumeEditor.goBottom()
              })
            }
            setTimeout(ShowResume, interval)
          } else {
            resolve()
          }
        }
        ShowResume()
      })
    }
  },
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  min-height: 100vh;
}

* {
  -webkit-transition: all .3s;
  transition: all .3s;
}
</style>
