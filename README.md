# cue

#### 介绍
cue是一个前端的、mvc框架、内聚式、轻量级、js模板引擎、面向数据编程思想


#### 使用说明

```
<div class="cue" onclick="cue.invoke('hello')" c-if="{{}}" c-for="{{}}" c-attr="{{}}" c-style="color:{{hello}}">
	<cue>{{hello}}</cue>
</div>

<data>{hello:0}</data>
<method>{sayHello:function(hello, world){
	return hello;
}}</method>
```

