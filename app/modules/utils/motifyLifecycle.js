const React = require("react");
import EventProxy from "./eventProxy";
const debug = require("debug")("react-safe-component");
// 需要处理的生命周期方法
const lifeCycleMethods = [
  "componentWillMount",
  "componentDidMount",
  "componentWillReceiveProps",
  "shouldComponentUpdate",
  "componentWillUpdate",
  "componentDidUpdate",
  "componentWillUnmount",
  "render"
];

/**
 * 接受到消息的回调函数
 * componentKey:修改哪一个组件
 * key:修改组件的那个props属性
 * eventType:它接受的事件类型CURD,针对不同类型做出不同处理。
 */
function messageReceiveCallback(componentKey, key, eventType = "Query") {
  debugger;
}
/**
 * 
 * @param {*} Component 
 * @param {*} param1 
 * 包裹函数
 */
const wrap = (
  Component,
  { events = [], type = "data", componentKey = "", key = "", propsUtils = {} }
) => {
  /**
    * 已经挂载了错误事件
    */
  if (!Component.prototype.renderSafeComponentError) {
    Component.prototype.renderSafeComponentError = function() {
      return "Oops... an error has occured";
    };
  }

  /**
   * 
   * @param {*} methodName 
   * 1.对生命周期函数包裹的方法
   * 2.不要对所有组件的componentDidMount做一次遍历，否则循环压力太大，建议做一次判断
   */
  const wrapMethod = (methodName, config) => {
    const originalMethod = Component.prototype[methodName];
    // 原有的方法
    if (!originalMethod) {
      return;
    }

    /**
     * 方法拦截,EventProxy接受到事件后的一般都是修改自己的props，比如table就是修改dataSource而已
     */
    Component.prototype[methodName] = function() {
      try {
        /**
         * 拦截componentDidMount方法，在componentWillMount中要卸载掉
         */
        if (methodName == "componentDidMount") {
          console.log("绑定了事件总数type,", events, type);
          // 1.挂载方法,绑定组件能够处理的事件并提供回调，回调函数由用户输入或者直接指明设置到的属性
          if (type == "data") {
            console.log("绑定了事件总数,", events);
            for (let t = 0, len = events.length; t < len; t++) {
              console.log("绑定了事件,", events[t]);
              // EventProxy.on(events[t], () => {
              //   messageReceiveCallback();
              // });
            }
            return originalMethod.apply(this, arguments);
          } else {
            console.log("propsUtils events====", events);
            const { settingPropsDirectly } = propsUtils;
            //   行为组件，这里不做处理，在hoc中通过onMouseDown处理
            for (let t = 0, len = events.length; t < len; t++) {
              console.log(
                "绑定了事件settingArrayObjectProps,",
                events[t],
                settingPropsDirectly
              );
              // EventProxy.on(events[t], () => {
              //   settingPropsDirectly("8", "dataSource", [
              //     {
              //       key: "1",
              //       name: "胡彦斌",
              //       age: 32,
              //       address: "西湖区湖底公园1号"
              //     },
              //     {
              //       key: "2",
              //       name: "胡彦祖",
              //       age: 42,
              //       address: "西湖区湖底公园1号"
              //     }
              //   ]);
              //   console.log("bevavior EventProxy接受到事件---" + events[t]);
              // });
            }
            //  行为组件只能触发，在其(点击)的时候触发
            return originalMethod.apply(this, arguments);
          }
        }
        return originalMethod.apply(this, arguments);
      } catch (e) {
        debug(e);
        if (methodName === "render") {
          return React.createElement(
            "div",
            {
              className: "react__safecomponent-error"
            },
            Component.prototype.renderSafeComponentError.call(this)
          );
        }
        if (methodName === "shouldComponentUpdate") {
          return false;
        }
      }
    };
  };
  lifeCycleMethods.forEach(wrapMethod);
  return Component;
};

export default wrap;
