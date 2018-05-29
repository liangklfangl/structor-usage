import Rnd from "react-rnd";
import React from "react";
import ReactDOM from "react-dom";
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};
/**
 * 这里要写一个高阶组件来处理react-rnd包裹
 */
export default function HOC(FuckWrappedComponent) {
  return class RndFuckWrappedComponent extends React.Component {
    // 默认宽度
    state = {
      width: 0,
      height: 0,
      x: 10,
      y: 10
    };
    componentDidMount() {
      // 问题1:为什么要在setTimeout里面访问clientWidth/clientHeight
      setTimeout(() => {
        const clientHeight = ReactDOM.findDOMNode(this.wrappedComponent)
          .clientHeight;
        const clientWidth = ReactDOM.findDOMNode(this.wrappedComponent)
          .clientWidth;
        this.setState({
          height: clientHeight,
          width: clientWidth
        });
      }, 0);
    }

    // 子元素能够draggable，但是如果设置为子元素的高度呢
    render() {
      console.log("高阶组件接受到的值为===", this);
      return (
        <Rnd
          ref={cpt => {
            this.innerCmpt = cpt;
          }}
          style={style}
          size={{ width: this.state.width, height: this.state.height }}
          maxWidth={this.state.maxWidth}
          position={{ x: this.state.x, y: this.state.y }}
          onDragStop={(e, d) => {
            this.setState({ x: d.x, y: d.y });
          }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              ...position
            });
          }}
        >
          <FuckWrappedComponent
            {...this.props}
            ref={cmpt => {
              this.wrappedComponent = cmpt;
            }}
          />
        </Rnd>
      );
    }
  };
}
