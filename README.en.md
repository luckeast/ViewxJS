# ViewxJS

#### Introduction
ViewxJS, a simple front-end mvc framework

#### File size
|File name|File size|File description|
|--|--|--|
|viewx.min.js.zip|2.4k|js code compression + zip compression for production and operation environments with higher network requirements|
|viewx.min.js|5.7k|js code compression, used in production operations|
|viewx.js|14.5k|js source code, used for development and testing|
|jsc.min.js|2.79k|For compatibility with lower version browsers, such as: IE5.5-IE8.0|


#### Compatible version

| Computer terminal | Browser | Minimal version |
|-|-|-|
| ![Internet Explorer](https://developer.mozilla.org/static/media/internet-explorer.cf17782c.svg "Internet Explorer")| Internet Explorer | 5.5 |
| ![Chrome](https://developer.mozilla.org/static/media/chrome.4c570865.svg "Chrome")| Chrome | 1 |
| ![Edge](https://developer.mozilla.org/static/media/edge.40018f6a.svg "Edge") | Edge | 12 |
| ![Firefox](https://developer.mozilla.org/static/media/firefox.51d8a59c.svg "Firefox") | Firefox | 3 |
| ![Opera](https://developer.mozilla.org/static/media/opera.a0ab0c50.svg "Opera") | Opera | 15 |
| ![Safari](https://developer.mozilla.org/static/media/safari.3679eb31.svg "Safari") | Safari | 4 |


| Mobile terminal | Browser | Minimal version |
|-|-|-|
| ![WebView Android](https://developer.mozilla.org/static/media/android.7d9bf320.svg "WebView Android") | WebView Android | 1 |
| ![Chrome Android](https://developer.mozilla.org/static/media/chrome.4c570865.svg "Chrome Android") | Chrome Android | 18 |
| ![Firefox Android](https://developer.mozilla.org/static/media/firefox.51d8a59c.svg "Firefox Android") | Firefox Android | 4 |
| ![Opera Android](https://developer.mozilla.org/static/media/opera.a0ab0c50.svg "Opera Android") | Opera Android | 14 |
| ![iOS Safari](https://developer.mozilla.org/static/media/safari.3679eb31.svg "iOS Safari") | iOS Safari | 3.2 |
| ![Samsung Internet](https://developer.mozilla.org/static/media/samsung-internet.6fd7f423.svg "Samsung Internet") | Samsung Internet | 1.0 |

> Compatible with IE5.5-IE8 browsers, you need to quote /lib/jsc.min.js. (If you don't need to be compatible with lower version browsers, you don't need to reference the jsc library)

#### Compilation Principle

1. Find the tags that need to be compiled through document.getElementsByClass("vx")
2. Find the attribute that needs to be compiled by the attribute name prefixed with "vx-"
3. Find the text content that needs to be compiled through document.getElementsByTagName("vx")

> Viewx's compilation principle makes dynamic compilation fast, and it can be considered that precompilation is not required.

#### Dynamically compile nested templates

> For some special development scenarios, it is more convenient to use dynamic compilation than pre-compilation. <br>
> Such as: store the custom template in the table, get the template content through ajax, and dynamically compile the template and display it through the nested template (v-inner-html).

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                myTemplate: null,
                name: "Tom"
            },
            onLoad: function(){
                this.setData({ myTemplate:"Hi,<vx>{{name}}</vx>" });
            }
        })
    </script>
</head>
<body>
    Dynamically compile nested templates:
    <div class="vx" v-inner-html="{{myTemplate}}"></div>
</body>
</html>

```



## Example
#### say hello
Demonstrate the simplest example say hello

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                name: "Tom"
            }
        })
    </script>
</head>
<body>

    <vx>{{name}}</vx> say hello

</body>
</html>
```
Sample file: /demo/say-hello.html

#### page onload
The loading event of the demo page, the onload event is the initial method of the page life cycle.

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            onLoad: function () {
                document.getElementsByTagName("body")[0].innerText = "Page has been loaded";
            }
        })
    </script>
</head>
<body>

</body>
</html>
```
Sample file: /demo/page-onload.html


#### setData
Demonstrate that the view is updated through the setData control data model.
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                time:0
            },
            onLoad: function () {
                var that = this;
                setInterval(function () {
                    that.setData({ time: new Date() });
                }, 1000);
            }
        })
    </script>
</head>
<body>

    current time: <vx>{{time}}</vx>

</body>
</html>
```
Sample file: /demo/set-data.html


#### page observers
Demonstrate the monitoring of page data changes through the observers property of the page
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                time: 0
            },
            onLoad: function () {
                var that = this;
                setInterval(function () {
                    that.setData({ time: new Date() });
                }, 1000);
            },
            observers: {
                time: function (value) {
                    document.getElementsByTagName("body")[0].innerText = "observer time: "+ value;
                }
            }
        })
    </script>
</head>
<body>

</body>
</html>
```
Sample file: /demo/observers.html


#### Loop

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                list:[{ name:"hello" },{ name:"kity" },{ name:"tom" },{ name:"cat" }]
            },
            onLoad: function () {
                
            }
        })
    </script>
</head>
<body>

    <div class="vx" vx-for="{{list}}" for-item="item" for-index="index">

        <div>
            name:<vx>{{item.name}}</vx>, index:<vx>{{index}}</vx>
            <span class="vx" vx-if="{{index%2==0}}">, odd lines</span>
            <span class="vx" vx-if="{{index%2==1}}">, even rows</span>
        </div>

    </div>

</body>
</html>
```
Sample file: /demo/for.html

#### Conditions

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                show: true,
                name: "Tom"
            },
            onLoad: function () {
                var that = this;

                setInterval(function () {
                    that.setData({
                        show: !that.data.show
                    });
                }, 500);
            }
        })
    </script>
</head>
<body>

    <div class="vx" vx-if="{{show}}">Hi, <vx>{{name}}</vx>!</div>

</body>
</html>
```
Example file: /demo/if.html

#### Binding events

> catch refers to a bound event that prevents bubbling

```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                output: "click me"
            },
            myClick: function (e) {
                this.setData({ output: "Hi," + e.currentTarget.dataset.name })
            }
        })
    </script>
</head>
<body>

    <div class="vx" catch-click="myClick" data-name="Tom"><vx>{{output}}</vx></div>
    
</body>
</html>
```
Sample file: /demo/catch-event.html

> bind refers to the bound event with bubbling

```
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            data: {
                output: "click me"
            },
            myClick: function (e) {
                this.setData({ output: "Hi," + e.currentTarget.dataset.name })
            }
        })
    </script>
</head>
<body>

    <div class="vx" bind-click="myClick" data-name="Tom"><vx>{{output}}</vx></div>
    
</body>
</html>
```
Example file: /demo/bind-event.html