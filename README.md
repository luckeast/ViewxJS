# viewx

#### 介绍
viewx是一个前端的、mvc框架、轻量级、js模板引擎

## 示例
#### say hello
示例文件：/demo/say-hello.html

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

