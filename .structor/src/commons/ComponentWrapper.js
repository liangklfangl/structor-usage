import React, { Component } from "react";
import ReactDOM from "react-dom";

/**
 * React.createElement(
     ComponentWrapper,
      wrapperProps,
      nestedElements
);
 */
class ComponentWrapper extends Component {
  constructor(props, content) {
    super(props, content);
    this.subscribeToInitialState = this.subscribeToInitialState.bind(this);
    this.initDOMNode = this.initDOMNode.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleNoop = this.handleNoop.bind(this);
  }

  subscribeToInitialState() {
    const { onMouseDown, initialState, elementKey, type } = this.props;
    if (initialState) {
      initialState.onMouseDown = {};
      initialState.elements[elementKey] = {
        type,
        getDOMNode: () => {
          this.initDOMNode();
          return this.$DOMNode[0];
        }
      };
    }
  }

  /**
   * 为创建的组件添加鼠标事件
   */
  initDOMNode() {
    if (!this.$DOMNode) {
      this.$DOMNode = $(ReactDOM.findDOMNode(this));
      console.log("this.$DOMNode===", this.$DOMNode);
      this.$DOMNode
        .on("mousedown", this.handleMouseDown)
        .on("mouseover", this.handleMouseOver)
        .on("mouseout", this.handleMouseOut)
        .on("click", this.handleNoop)
        .on("doubleclick", this.handleNoop)
        .on("mouseup", this.handleNoop);
    }
  }

  componentWillMount() {
    this.subscribeToInitialState();
  }

  componentDidMount() {
    console.log("initDOMNode===initDOMNode");
    this.initDOMNode();
  }

  componentWillUnmount() {
    if (this.$DOMNode) {
      this.$DOMNode
        .off("mousedown")
        .off("mouseover")
        .off("mouseout")
        .off("click")
        .off("doubleclick")
        .off("mouseup");
    }
    this.$DOMNode = undefined;
  }

  componentWillReceiveProps(nextProps) {
    this.subscribeToInitialState();
  }

  /**
   * 
   * @param {*} e 
   * 鼠标点击事件
   */
  handleMouseDown(e) {
    debugger;
    if (!e.shiftKey) {
      e.stopPropagation();
      e.preventDefault();
      const { onMouseDown, initialState, elementKey } = this.props;
      // 点击鼠标
      if (onMouseDown) {
        onMouseDown(elementKey, e.metaKey || e.ctrlKey);
      }
      initialState.lastMousePos = { pageY: e.pageY, pageX: e.pageX };
      if (initialState && initialState.onMouseDown[elementKey]) {
        initialState.onMouseDown[elementKey](e);
      }
    }
  }

  /**
   * 
   * @param {*} e
   * 鼠标移动 
   */
  handleMouseOver(e) {
    const { initialState, elementKey, type } = this.props;
    if (initialState && initialState.onMouseOver) {
      this.initDOMNode();
      initialState.onMouseOver({
        targetDOMNode: this.$DOMNode[0],
        type,
        key: elementKey
      });
    }
  }

  /**
   * 
   * @param {*} e
   * 鼠标移出 
   */
  handleMouseOut(e) {
    const { initialState } = this.props;
    if (initialState && initialState.onMouseOut) {
      this.initDOMNode();
      initialState.onMouseOut({
        targetDOMNode: this.$DOMNode[0],
        remove: true
      });
    }
  }

  handleNoop(e) {
    console.log("e.shiftKey===", e.shiftKey);
    if (!e.shiftKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  render() {
    const { wrappedComponent, wrappedProps, children } = this.props;
    return React.createElement(wrappedComponent, wrappedProps, children);
  }
}

export default ComponentWrapper;
