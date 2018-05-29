import {
  forOwn,
  isObject,
  isString,
  extend,
  difference,
  keys,
  isEqual
} from "lodash";
import React, { Component } from "react";
import ComponentWrapper from "./ComponentWrapper.js";
import * as components from "../../app/components.js";

export function findComponent(index, componentName, namespace) {
  let result = undefined;
  if (index) {
    if (componentName && namespace) {
      if (index[namespace]) {
        result = index[namespace][componentName];
      }
    } else if (componentName) {
      result = index[componentName];
    }
  }
  if (!result) {
    result = componentName || "div";
  }
  return result;
}

/**
 * 
 * @param {*} node : 也就是我们关注的mountNode标签
 * @param {*} initialState 
 * @param {*} mouseDownHandler 
 * @param {*} options 
 */
export function createElement(node, initialState, mouseDownHandler, options) {
  let modelNode = node.modelNode;
  // 找到每一个的modelNode
  let type = findComponent(components, modelNode.type, modelNode.namespace);
  // 创建元素
  console.log("type====", type);
  console.log("findComponent的node===", node);
  let props = extend({}, modelNode.props, { key: node.key });
  console.log("props===", props);
  console.log("\n\n");
  if (node.props) {
    // 为每一个props添加一个新的组件类型
    forOwn(node.props, (prop, propName) => {
      props[propName] = createElement(
        prop,
        initialState,
        mouseDownHandler,
        options
      );
    });
  }
  let nestedElements = null;
  // Node的children,设置子组件
  if (node.children && node.children.length > 0) {
    let children = [];
    node.children.forEach(node => {
      children.push(
        createElement(node, initialState, mouseDownHandler, options)
      );
    });
    nestedElements = children;
  } else if (modelNode.text) {
    nestedElements = [modelNode.text];
  }

  let result = null;
  try {
    if (options.isEditModeOn) {
      // 默认的isEditModeOn为true表示编辑模式
      const wrapperProps = {
        key: node.key,
        onMouseDown: mouseDownHandler,
        elementKey: node.key,
        type: modelNode.type,
        initialState: initialState,
        // 默认的组件配置数据
        wrappedProps: {
          ...props,
          onMouseDown: mouseDownHandler,
          disabled: false
        },
        // 这是被包裹的元素添加的属性
        wrappedComponent: type
      };

      // ComponentWrapper为要新构建的属性
      result = React.createElement(
        ComponentWrapper,
        wrapperProps,
        nestedElements
      );
      console.log(
        "wrapperProps的值为====",
        wrapperProps,
        options,
        result,
        result.type.prototype ? result.type.prototype.render : null
      );
    } else {
      result = React.createElement(type, props, nestedElements);
    }
    console.log("result.type.prototype====", result);
    // 如果是原来的类型
    if (result.type.prototype) {
      if (result.type.prototype.render) {
        // 重新组件的render方法
        result.type.prototype.render = (fn => {
          return function render() {
            try {
              return fn.apply(this, arguments);
            } catch (err) {
              console.error(err);
              return React.createElement(
                "div",
                {
                  style: {
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#c62828",
                    color: "white",
                    padding: "3px",
                    display: "table"
                  }
                },
                React.createElement(
                  "span",
                  {
                    style: {
                      display: "table-cell",
                      verticalAlign: "middle"
                    }
                  },
                  "'" + modelNode.type + "' " + err.toString()
                )
              );
            }
          };
        })(result.type.prototype.render);
      }
    }
  } catch (e) {
    console.error(
      "Element type: " +
        modelNode.type +
        " is not valid React Element. Please check your components.js file. " +
        e
    );
  }
  return result;
}
// this.elementTree = createElements(
// 	pageModel,
// 	this.initialState,
// 	this.onComponentMouseDown,
// 	{
// 	  isEditModeOn: isEditModeOn
// 	}
//   );
// 对于children下面的所有的元素进行遍历
export function createElements(model, initialState, mouseDownHandler, options) {
  console.log("createElements接受到的model为===", model);
  initialState.elements = {};
  let elements = [];
  if (model && model.children && model.children.length > 0) {
    model.children.forEach(child => {
      elements.push(
        createElement(child, initialState, mouseDownHandler, options)
      );
    });
  }
  console.log("创建的elements结果为====", elements);
  return elements;
}
