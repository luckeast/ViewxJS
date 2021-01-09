# viewx

#### 介绍
viewx是一个前端的、mvc框架、轻量级、js模板引擎


#### 设计思路

```
<script>
Page({
    data:{
        hello:0
    },
    sayHello:function(hello, world){
        return hello;
    }
})
</script>
<div class="vx" vx-onclick="sayHello" vx-if="{{}}" vx-for="{{}}" vx-attr="{{}}" vx-style="color:{{hello}}">
	<vx>{{hello}}</vx>
</div>
```

