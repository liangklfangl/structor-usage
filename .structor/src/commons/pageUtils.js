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
// 找到.structor/app/components.js目录导出的组件

/**
 * 
 * @param {*} index 
 * @param {*} componentName 
 * @param {*} namespace 
 */
export function findComponent(index, componentName, namespace) {
  let result = undefined;
  if (index) {
    // 如果是namespace也存在，那么找到namespace下的componentName
    if (componentName && namespace) {
      if (index[namespace]) {
        result = index[namespace][componentName];
      }
    } else if (componentName) {
      // 如果没有namespace直接显示即可
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
  let type = findComponent(components, modelNode.type, modelNode.namespace);
  // 创建元素类型，比如div或者Input
  let props = extend({}, modelNode.props, { key: node.key });
  // {type: "div", props: {style:{border:'1px solid red'}}, children: Array(1)}
  if (node.props) {
    // 节点本身有props，那么会作为一个新的创建react元素作为props属性，比如那些react节点的元素可以这么做
    // reactNode类型
    // https://babeljs.io/en/repl.html#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=G4QwTgBADmD2BmBLANgUwgXggHgCaOAgGcAXATzQwG8qAjWMXVMALgHIBGKAD2NmUS4IYVLjYBfcQD4AUBHkLsACwBMUwJvxgGcTA9GYAJFdgD0q2UfzApAbhlA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-0&prettier=false&targets=&version=6.26.0&envVersion=
    forOwn(node.props, (prop, propName) => {
      // style等元素也是要动态创建的，这是react的形式
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
        onMouseDown:mouseDownHandler,
        // 鼠标点击的时候触发
        wrappedProps: {
          ...props,
          bindPropSelectChange,
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
        // 包裹的组件
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
    // 遍历children列表进行创建元素
    model.children.forEach(child => {
      elements.push(
        // 每一个创建的子元素都会接受到的属性和方法列表
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
