/**
 * @file    SpaRouter.class.js
 * @author  xiaohei
 * @date    2017/10/18
 * @description  SpaRouter.class文件
 */

(function (win) {
	
	
	win.SpaRouter = win.SpaRouter || SpaRouter;
	
	/**
	 * 路由对象的数据结构
	 * @param route
	 * @constructor
	 */
	function SpaRoute(route) {
		var self = this;
		this.path = route.path;
		this.controller = route.controller || function(){
			return self.template;
		};
		this.template = route.template || "";
		this.children = route.children;
		this.absolutePath = route.absolutePath || "";
		this.params = route.params || {};
	}
	
	
	
	
	
	
	
	
	
	
	

	/**
	 * 路由管理器
	 * @param config
	 * @constructor
	 */
	function SpaRouter(config) {
	
		/**
		 * 路由模式。包括hash、history
		 * @type {*|number|string}
		 */
		this.mode = config.mode||"hash";
		
		/**
		 * 根路由的基础路由，会加在所有路径之前
		 * @type {string}
		 */
		this.base = config.base || "";
		
		/**
		 * 路径配置项。每项都是SpaRoute对象
		 * @type {*|Array}
		 */
		this.routes = config.routes||[];
		
		/**
		 * 渲染区域的根节点。默认为document.body
		 * @type {HTMLElement}
		 */
		this.root = config.root || document.body;
		
		/**
		 * 存储解析routes之后的路径对象
		 * @type {Array}
		 * @private
		 */
		this._parsedRoutes = parseRoutes(this.routes,this.base);
		
		//初始化之后默认跳转至首页
		this.to("/");
	}
	
	/**
	 * 根据路径获取路由
	 * @param path	{String}		路径
	 * @returns {null|SpaRouter}	返回匹配到的路由。没匹配到路由，则返回null
	 */
	SpaRouter.prototype.getRouteByPath = function (path) {
		for(var i = 0;i<this._parsedRoutes.length;i++){
			var route = this._parsedRoutes[i];
			var absolutePathArr = route.absolutePath.split("/");
			var pathArr = path.split("/");
			// 长度不等，直接跳过
			if(absolutePathArr.length!==pathArr.length) continue;
			
			// 判断是否匹配到相应路径
			if(matchPath(route.absolutePath,path)){
				route.params = {};
				// 获取路由参数
				for(var j =0;j<absolutePathArr.length;j++){
					if(absolutePathArr[j][0]===":"){
						route.params[absolutePathArr[j].slice(1)]=pathArr[j];
					}
				}
				return route;
			}
		}
		// 依次匹配之后，若没有匹配到相应路径，则跳转至*路由
		var lastRoute = this.routes[this.routes.length-1];
		if(lastRoute.path==="*"){
			return new SpaRoute(lastRoute);
		}
		return null;
	};
	
	/**
	 * 路由跳转。
	 * @param path	{String}		需要跳转的绝对路径
	 * @returns {null|SpaRoute}
	 */
	SpaRouter.prototype.to = function (path) {
		// 自动给路径末尾加上破折号
		path = path[path.length-1]==="/"?path:path+"/";
		var route = this.getRouteByPath(path);
		if(!route) return null;
		
		// 根据路由模式跳转页面
		if(this.mode==="hash")
			location.hash = path;
		else if(this.mode==="history"){
			history.pushState(null,null,path);
		}
		// 自动渲染root节点
		// this.root.innerHTML = route.template;
		this.root.innerHTML = route.controller();
		return route;
	};
	
	
	
	
	
/** 工具函数******************************/

	/**
	 * 解析路由，计算它的绝对路径
	 * @param routes	{Array}		SpaRoute对象数组
	 * @param basePath	{String}	基础路径
	 * @returns {Array}				SpaRoute对象数组
	 */
	function parseRoutes(routes,basePath){
		var res = [];
		basePath = basePath==="/"?"":basePath;
		
		if(!routes || routes.length===0) return res;
		
		for(var i =0;i<routes.length;i++){
			var route = routes[i];
			route.absolutePath = basePath+"/"+(route.path==="/"?"":route.path);
			var children = route.children;
			res = res.concat(parseRoutes(children,route.absolutePath));
			route.absolutePath = route.absolutePath+(route.path==="/"?"":"/");
			console.log(route.absolutePath);
			res.push(new SpaRoute(route));
		}
		return res;
	}
	
	/**
	 * 匹配路径。
	 * @param pathPattern			路由模式路径
	 * @param path					需要匹配的路径
	 * @returns {boolean}			返回boolean
	 */
	function matchPath(pathPattern,path) {
		var reg = new RegExp(pathPattern.replace(/:.+?\//g,"([^\/])+\/"));
		return reg.test(path);
	}

	
})(window);


