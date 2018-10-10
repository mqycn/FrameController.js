/**
 * 源码名称：FrameController.js
 * 实现功能：优雅的处理单页多框架（<iframe>）窗口管理同步问题
 * 作者主页：http://www.miaoqiyuan.cn/
 * 联系邮箱：mqycn@126.com
 * 使用说明：http://www.miaoqiyuan.cn/p/framecontroller-js
 * 最新版本：https://gitee.com/mqycn/FrameController.js
 */
(function() {

    if (window.top == window.self) {

        //父窗口
        window.FrameController = (function() {

            var topFrameId = 'parent', //父窗口ID
                data = {
                    events: {}, //事件
                    counter: {}, //事件计数器
                    _count: 1 //窗口ID
                };

            window._data = data;

            /**
             * 获取新的窗口编号
             */
            var getId = function() {
                return 'frame_' + data._count++;
            };

            /**
             * 事件广播
             */
            var broadcast = function(event, value) {

                var _events = data.events,
                    count = 0;

                if (topFrameId === this.frameId) {
                    value = {
                        type: topFrameId,
                        target: window,
                        data: value,
                        frameId: this.frameId
                    };
                }

                for (var _frameId in _events) {
                    if (_frameId != value.frameId && (event in _events[_frameId])) {
                        for (var _funcId in _events[_frameId][event]) {
                            _events[_frameId][event][_funcId](value);
                            count++;
                        }
                    }
                }

                return count;

            };

            /**
             * 添加监听事件
             */
            var addListener = function(event, func) {

                var _events = data.events,
                    _counter = data.counter,
                    _id = this.frameId;

                if (!(_id in _events)) {
                    _events[_id] = {};
                    _counter[_id] = {};
                }

                if (!(event in _events[_id])) {
                    _events[_id][event] = {};
                    _counter[_id][event] = 1;
                }

                _events[_id][event][_counter[_id][event]++] = func;
            };

            /**
             * 删除监听事件
             * 如果不指定func会删除所有本类型的事件
             */
            var removeListener = function(event, func) {
                var _events = data.events,
                    _id = this.frameId;

                if ((_id in _events) && (event in _events[_id])) {
                    var _funcs = _events[_id][event];
                    for (var _funcId in _funcs) {
                        if (_funcs[_funcId] == func || !func) {
                            delete _funcs[_funcId];
                            if (!!func) {
                                //如果指定 func，只会删除一个
                                break;
                            }
                        }
                    }
                }

            };

            /**
             * 删除所有监听事件
             */
            var removeAllListener = function() {
                delete data.events[this.frameId];
                delete data.counter[this.frameId];
            };

            return {
                frameId: topFrameId,
                broadcast: broadcast,
                addListener: addListener,
                removeListener: removeListener,
                removeAllListener: removeAllListener,
                getId: getId
            }
        })();
    } else {

        //子窗口
        window.FrameController = (function() {
            var TopController = window.top.FrameController,
                frameData = {
                    frameId: TopController.getId()
                };

            //广播
            var broadcast = function(event, value) {
                return TopController.broadcast.call(frameData, event, {
                    event: event,
                    type: 'child',
                    target: window,
                    data: value,
                    frameId: frameData.frameId
                });
            };

            //窗口加载或关闭
            var listenerName = 'attachEvent';
            var listenerPrefix = 'on';
            if ('addEventListener' in window) {
                listenerName = 'addEventListener';
                listenerPrefix = '';
            }

            //获取窗口数量
            var getCount = function() {
                return FrameController.broadcast('frame._online') + 1;
            };

            window[listenerName](listenerPrefix + 'load', function() {

                //窗口注册事件
                FrameController.broadcast('frame.add', {
                    msg: '新增窗口'
                });

                //计数事件，仅用于统计框架数
                FrameController.addListener('frame._online', function() {});
            });

            window[listenerName]('unload', function() {

                //窗口关闭事件
                FrameController.broadcast('frame.remove', {
                    msg: '关闭窗口'
                });
                FrameController.removeAllListener();

            });

            //兼容IE8和之前的浏览器
            var bindFrameData = function(func) {
                return function(event, data) {
                    func.call(frameData, event, data);
                };
            }

            return {
                broadcast: broadcast,
                addListener: bindFrameData(TopController.addListener),
                removeListener: bindFrameData(TopController.removeListener),
                removeAllListener: bindFrameData(TopController.removeAllListener),
                count: getCount
            }
        })();
    }

})();