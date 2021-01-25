# viewx

#### 介绍
viewx是一个前端的、mvc框架、轻量级、js模板引擎，兼容ie6+、firefox、chrome

## 示例
#### say hello
演示最简单的例子say hello

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
示例文件：/demo/say-hello.html

#### page onload
演示页面的加载事件，onload事件是页面生命周期的初始方法。

```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <script src="../lib/jsc.min.js" type="text/javascript"></script>
    <script src="../viewx.min.js"></script>
    <script>
        Page({
            onLoad: function () {
                document.getElementsByTagName("body")[0].innerText = "页面已加载";
            }
        })
    </script>
</head>
<body>

</body>
</html>
```
示例文件：/demo/page-onload.html


#### setData
演示通过setData控制数据模型更新视图。
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

    current time : <vx>{{time}}</vx>

</body>
</html>
```
示例文件：/demo/set-data.html


#### 数据观察器observers
用于监听数据更改
```
<script>
Page({
    data:{
        hello:0
    },
    sayHello:function(hello, world){
        return hello;
    },
    observers:{
        hello:function(hello){
            console.log("hello已更改为:" + hello);
        }
    }
})
</script>
<vx>{{hello}}</vx>
```

