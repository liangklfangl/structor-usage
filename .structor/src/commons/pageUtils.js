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
export function createElement(
  node,
  initialState,
  mouseDownHandler,
  options,
  dragSizeChangeCallback,
  bindPropSelectChange,
  bindEnumContextMenuSelect,
  settingArrayObjectProps
) {
  let modelNode = node.modelNode;
  // 找到每一个的modelNode
  let type = findComponent(components, modelNode.type, modelNode.namespace);
  // 创建元素类型
  let props = extend({}, modelNode.props, { key: node.key });
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
    // 如果有text属性，那么久设置为子元素，这和数据结构一致
    nestedElements = [modelNode.text];
  }

  let result = null;
  try {
    if (options.isEditModeOn) {
      // 默认的isEditModeOn为true表示编辑模式
      const wrapperProps = {
        key: node.key,
        ...props,
        elementKey: node.key,
        type: modelNode.type,
        initialState: initialState,
        wrappedProps: {
          ...props,
          bindPropSelectChange,
          onMouseDown:mouseDownHandler,
          disabled: false,
          key: node.key,
          dragSizeChangeCallback,
          ...settingArrayObjectProps,
          elementKey: node.key,
          type: modelNode.type,
          bindEnumContextMenuSelect,
          initialState: initialState,
        },
        // 这是被包裹的元素添加的属性
        wrappedComponent: type
      };
      console.log("wrapperProps====", wrapperProps);
      // ComponentWrapper为要新构建的属性
      result = React.createElement(
        ComponentWrapper,
        wrapperProps,
        nestedElements
      );
    } else {
      result = React.createElement(type, props, nestedElements);
    }
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
export function createElements(
  model,
  initialState,
  mouseDownHandler,
  options,
  dragSizeChangeCallback,
  bindPropSelectChange,
  bindEnumContextMenuSelect,
  settingArrayObjectProps
) {
  initialState.elements = {};
  let elements = [];
  if (model && model.children && model.children.length > 0) {
    model.children.forEach(child => {
      elements.push(
        createElement(
          child,
          initialState,
          mouseDownHandler,
          options,
          dragSizeChangeCallback,
          bindPropSelectChange,
          bindEnumContextMenuSelect,
          settingArrayObjectProps
        )
      );
    });
  }

  return elements;
}
