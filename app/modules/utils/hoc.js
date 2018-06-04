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
    // 默认宽度
    state = {
      width: 50,
      height: 100,
      x: 10,
      y: 10,
      combinedProps: {}
    };

    /**
     * 如果枚举类型选中一个值表示需要设置它
     * elementKey:组件的key
     * key:设置的props的名字
     * label:设置props的label
     */
    settingRightPanelSelectedValue(elementKey, key, label) {
      this.props.bindPropSelectChange &&
        this.props.bindPropSelectChange(elementKey, key, label);
    }
    /**
     * 右键弹出面板被点击
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
      console.log("菜单点击设置得值为=======", combinedProps);
      // 合成props
      this.setState({
        combinedProps
      });
      this.props &&
        this.props.dragSizeChangeCallback &&
        this.props.dragSizeChangeCallback(updatedProps);
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
     * 初始化事件
     */
    initEvent() {
      const wrappedElClss = ".wrapped__component--" + this.props.elementKey;
      setTimeout(() => {
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
      const ComponentSupportedProps = componentsDefs[ComponentType].props || {};
      const WrapperProps = getProps(ComponentSupportedProps);
      // 设置属性了
      this.setState({
        height,
        combinedProps: { ...WrapperProps, ...this.props.combinedProps },
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
      const ComponentSupportedProps = componentsDefs[ComponentType].props || {};
      const WrapperProps = getProps(ComponentSupportedProps);
      // 包裹组件的值
      console.log("设置到内层组件的值为====", WrapperProps, this.props);
      const rightClickPanels = this.generateRightPanelSettings(
        ComponentSupportedProps
      );
      console.log("render中组合后的props为===", this.state.combinedProps);
      // 右键显示的值
      return (
        <Rnd
          ref={cpt => {
            this.innerCmpt = cpt;
          }}
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
              {...this.state.combinedProps}
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
