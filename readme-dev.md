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

### 问题3：修改react-context文件将它的left值设置为0，position为absolute而不是fixed
```js
 _this2.menu.style.left = left + "px";
```
modules/ContextMenu.js

### 问题4:combinedProps一直在是因为structor -v没有重启，所以内存中一直有一份数据，删除model.json数据并重启即可

### 问题5:开发提示
(1)如果一份老数据不能拖动的情况下，可以考虑吧老数据删除掉，重新拖动元素。这就是遇到不能resize的情况下的解决方案


### 问题6:弹窗不显示是因为没有visible

### 问题7:同时调用两次去修改model.json导致不生效，所有采用了changeOptions,而不是changeOption后续优化

### 参考文献
[Three Rules For Structuring (Redux) Applications](https://jaysoo.ca/2016/02/28/organizing-redux-application/)