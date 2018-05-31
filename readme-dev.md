### 问题1:为什么要在setTimeout里面访问clientWidth/clientHeight
```js
setTimeout(() => {
    const clientHeight = ReactDOM.findDOMNode(this.wrappedComponent)
        .clientHeight;
    const clientWidth = ReactDOM.findDOMNode(this.wrappedComponent)
        .clientWidth;
    this.setState({
        height: clientHeight,
        width: clientWidth,
    });
    }, 0);

     /**
     * 初始化事件
     */
    initEvent() {
      const wrappedElClss = ".wrapped__component--" + this.props.elementKey;
      setTimeout(() => {
        $(`${wrappedElClss}`).on("click", () => {
          alert("fuck click input");
        });
      }, 0);
    }

```

### 问题2:拖拽后不能立即修改model.json导致多余的渲染回到原来的值
```js
    componentWillReceiveProps(nextProps) {
      const { style = {} } = nextProps || {};
      console.log("组件resize接受到的属性为componentWillReceiveProps====", nextProps);
      const { width = 50, height = 100, x = 10, y = 10 } = style;
      this.setState({
        width: getUnitPix(width),
        height: getUnitPix(height),
        x,
        y
      });
    }
```