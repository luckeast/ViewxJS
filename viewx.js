(function (win) {

	document.createElement(""vx""); //使ie6-8识别vx标签

	//把字符串的第一个字母转换成大写
	//var toFirstUpper = function(name){
	//	return name.substr(0,1).toUpperCase() + name.substr(1);
	//}

	/*** Element ***/
	function Element_compile(page, targetElement, replaceElement) {
		var element = replaceElement || targetElement;
		var parentElement = targetElement.parentNode;

		if (replaceElement) {
			//复制属性
			for (var i = 0; i < targetElement.attributes.length; i++) {
				var attr = targetElement.attributes[i];
				replaceElement.setAttribute(attr.name, attr.value);
			}
			//复制内容
			replaceElement.innerHTML = targetElement.innerHTML;

			//替换vx标签元素
			parentElement.replaceChild(replaceElement, targetElement);
		}

		var vxData = element.vxData || (element.vxData = {});
		//var vx = element.vx || (element.vx = {});
		//var classMap = vx.classMap || (vx.classMap = { });
		
		Array.prototype.forEach.call(element.attributes, function (attr) {
			if (attr.specified) { //如果这个属性你在源代码或者在脚本中明确指定的话，它总是返回真。否则它是由文档的DTD默认定义的，将总是返回假。
				if (attr.name.substr(0, 3) == ""vx-"") {
					var attrName = attr.name.substr(3);

					switch (attrName) {
						case ""if"":
							element.vxType = 1;
							if (!element.vxTemplate) {
								element.setAttribute(""template"", ""..."");
								element.vxTemplate = element.innerHTML;
							}
							break;
						case ""for"":
							//if (element.parentNode.childNodes.length > 3) throw ""for missing contain"";

							element.vxType = 2;
							Element_clearChild(parentElement);
							//parentElement.appendChild(element);
							//var parentVx = parentElement.vx || (parentElement.vx = {});
							if (!parentElement.vxTemplate) {
								parentElement.setAttribute(""template"", ""..."");
								parentElement.vxTemplate = element;
							}
							break;
					}

					//一个属性有一个设置程序
					//一个属性有多个逻辑表达式
					//一个逻辑表达式有一个逻辑编译程序
					//一个逻辑表达式有：多个指针表达式 + 多个字符表达式
					//一个指针表达式 => 一个指针有：一个getClassName + 一个getData + 一个文本 + 一个设置程序
					var attrFunc = function () {
						//执行属性表达式，获取属性值
						var attrValue = attrFuncParts.map(function (attrFuncPart) { return attrFuncPart(); });
						if (attrValue.length < 2)
							attrValue = attrValue[0];
						else
							attrValue = attrValue.join("""");
						
						switch (attrName) {
							case ""if"":
								if (vxData[attrName] != attrValue) {
									vxData[attrName] = attrValue;
									Element_clearChild(element);
									if (attrValue) element.innerHTML = element.vxTemplate;
									compileViewx(page);
								}
								break;
							case ""for"":
								Element_clearChild(parentElement);
								vxData[attrName] = attrValue;
								if (attrValue) {
									var documentFragment = document.createDocumentFragment();
									for (var i = 0; i < attrValue.length; i++) {
										var cloneElement = Element_Clone(element);
										cloneElement.removeAttribute(""vx-for"");
										cloneElement.vxForIndex = i;
										cloneElement.vxForItem = attrValue[i];
										cloneElement.vxType = 2;
										documentFragment.appendChild(cloneElement);
									}
									parentElement.appendChild(documentFragment, element);
									compileViewx(page);
								};
								break;
							case ""template"":
								Element_clearChild(element);
								element.innerHTML = attrValue;
								compileViewx(page);
								break;
							default:
								element.setAttribute(attrName, attrValue);
								break;
						}
					}

					var attrFuncParts = [];
					attr.value.match(/(?:\{\{([^\}]*)\}\})|((?:[^{]+|\{))/g).forEach(function (matchItem) {
						if (matchItem.indexOf(""{{"") >= 0) {
							attrFuncParts.push(Element_compileLogicExpression(page, element, parentElement, matchItem, attrFunc));
						} else {
							attrFuncParts.push(function () {
								return matchItem; //stringExpression
							});
						}
					});

					attrFunc(); //初始化一次
				}
			}
		});


		//<span>替换<vx>
		//replaceElement表示是vx标签
		if (replaceElement)
		{
			if (element.vxInnerText == null) element.vxInnerText = element.innerText.trim();
			if (element.vxInnerText.substr(0, 2) == ""{{"" && element.vxInnerText.substr(element.vxInnerText.length - 2) == ""}}"") {

				var textFunc = function () {
					element.innerText = expression(page, element);
				};
				var expression = Element_compileLogicExpression(page, element, parentElement, element.vxInnerText, textFunc);

				textFunc(); //初始化一次
			} else throw element.vxInnerText;
		}

		removeClass(element, ""vx"");
	}

	function Element_compileLogicExpression(page, element, parentElement, logicExpressionOuter, /*设置程序*/setFun)
	{
		var logicExpression = logicExpressionOuter.substr(2, logicExpressionOuter.length - 4).replace(/(?:([a-zA-Z][\w\.\[\]0-9]*))|(?:\""[^\""]*\"")|(?:\'[^\""]*\')/g, function (otherExpression, pointExpression) {
			if (pointExpression) {
				var pointItems = pointExpression.split(""."");
				var scope = Element_getScope(element, parentElement);
				var dataFun = scope[pointItems[0]];
				if (dataFun === undefined) {
					//class绑定
					var vxData = element.vxData || (element.vxData = {});
					var pointFuncs = vxData[""vx-data-"" + pointExpression];
					if (pointFuncs == null) {
						vxData[""vx-data-"" + pointExpression] = pointFuncs = [];
						addClass(element, ""vx-data-"" + pointExpression);
					};

					pointFuncs.push(setFun);
                }

				return 'fn(""' + pointExpression + '"")';
			} else return otherExpression;
		});
		logicExpression = win.eval(""0||function(fn){ return "" + logicExpression + ""}"");

		return function () {
			return logicExpression(function (pointExpression) {

				var pointItems = pointExpression.split(""."");
				var scope = Element_getScope(element, parentElement);
				var dataFun = scope[pointItems[0]];
				if (dataFun !== undefined)
					return Element_getObjectData(dataFun(), pointItems, 1);
				else
					return Element_getObjectData(page.data, pointItems, 0);

			});
		}
    }

	//return:[className, page.data, for.data]
	//如果vx-for时，因为element是template元素，没有parentNode。因此需要通过parentElement传进来
	function Element_getScope(element, parentElement) {
		if (element) {
			if (element.vxCs == viewx.cs) { //编译号相等
				return element.vxScope;
			} else { //编译号不相等，刷新scopes
				element.vxCs = viewx.cs;

				if (element.tagName != ""HTML"") { //非HTML标签

					if (element.vxType != 2) { //普通标签、条件标签
						return element.vxScope = Element_getScope(element.parentNode || parentElement);
					} else { //循环标签
						var scope = element.vxScope = Object.assign({}, Element_getScope(element.parentNode || parentElement));

						var forItemName = element.getAttribute(""for-item"") || ""item"";
						var forIndexName = element.getAttribute(""for-index"") || ""index"";

						scope[forItemName] = function () {
							return element.vxForItem;
						};
						scope[forIndexName] = function () {
							return element.vxForIndex;
						};

						return scope;
					}
				} else { //HTML标签
					return element.vxScope || (element.vxScope = {});
				}
			}
		} else return {};
	}

	function Element_getObjectData(data, pointItems, start)
	{
		for (var i = start; i < pointItems.length; i++)
		{
			if (data == null) return null;
			data = data[pointItems[i]];
		}
		return data;
	}

	function Element_Clone(element)
	{
		var cloneNode = element.cloneNode();

		for (var i = 0; i < element.childNodes.length; i++)
		{
			cloneNode.appendChild(Element_Clone(element.childNodes[i]));
		}

		return cloneNode;
	}

	function hasClass(obj, cls) {
		return obj.className.match(new RegExp('(\s|^)' + cls + '(\s|$)'));
	}

	function addClass(obj, cls) {
		if (obj.classList) obj.classList.add(cls);
		else if (!hasClass(obj, cls)) obj.className += "" "" + cls;
	}

	function removeClass(obj, cls) {
		if (obj.classList) obj.classList.remove(cls);
		else if (hasClass(obj, cls)) {
			var reg = new RegExp('(\s|^)' + cls + '(\s|$)');
			obj.className = obj.className.replace(reg, ' ');
		}
	}

	function Element_clearChild(element) {
		while (element.hasChildNodes()) element.removeChild(element.firstChild);
    }

	/*** viewx ***/
	var viewx = win.vx = function () {
		compileViewx(rootPage);
	}

	function compileViewx(page) {
		if (viewx.ci) return;
		viewx.ci = true; //编译中
		viewx.cs = (viewx.cs || 0) + 1; //编译号

		try {
			while (true) {
				var element = win.document.getElementsByClassName(""vx"")[0];
				if (element) {
					Element_compile(page, element);
				} else break;
			}

			while (true) {
				var element = win.document.getElementsByTagName(""vx"")[0];
				if (element) {
					Element_compile(page, element, document.createElement(""span""));
				} else break;
			}
		} finally {
			viewx.ci = false;
        }
	};

	/*** Page ***/
	function Page(o) {
		var that = this;
		that.data = {};
		win.Object.assign(that, o);

		if (o.observers) {
			that.observers = {};
			for (var keysName in o.observers) {
				(function () {
					var keysFun = o.observers[keysName],
						keys = keysName.split("","");

					var keysFun2 = function () {
						var datas = [];
						for (var i = 0; i < keys.length; i++) {
							datas.push(that.data[key]);
						}
						keysFun.apply(that, datas);
					};

					for (var i = 0; i < keys.length; i++) {
						var key = keys[i] = keys[i].trim(); //去空格
						var keyObserver = that.observers[key]; //获取属性的观察器数组
						if (!keyObserver) keyObserver = that.observers[key] = []; //如果观察器数组不存，则创建一个
						keyObserver.push(keysFun2);
					}
				})()
			}
		}
	};

	Page.prototype = {
		setData: function (a0, a1) {
			var that = this;
			switch (arguments.length) {
				case 1:
					for (var key in a0) Page_setSingleData(that, key, a0[key]);
					if (that.observers) {
						var observer = [];
						for (var key in a0) {
							var keyObserver = that.observers[key];
							if (keyObserver)
								for (var i = 0; i < keyObserver.length; i++) observer.push(keyObserver[i]);
						}
						observer.distinct();
						for (var i = 0; i < observer.length; i++) observer[i]();
					}
					break;
				case 2:
					Page_setSingleData(that, a0, a1);
					if (that.observers) {
						var observer = that.observers[a0];
						if (observer) {
							for (var i = 0; i < observer.length; i++) observer[i]();
						}
					}
					break;
			}
		}
	};

	function Page_setSingleData(page, key, data) {
		page.data[key] = data;
		var vxDataKey = ""vx-data-"" + key;
		var elements = win.document.getElementsByClassName(vxDataKey);
		Array.prototype.forEach.call(elements, function (element) {
			var vxData = element.vxData || (element.vxData = {});
			var vxSetFuncs = vxData[vxDataKey] || [];
			for (var i = 0; i < vxSetFuncs.length; i++) {
				vxSetFuncs[i]();
			}
		})
	};

	var rootPage;
	win.Page = function (o) {
		var onShow = o.onShow || function () { }
		var onHide = o.onHide || function () { }
		o.onShow = function () {
			if (o.servicePath != null) win.require(""/api/service.js"").set(o.servicePath, this)
			onShow.call(this)
		}
		o.onHide = function () {
			if (o.servicePath != null) win.require(""/api/service.js"").set(o.servicePath, null)
			onHide.call(this)
		}

		if (rootPage) throw ""Page created"";
		rootPage = new Page(o);
		win.document.addEventListener(""DOMContentLoaded"", function () {
			compileViewx(rootPage);
			if (rootPage.onLoad) rootPage.onLoad();
			if (rootPage.onShow) rootPage.onShow();
		})
	}

})(window);