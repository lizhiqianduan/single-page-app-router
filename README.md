# single-page-app-router
单页应用的路由系统
## 使用示例
1.建立渲染区
```HTML
<div id="app"></div>
```
2.引入库文件
```Javascript
<script src="../../src/SpaRouter.class.js"></script>
```
3.配置路由
```Javascript
   var router = new SpaRouter({
      mode:"hash",
      base:"/",
      root:document.getElementById("app"),
      routes:[
         {
            path:"/",
            template:"首页模板"
         },
         {
            path:"base",
            template:"基本模板",
            children:[
               {
                  path:"bb",
                  template:"模板"
               }
            ]
         },
         {
            path:"params",
            template:"给路由传递参数的示例，可以从controller中获取参数，再填入至模板内",
            children:[
               {
                  path:":id/:name",
                  controller:function () {
                     return "带参数传递模板。从controller中获取参数，再填入至模板内。<br>参数为："+JSON.stringify(this.params);
                  }
               }
            ]
         },
         {
            path:"*",
            template:"404模板"
         }
      ]
   });
```
4.调用跳转
```Javascript
router.to("/base");
```

你也可以访问我网站上的在线示例：http://lizhiqianduan.com/products/spa-router-hash-mode
