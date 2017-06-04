import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
      interval:20,
      currentStyle:'',
      enableHtml: false,
      styleNumber:0,
      finalStyle: [
      `
      /*
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
         -webkit-transtion: none;
                 transtion: none;
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
      .resumeEditor{
        padding: 2em;
      }
      .resumeEditor h2{
        display: inline-block;
        border-bottom: 1px solid;
        margin: 1em 0 .5em;
      }
      .resumeEditor ul,.resumeEditor ol{
        list-style: none;
      }
      .resumeEditor ul> li::before{
        content: '•';
        margin-right: .5em;
      }
      .resumeEditor ol {
        counter-reset: section;
      }
      .resumeEditor ol li::before {
        counter-increment: section;            
        content: counters(section, ".") " ";  
        margin-right: .5em;
      }
      .resumeEditor blockquote {
        margin: 1em;
        padding: .5em;
        background: #ddd;
      }
      `
      ],
      currentMarkdown:"",
      finalMarkdown:` 方应杭
        ----
        资深前端工程师，资深前端讲师，现在在 [饥人谷](http://jirengu.com) 教前端课程。
        技能
        ----
        * 前端开发
        * Rails 开发
        * Node.js 开发
        * 前端授课
        工作经历
        ----
        1. [饥人谷](http://jirengu.com)
        2. 腾讯即时通讯平台部
        3. 阿里巴巴B2B部门
        4. 彩程知人项目组
        链接
        ----
        * [GitHub](https://github.com/frankfang)
        * [我的文章](https://www.zhihu.com/people/zhihusucks/pins/posts)
        > 如果你喜欢这个效果，Fork [我的项目](https://github.com/jirengu-inc/animating-resume)，打造你自己的简历！
            `
    },
    mutations:{
        increment(state){
            state.count++
        },
        setHtml(state){
            state.enableHtml = true
        },
        setInterval(state,payload){
            state.interval = payload
        },
        setStyleNunber(state){
            state.styleNumber++
        },
        getCurrentStyle(state,payload){
            state.currentStyle = payload
        },
        updateCurrentStyle(state,char){
            state.currentStyle += char
        },
        updateCurrentMarkdown(state){
            state.currentMarkdown = state.finalMarkdown.substring(0,state.currentMarkdown.length+1)
        }

    },
    actions:{
        showHtml({commit},payload){
            return new Promise((resolve,reject)=>{
                commit('setHtml')
                resolve()
            })
        },
        progressShowStyle({state,commit},payload){
            
            return new Promise((resolve,reject)=>{
                
                let interval = state.interval
                let showStyle =(async function(){
                    let style = state.finalStyle[state.styleNumber]
                    
                    if(!style){return}
                    let length = state.finalStyle.filter((_,index)=>index<=state.styleNumber).map((item)=>item.length).reduce((p,c)=>p+c,0)
                    let prefixLength = length - style.length
                    if(state.currentStyle.length<length){
                        let l =state.currentStyle.length - prefixLength
                        let char = style.substring(l,l+1) || ' '
                        commit('updateCurrentStyle',char)
                        if(style.substring(l - 1,l) === '\n' && this.$refs.styleEditor){
                            this.$nextTick(()=>{
                            this.$refs.styleEditor.goBottom()
                            })
                        }
                        setTimeout(showStyle,20)
                    } else{
                        resolve()
                    }
                }).bind(this)
                showStyle()
                commit('setStyleNunber')
            })
        },
        progressShowResume({state,commit},payload){
            return new Promise((resolve,reject)=>{
                let length = state.finalMarkdown.length
                let interval = state.interval
            let ShowResume = ()=>{
                if(state.currentMarkdown.length <length ){
                    commit('updateCurrentMarkdown')
                   
                    let lastChar = state.currentMarkdown[state.currentMarkdown.length -1]
                    let prevChar = state.currentMarkdown[state.currentMarkdown.length -2]
                    if(prevChar ==='\n' && this.$refs.resumeEditor){
                        this.$nextTick(()=>{
                        this.$refs.resumeEditor.goBottom()
                        })
                    }
                    setTimeout(ShowResume,interval)
                }else{
                    resolve()
                }
              }
            ShowResume()
            })
        }


    }
})