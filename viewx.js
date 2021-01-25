(function(win){

	document.createElement("vx"); //使ie6-8识别vx标签

	function compilePage(page){
		var elements = win.document.getElementsByClassName("vx");
		for(var i = 0; i < elements.length; i++){
			compileElement(page, elements[i]);
		}

		elements = win.document.getElementsByTagName("vx");
		for(var i = 0; i < elements.length; i++){
			compileElement(page, elements[i]);
		}
	};

	function hasClass(obj, cls) { 
		return obj.className.match(new RegExp('(\s|^)' + cls + '(\s|$)')); 
	}
 
	function addClass(obj, cls) {
		if(obj.classList) obj.classList.add(cls);
		else if(!hasClass(obj, cls)) obj.className += " " + cls; 
	}

	function removeClass(obj, cls) {
		if(obj.classList) obj.classList.remove(cls);
		else if(hasClass(obj, cls)) { 
			var reg = new RegExp('(\s|^)' + cls + '(\s|$)'); 
			obj.className = obj.className.replace(reg, ' '); 
		}
	}

	function compileElement(page, element){
		if(element.dataset) var vx = element.dataset.vx; else element.dataset = {};
		if(!vx) element.dataset.vx = vx = {};

		Array.prototype.forEach.call(element.attributes, function(attr){
			if(attr.specified){
				if(attr.name.substr(0,3) == "vx-"){
					var attrName = attr.name.substr(3);
					var expressions = attr.value.match(/\{\{([^\}]*)\}\}/g) || [];
					expressions.forEach(function(expression, i){
						var dataKeys = [];
						expression = expression.replace(/(?:([a-zA-Z]\w*))|(?:\"[^\"]*\")|(?:\'[^\"]*\')/g, function(a0,a1){
							if(a1){
								dataKeys.push(a1);
								return "page.data." + a1;
							} else return a0;
						});
						expression = win.eval("(function(page){ return " + expression + "})");
						var vxSetFunc = function(){
							var attrValue = expression(page);
							element.setAttribute(attrName, attrValue);
						};

						dataKeys.forEach(function(dataKey, i){
							var vxSetFuncs = vx["vx-data-"+dataKey];
							if(vxSetFuncs == null){
								vx["vx-data-"+dataKey] = vxSetFuncs = [];
								addClass(element, "vx-data-"+dataKey);
							};

							vxSetFuncs.push(vxSetFunc);
						});
						vxSetFunc();
					});
				}
			}
		});

		if(element.tagName.toUpperCase() == "VX"){
			if(vx.content == null) vx.content = element.innerText.trim();
			if(vx.content.substr(0,2) == "{{" && vx.content.substr(vx.content.length-2) == "}}"){
				var dataKeys = [];
				var expression = vx.content.substr(2,vx.content.length-4).replace(/(?:([a-zA-Z]\w*))|(?:\"[^\"]*\")|(?:\'[^\"]*\')/g, function(a0,a1){
					if(a1){
						dataKeys.push(a1);
						return "page.data." + a1;
					} else return a0;
				});
				expression = win.eval("0||function(page){ return " + expression + "}"); //“0||”兼容ie6/7/8
				var vxSetFunc = function(){
					element.innerText = expression(page);
				};

				dataKeys.forEach(function(dataKey, i){
					var vxSetFuncs = vx["vx-data-"+dataKey];
					if(vxSetFuncs == null){
						vx["vx-data-"+dataKey] = vxSetFuncs = [];
						addClass(element, "vx-data-"+dataKey);
					};

					vxSetFuncs.push(vxSetFunc);
				});

				vxSetFunc();
			}
		}

		removeClass(element, "vx");
	}

	function setSingleData(page, key, data){
		page.data[key] = data;
		var vxDataKey = "vx-data-" + key;
		var elements = win.document.getElementsByClassName(vxDataKey);
		Array.prototype.forEach.call(elements, function(element){
			var vx = (element.dataset && element.dataset.vx) || {};
			var vxSetFuncs = vx[vxDataKey] || [];
			for(var i = 0; i < vxSetFuncs.length; i++){
				vxSetFuncs[i]();
			}
		})
	};

	function Page(o){
		var that = this;
		that.data = {};
		win.Object.assign(that,o);

		if(o.observers){
			that.observers = {};
			for(var keysName in o.observers){
				(function(){
					var keysFun = o.observers[keysName],
						keys = keysName.split(",");

					var keysFun2 = function(){
						var datas = [];
						for(var i = 0; i < keys.length; i++){
							datas.push(that.data[key]);
						}
						keysFun.apply(that,datas);
					};

					for(var i = 0; i < keys.length; i++){
						var key = keys[i] = keys[i].trim(); //去空格
						var keyObserver = that.observers[key]; //获取属性的观察器数组
						if(!keyObserver) keyObserver = that.observers[key] = []; //如果观察器数组不存，则创建一个
						keyObserver.push(keysFun2);
					}
				})()
			}
		}
	};

	//把字符串的第一个字母转换成大写
	//var toFirstUpper = function(name){
	//	return name.substr(0,1).toUpperCase() + name.substr(1);
	//}

	Page.prototype = {
		setData:function(a0, a1){
			var that = this;
			switch(arguments.length){
				case 1:
					for(var key in a0) setSingleData(that, key, a0[key]);
					if(that.observers){
						var observer = [];
						for(var key in a0){
							var keyObserver = that.observers[key];
							if(keyObserver)
								for(var i = 0; i < keyObserver.length; i++) observer.push(keyObserver[i]);
						}
						observer.distinct();
						for(var i = 0; i < observer.length; i++) observer[i]();
					}
					break;
				case 2:
					setSingleData(that, a0, a1);
					if(that.observers){
						var observer = that.observers[a0];
						if(observer){
							for(var i = 0; i < observer.length; i++) observer[i]();
						}
					}
					break;
			}
		}
	};

	win.Page = function(o){
		var onShow = o.onShow || function(){}
		var onHide = o.onHide || function(){}
		o.onShow = function(){
			if (o.servicePath != null) win.require("/api/service.js").set(o.servicePath, this)
			onShow.call(this)
		}
		o.onHide = function(){
			if (o.servicePath != null) win.require("/api/service.js").set(o.servicePath, null)
			onHide.call(this)
		}

		var page = new Page(o);
		win.document.addEventListener("DOMContentLoaded", function(){
			compilePage(page);
			if (page.onLoad) page.onLoad();
			if (page.onShow) page.onShow();
		})
	}

})(window);