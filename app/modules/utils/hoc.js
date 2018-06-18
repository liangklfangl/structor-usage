import Rnd from "react-rnd";
import React from "react";
import ReactDOM from "react-dom";
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu
} from "react-contextmenu";
import { createStructuredSelector } from "reselect";
import R from "ramda";
import { LEFT, RIGHT, DOWN, UP, STEP } from "./const";
import { getProps, transformProps, uniqueBy } from "./propsUtils";
import { getSelectedComponentType, isAllowDrag } from "./componentTypeUtil";
import motifyLifeCycle from "./motifyLifecycle";
// import { connect } from "react-redux";
// 得到选择组件的类型
import componentsDefs from "./indexAttributePanelSettings";
// import EventProxy from "./eventProxy";
window.batchSelectedComponent = [];
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white"
};

/**
 * 100px -> 100
 */
function getUnitPix(pixel) {
  return parseInt(pixel);
}
/**
 * 这里要写一个高阶组件来处理react-rnd包裹
 */

export default function HOC(WrappedComponent) {
  const RndWrappedComponentClass = class RndWrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.mousemove = this.mousemove.bind(this);
      this.mouseup = this.mouseup.bind(this);
      // 默认宽度
      this.state = {
        width: 50,
        height: 100,
        x: 10,
        y: 10,
        combinedProps: {}
      };
      this.dragging = null;

      this.position = {
        clientX: 0,
        clientY: 0,
        deltaX: 0,
        deltaY: 0
      };
    }

    /**
     * 
     * @param {*} components 
     * 编辑两个组件
     */
    batchEditComponent(components) {
      console.log("batchEditComponent components===", components);
      const uniquedCnpts = uniqueBy(components, "componentKey");
      if (uniquedCnpts.length >= 2 && isAllowDrag(uniquedCnpts)) {
        // 必须有一个是行为组件，一个是数据组件
        debugger;
      }
    }
    /**
     * 非枚举类型进行设置值:通过弹窗展示
     * elementKey:组件的key
     * key:设置的props的名字
     * label:设置props的label
     */
    settingRightPanelSelectedValue(elementKey, key, label) {
      this.props.bindPropSelectChange &&
        this.props.bindPropSelectChange(elementKey, key, label);
    }
    /**
     * 右键弹出面板被点击:适用于枚举类型点击
     * key:修改的那个prop属性
     * value:将属性值设置为value
     */
    handleRightMenuPanelClick(value, data, key) {
      const componentKey = this.props.elementKey;
      const updatedProps = {
        [key]: transformProps(value),
        key: componentKey
      };
      const combinedProps = {
        ...this.state.combinedProps,
        [key]: transformProps(value)
      };
      // 合成props
      this.setState({
        combinedProps
      });
      // 通知服务端要保存的值
      if (this.props.bindEnumContextMenuSelect) {
        this.props.bindEnumContextMenuSelect(
          componentKey,
          key,
          transformProps(value)
        );
      }
    }

    /**
     * 
     * @param {*} componentKey 组件的key
     * @param {*} key 展示的修改的那个组件prop的值
     * @param {*} props 附加的组件的属性，比如Table组件的columns对象数组，用于弹窗默认展示
     */
    settingArrayObjectProps(componentKey, key, props) {
      const { settingArrayObjectProps } = this.props.propsUtils;
      if (settingArrayObjectProps) {
        settingArrayObjectProps(componentKey, key, props);
      }
    }
    /**
     * 设置右键弹出来的面板，提供给用户选择
     * 需要知道:控件ID+修改的那个属性+属性的值
     */
    generateRightPanelSettings(ComponentSupportedProps) {
      const keys = Object.keys(ComponentSupportedProps);
      const menuItems = [];
      // 所有的面板key
      for (let t = 0, len = keys.length; t < len; t++) {
        const attrEl = ComponentSupportedProps[keys[t]];
        const { defaultValue, label, value, type, enums, props = [] } = attrEl;
        if (type == "enum") {
          // 如果是枚举值，那么添加新的子级节点,直接修改props即可
          const subMenus = (
            <SubMenu title={label}>
              {enums.map((el, idx) => {
                return (
                  <MenuItem
                    key={"sub_" + idx}
                    onClick={(e, data) => {
                      this.handleRightMenuPanelClick(el, data, keys[t]);
                    }}
                    data={attrEl}
                  >
                    {el}
                  </MenuItem>
                );
              })}
            </SubMenu>
          );
          menuItems.push(subMenus);
        } else {
          type == "arrayObject"
            ? menuItems.push(
                <MenuItem
                  data={attrEl}
                  onClick={() => {
                    this.settingArrayObjectProps(
                      this.props.elementKey,
                      keys[t],
                      props
                    );
                  }}
                >
                  {label}
                </MenuItem>
              )
            : menuItems.push(
                <MenuItem
                  data={attrEl}
                  onClick={() => {
                    this.settingRightPanelSelectedValue(
                      this.props.elementKey,
                      keys[t],
                      label
                    );
                  }}
                >
                  {label}
                </MenuItem>
              );
          // 非枚举类型需要弹窗展示，而且不能单独弹窗必须是全局弹窗
        }
      }
      return menuItems;
    }

    /**
     * 
     * @param {*} e
     * 鼠标移动事件 
     */
    mousemove(e) {
      if (this.dragging) {
        this.position.deltaX = e.clientX - this.position.clientX;
        this.position.deltaY = e.clientY - this.position.clientY;
        this.position.clientX = e.clientX;
        this.position.clientY = e.clientY;
        const { x, y } = this.state;
        // 获取到当前元素的x,y坐标
        const newX = x + this.position.deltaX;
        const newY = y + this.position.deltaY;
        // e.originalEvent.stopPropagation();
        // e.originalEvent.preventDefault();
        this.setState({
          ...this.state,
          x: newX,
          y: newY
        });
      }
    }

    /**
     * 
     * @param {*} e 
     * 鼠标停止移动移除事件并将最新的数据保存到store中
     */
    mouseup(e) {
      const wrappedElClss = ".wrapped__component--" + this.props.elementKey;
      this.dragging = null;
      $(document)
        .off("mousemove", this.mousemove)
        .off("mouseup", this.mouseup);
      const { x, y } = this.state;
      if (this.props.dragSizeChangeCallback) {
        const updatedProps = {
          key: this.props.elementKey,
          x: this.state.x,
          width: this.state.width,
          height: this.state.height,
          y: this.state.y
        };
        this.props.dragSizeChangeCallback(updatedProps);
      }
    }

    mouseclick(e) {
      $(document)
        .off("mousemove", this.mousemove)
        .off("mouseup", this.mouseup);
    }
    /**
     * 初始化事件，如果input设置了disabled以后这个事件也会失效
     */
    initEvent() {
      setTimeout(() => {
        // 优化点1:绑定鼠标事件,不能绑定到document上，否则是全局的，所有的页面的组件在mouseup的时候都会触发
        // 但是此时不能快速将鼠标移动到组件外，否则不能移动
        const wrappedElClss = ".wrapped__component--" + this.props.elementKey;
        const wrappedElRndEl = $(wrappedElClss)[0];
        $(`${wrappedElClss}`)[0].addEventListener(
          "mousemove",
          this.mousemove,
          true
        );
        $(`${wrappedElClss}`)[0].addEventListener(
          "mouseup",
          this.mouseup,
          true
        );
        //在antd的元素上绑定点击事件
        $(`${wrappedElClss}`).mousedown(e => {
          this.position.clientX = e.clientX;
          this.position.clientY = e.clientY;
          this.dragging = e.target;
          const { metaKey } = e;
          if (metaKey) {
            // 多选
            window.batchSelectedComponent.push({
              type: this.props.type,
              componentKey: this.props.elementKey
            });
            this.batchEditComponent(batchSelectedComponent);
          } else {
            // 单选
            const { onMouseDown, elementKey } = this.props;

            window.batchSelectedComponent = [];
            const COMPONENT_TYPE = getSelectedComponentType(this.props.type);
            if (COMPONENT_TYPE == "behavior") {
              const { metaKey } = e;
              EventProxy.trigger(
                (this.props.events && this.props.events[0]) || "widthout_events"
              );
            }
          }
          // 发现在document上移动的时候mouseup事件丢失了~~
          // $(document)
          //   .on("mouseup", this.mouseup)
          //   .on("mousemove", this.mousemove)
          //   .on("mouseleave", this.mousemove)
          //   .on("click", this.mouseclick);
          // document.addEventListener("mousemove", this.mousemove, true);
          // document.addEventListener("mouseup", this.mouseup, true);
        });

        $(`${wrappedElClss}`).on("keydown", e => {
          const { keyCode } = e;
          let changedProps = {};
          switch (keyCode) {
            case RIGHT:
              const { x } = this.state;
              const newX = x + STEP;
              this.setState({
                ...this.state,
                x: newX
              });
              break;
            case LEFT:
              this.setState({
                ...this.state,
                x: this.state.x - STEP
              });
              break;
            case UP:
              this.setState({
                ...this.state,
                y: this.state.y - STEP
              });
              break;
            case DOWN:
              this.setState({
                ...this.state,
                y: this.state.y + STEP
              });
            default:
          }
          //更新数据信息到服务端
          const updatedProps = {
            ...this.state,
            key: this.props.elementKey
          };
          this.props &&
            this.props.dragSizeChangeCallback &&
            this.props.dragSizeChangeCallback(updatedProps);
        });
      }, 0);
    }

    componentDidMount() {
      const { width = 100, height = 50, x = 10, y = 10 } = this.props;
      const { type: ComponentType } = this.props;
      // 设置右键面板
      const ComponentSupportedProps =
        (componentsDefs[ComponentType] &&
          componentsDefs[ComponentType].props) ||
        {};
      const WrapperProps = getProps(ComponentSupportedProps);
      // WrapperProps为默认属性,this.props为真实的数据

      this.initEvent();
      this.setState({
        height,
        combinedProps: { ...WrapperProps, ...this.props },
        width,
        x,
        y
      });
    }

    /**
     * 根据type:本地获取可选配置，然后选中了发送到服务端
     */
    render() {
      const wrappedElClss = "wrapped__component--" + this.props.elementKey;
      const uniqueRightPanelKey = "some_unique_identifier" + Math.random();
      const { type: ComponentType } = this.props;
      // 设置右键面板
      const ComponentSupportedProps =
        (componentsDefs[ComponentType] &&
          componentsDefs[ComponentType].props) ||
        {};
      const WrapperProps = getProps(ComponentSupportedProps);
      const rightClickPanels = this.generateRightPanelSettings(
        ComponentSupportedProps
      );
      const finalDefaultProps = {
        ...ComponentSupportedProps,
        ...this.props
      };

      const COMPONENT_TYPE = getSelectedComponentType(ComponentType);
      // 组件类型
      const { style } = this.props;
      // 将组件本身进行一次包裹，修改其lifeCycle方法
      // 自定义函数
      const ComponentSupportedMethods =
        (componentsDefs[ComponentType] &&
          componentsDefs[ComponentType].addonMethods) ||
        {};
      console.log("ComponentSupportedMethods====", ComponentSupportedMethods);
      // 添加方法到prototype上
      const MotifiedLifeCycleWrappedComponent = motifyLifeCycle(
        WrappedComponent,
        {
          type: COMPONENT_TYPE,
          componentKey: this.props.elementKey,
          key: "dataSource",
          addonMethods: ComponentSupportedMethods,
          events: this.props.events,
          dispatch: this.props.dispatch,
          elementKey: this.props.elementKey,
          propsUtils: {
            settingPropsDirectly:
              this.props.propsUtils &&
              this.props.propsUtils.settingPropsDirectly
          }
        }
      );

      const localProps = {
        ...this.props
      };
      delete localProps.onMouseDown;
      console.log("获取到组件属性为====", localProps);
      return (
        <Rnd
          ref={cpt => {
            this.innerCmpt = cpt;
          }}
          className={wrappedElClss + "_rnd"}
          style={{
            ...style,
            border: "1px solid blue",
            boxSizing: "padding-box"
          }}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            const updatedProps = {
              ...this.state,
              key: this.props.elementKey,
              x: d.x,
              y: d.y
            };
            this.setState({ x: d.x, y: d.y });
            this.props && this.props.dragSizeChangeCallback(updatedProps);
          }}
          onResize={(e, direction, ref, delta, position) => {
            const changedProps = {
              key: this.props.elementKey,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position
            };
            console.log("onResize====", changedProps);
            //相当于立即更新UI
            this.setState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position
            });
            this.props &&
              this.props.dragSizeChangeCallback &&
              this.props.dragSizeChangeCallback(changedProps);
          }}
        >
          <ContextMenu
            id={uniqueRightPanelKey}
            style={{
              border: "1px solid pink"
            }}
          >
            {rightClickPanels}
          </ContextMenu>
          <ContextMenuTrigger id={uniqueRightPanelKey}>
            <MotifiedLifeCycleWrappedComponent
              className={wrappedElClss}
              value={this.props.value}
              onChange={value => {
                MotifiedLifeCycleWrappedComponent.prototype.onChange(
                  value.target ? value.target.value : value
                );
              }}
              {...localProps}
              style={{
                ...style
              }}
            />
          </ContextMenuTrigger>
        </Rnd>
      );
    }
  };
  // 高阶组件包裹的时候直接connect到store是不可以的，因为此时window.__pages还不存在
  // 考虑使用EventProxy或者其他方式/组件挂载的时候再从store中获取值/reselect
  // const pages = window.__pages || [];
  // const currentPath = "/" + window.location.pathname.split("/").slice(2);
  // const page = pages.filter(el => {
  //   return el.pagePath == currentPath;
  // })[0];
  // console.log("我的pages的值为===", window.__pages);
  // function mapDispatchToProps(dispatch) {
  //   return {
  //     dispatch
  //   };
  // }
  // const mapStateToProps = state => ({
  //   value: "覃亮准备输入"
  // });
  // return connect(mapStateToProps, mapDispatchToProps)(RndWrappedComponentClass);
  return RndWrappedComponentClass;
}
