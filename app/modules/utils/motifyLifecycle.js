import React from "react";
import EventProxy from "./eventProxy";
import { fetchGet } from "./IO";
const debug = require("debug")("react-safe-component");
const lifeCycleMethods = [
  // "componentWillMount",
  "componentDidMount"
  // "componentWillReceiveProps",
  // "shouldComponentUpdate",
  // "componentWillUpdate",
  // "componentDidUpdate",
  // "componentWillUnmount",
  // "render"
];

/**
 * 组件接受到消息的回调
 * targetKeys:查询字符串，需要从本地store里面获取
 */
function messageReceiveCallback(msg, store) {
  const currentPath = "/" + window.location.pathname.split("/").slice(2);
  const page = window.__pages.filter(el => {
    return el.pagePath == currentPath;
  })[0];
  const { eventType, interfaceAddress, modal, targetKeys } = msg;
  const pageData = store.getState()[page.pageName];
  const queryParams = targetKeys.reduce((prev, cur) => {
    const { fieldDesc, fieldName, key } = cur;
    const fieldValue = pageData[key];
    prev[fieldName] = fieldValue;
    return prev;
  }, {});
  console.log("componentInstance===", this, store, queryParams);
  debugger;
  fetchGet(interfaceAddress, queryParams)
    .then(res => {
      // debugger;
    })
    .catch(e => {
      // debugger;
    });
}

const wrap = (
  Component,
  {
    events = [],
    type,
    addonMethods = {},
    store = {},
    vergineType = "",
    componentKey = "",
    elementKey = "",
    key = "",
    dispatch = () => {},
    propsUtils = {}
  }
) => {
  const currentPath = "/" + window.location.pathname.split("/").slice(2);
  const page = window.__pages.filter(el => {
    return el.pagePath == currentPath;
  })[0];
  /**
   * 添加实例方法
   */
  const keys = Object.keys(addonMethods);
  console.log("addonMethods=====", addonMethods);
  for (let t = 0, len = keys.length; t < len; t++) {
    const methodName = addonMethods[keys[t]];
    Component.prototype[methodName] = (value, cmptKey) => {
      dispatch({
        type: [page.pageName] + ".",
        payload: {
          [cmptKey]: value
        }
      });
    };
  }
  /**
    * 已经挂载了错误事件
    */
  if (!Component.prototype.renderSafeComponentError) {
    Component.prototype.renderSafeComponentError = function() {
      return "Oops... an error has occured";
    };
  }

  const wrapMethod = methodName => {
    const originalMethod = Component.prototype[methodName];
    if (!originalMethod) {
      Component.prototype[methodName] = function() {};
    }

    Component.prototype[methodName] = function() {
      try {
        if (methodName == "componentDidMount") {
          // 数据组件监听，行为组件直接绑定到click上
          if (type == "data") {
            for (let t = 0, len = events.length; t < len; t++) {
              EventProxy.on(events[t], msg => {
                console.log("数据组件接受到事件:", msg);
                messageReceiveCallback.bind(this)(msg, store);
              });
            }
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
