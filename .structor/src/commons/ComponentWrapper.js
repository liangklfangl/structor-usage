import React, { Component } from "react";
import ReactDOM from "react-dom";

/**
 * 根据props创建自己的组件
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
    // 默认的state
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
      console.log('this.$DOMNode inner====',this.$DOMNode);
      this.$DOMNode
        .on("mousedown", this.handleMouseDown)
        // 点击鼠标的回调
        .on("mouseover", this.handleMouseOver)
        .on("mouseout", this.handleMouseOut)
        .on("click", this.handleNoop)
        .on("doubleclick", this.handleNoop)
        .on("mouseup", this.handleNoop);
    }
  }

  /**
   * 组件卸载
   */
  componentWillMount() {
    this.subscribeToInitialState();
  }

  /**
   * 组件挂载
   */
  componentDidMount() {
    this.initDOMNode();
  }

  /**
   * 移除组件上挂载的事件
   */
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

  /**
   * 
   * @param {*} nextProps
   * 父级元素:组件接受新的props 
   */
  componentWillReceiveProps(nextProps) {
    this.subscribeToInitialState();
  }

  /**
   * 
   * @param {*} e 
   * 父级元素:鼠标点击事件,回调mousedown
   */
  handleMouseDown(e) {
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
   * 父级元素:鼠标移动 
   */
  handleMouseOver(e) {
    console.log('handleMouseOver ');
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
   * 父级元素:鼠标移出 
   */
  handleMouseOut(e) {
    console.log('handleMouseOut ');
    const { initialState } = this.props;
    if (initialState && initialState.onMouseOut) {
      this.initDOMNode();
      initialState.onMouseOut({
        targetDOMNode: this.$DOMNode[0],
        remove: true
      });
    }
  }

  /**
   * 
   * @param {*} e
   * 父级元素:单击/双击/鼠标放开回调 
   */
  handleNoop(e) {
    if (!e.shiftKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  /**
   * 父级元素:构建的ComponentWrapper就是mousedown,initialState等多种配置
   */
  render() {
    const { wrappedComponent, wrappedProps, children } = this.props;
    return React.createElement(wrappedComponent, wrappedProps, children);
  }
}

export default ComponentWrapper;
