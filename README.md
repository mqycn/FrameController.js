# FrameController.js

#### 项目介绍
优雅的处理单页多框架（<iframe>）窗口管理同步问题

#### 安装教程

下载后安装到 网站的任意目录，打开 http://您的域名/安装路径/demo/demo.html 即可进行测试。（因为本地浏览器会显示iframe，所以必须放到Web服务器中）

在线测试地址：[http://www.miaoqiyuan.cn/products/frame-controller/](http://www.miaoqiyuan.cn/products/frame-controller/)


#### 使用说明

1、点击发送通知，所有打开的内嵌页都会受到通知。

![基础事件](https://images.gitee.com/uploads/images/2018/1010/212326_aa125905_82383.gif "d1.gif")


```
FrameController.addListener('broadcast', function(e) {
    $('#msg').val(e.data.msg);
    console.log(e.frameId, e.event, e.data);
});

//发送广播
$('#send').click(function() {
    var nums = FrameController.broadcast('broadcast', {
        msg: $('#msg').val()
    });
    console.log('通知成功:', nums);
});
```


2、新增 内嵌页，关闭内嵌页，可以通过：FrameController.addListener('frame.add',func)、FrameController.addListener('frame.remove',func) 进行监听

![新开、关闭事件](https://images.gitee.com/uploads/images/2018/1010/212444_95495d03_82383.gif "d2.gif")

```
//监听系统事件
FrameController.addListener('frame.remove', function(e) {
    console.log(e.frameId, e.event, e.data);
});
FrameController.addListener('frame.add', function(e) {
    console.log(e.frameId, e.event, e.data);
});
```

3、可以对一个事件增加多个监听方法，可以删除所有监听方法、删除某一个监听方法

![事件添加和删除](https://images.gitee.com/uploads/images/2018/1010/212557_3b6ee6f1_82383.gif "d3.gif")
```
var msgEventListener = function(e) {
    console.log(e);
};

//添加自定义事件
$('#add_custom').click(function() {
    FrameController.addListener('event', msgEventListener);
});

//删除自定义事件
$('#remove_custom').click(function() {
    FrameController.removeListener('event', msgEventListener);
});
```


