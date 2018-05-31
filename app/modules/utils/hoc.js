import Rnd from "react-rnd";
import React from "react";
import ReactDOM from "react-dom";
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
const LEFT = 37;
const RIGHT = 39;
const DOWN = 40;
const UP = 38;
const STEP = 10;
export default function HOC(WrappedComponent) {
  return class RndWrappedComponent extends React.Component {
    // 默认宽度
    state = {
      width: 50,
      height: 100,
      x: 10,
      y: 10
    };

    /**
     * 初始化事件
     */
    initEvent() {
      const wrappedElClss = ".wrapped__component--" + this.props.elementKey;
      setTimeout(() => {
        $(`${wrappedElClss}`).on("keydown", e => {
          const { keyCode } = e;
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
        });
      }, 0);
    }

    componentDidMount() {
      const { style, x = 10, y = 10 } = this.props;
      const { height = 50, width = 100 } = style || {};
      this.setState({
        height,
        width,
        x,
        y
      });
      this.initEvent();
    }

    render() {
      const wrappedElClss = "wrapped__component--" + this.props.elementKey;
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
            this.props && this.props.dragSizeChangeCallback(changedProps);
          }}
        >
          <WrappedComponent
            className={wrappedElClss}
            {...this.props}
            style={{ width: this.state.width, height: this.state.height }}
            onMouseDown={() => {
              //内嵌组件被点击
              //this.props &&
              //this.props.onMouseDown &&
              //this.props.onMouseDown(this.props.elementKey);
            }}
            //点击这个组件的时候需要弹出弹窗修改属性
            ref={cmpt => {
              this.wrappedComponent = cmpt;
            }}
          />
        </Rnd>
      );
    }
  };
}
