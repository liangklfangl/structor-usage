import Rnd from "react-rnd";
import React from "react";
import ReactDOM from "react-dom";
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu
} from "react-contextmenu";
import { LEFT, RIGHT, DOWN, UP, STEP } from "./const";
import { getProps, transformProps } from "./propsUtils";
import componentsDefs from "./indexAttributePanelSettings";
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px white",
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
  return class RndWrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.mousemove = this.mousemove.bind(this);
      this.mouseup = this.mouseup.bind(this);
    }
    // 默认宽度
    state = {
      width: 50,
      height: 100,
      x: 10,
      y: 10,
      combinedProps: {}
    };

    position = {
      clientX: 0,
      clientY: 0,
      deltaX: 0,
      deltaY: 0
    };
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
     * 设置右键弹出来的面板，提供给用户选择
     * 需要知道:控件ID+修改的那个属性+属性的值
     */
    generateRightPanelSettings(ComponentSupportedProps) {
      const keys = Object.keys(ComponentSupportedProps);
      const menuItems = [];
      // 所有的面板key
      for (let t = 0, len = keys.length; t < len; t++) {
        const attrEl = ComponentSupportedProps[keys[t]];
        const { defaultValue, label, value, type, enums } = attrEl;
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
          // 非枚举类型需要弹窗展示，而且不能单独弹窗必须是全局弹窗
          menuItems.push(
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
      this.position.deltaX = e.clientX - this.position.clientX;
      this.position.deltaY = e.clientY - this.position.clientY;
      this.position.clientX = e.clientX;
      this.position.clientY = e.clientY;
      const { x, y } = this.state;
      // 获取到当前元素的x,y坐标
      const newX = x + this.position.deltaX;
      const newY = y + this.position.deltaY;
      this.setState({
        ...this.state,
        x: newX,
        y: newY
      });
    }

    /**
     * 
     * @param {*} e 
     * 鼠标停止移动移除事件并将最新的数据保存到store中
     */
    mouseup(e) {
      $(document)
        .off("mousemove", this.mousemove)
        .off("mouseup", this.mouseup);
      const { x, y } = this.state;
      if (this.props.dragSizeChangeCallback) {
        const updatedProps = {
          key: this.props.elementKey,
          x: this.state.x,
          y: this.state.y
        };
        this.props.dragSizeChangeCallback(updatedProps);
      }
    }
    /**
     * 初始化事件，如果input设置了disabled以后这个事件也会失效
     */
    initEvent() {
      setTimeout(() => {
        const wrappedElClss = ".wrapped__component--" + this.props.elementKey;
        const wrappedElRndEl = $(wrappedElClss)[0];
        // 在原有的可移动元素上绑定mousedown事件
        $(`${wrappedElClss}`).mousedown(e => {
          this.position.clientX = e.clientX;
          this.position.clientY = e.clientY;
          $(document)
            .on("mousemove", this.mousemove)
            .on("mouseup", this.mouseup);
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
      const { style, x = 10, y = 10 } = this.props;
      const { height = 50, width = 100 } = style || {};
      const { type: ComponentType } = this.props;
      // 设置右键面板
      const ComponentSupportedProps =
        (componentsDefs[ComponentType] &&
          componentsDefs[ComponentType].props) ||
        {};
      const WrapperProps = getProps(ComponentSupportedProps);
      // WrapperProps为默认属性,this.props为真实的数据
      this.setState({
        height,
        combinedProps: { ...WrapperProps, ...this.props },
        width,
        x,
        y
      });
      this.initEvent();
    }

    /**
     * 设置属性后不能立即生效,因为要接口发送到服务端才行:https://vkbansal.github.io/react-contextmenu/#/submenus
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
      // 包裹组件的值
      console.log("设置到内层组件的值为====", WrapperProps, this.props);
      const rightClickPanels = this.generateRightPanelSettings(
        ComponentSupportedProps
      );
      console.log("render中组合后的props为===", this.props);
      // 右键显示的值
      return (
        <Rnd
          ref={cpt => {
            this.innerCmpt = cpt;
          }}
          className={wrappedElClss + "_rnd"}
          style={style}
          size={{ width: this.state.width, height: this.state.height }}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            const { width, height } = this.state;
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
              border: "1px solid pink",
              position: "absolute",
              left: "20px"
            }}
          >
            {rightClickPanels}
          </ContextMenu>
          <ContextMenuTrigger id={uniqueRightPanelKey}>
            <WrappedComponent
              className={wrappedElClss}
              {...this.props}
              style={{ width: this.state.width, height: this.state.height }}
              onMouseDown={() => {
                //内嵌组件被点击
                //  this.props &&
                //  this.props.onMouseDown &&
                //this.props.onMouseDown(this.props.elementKey);
              }}
              //点击这个组件的时候需要弹出弹窗修改属性
              ref={cmpt => {
                this.wrappedComponent = cmpt;
              }}
            />
          </ContextMenuTrigger>
        </Rnd>
      );
    }
  };
}
