### 1.预览模式不允许组件编辑
### 2.高阶组件支持右键设置属性;
    1.这个最能够做到随时更新，因为依赖的antd本身就会是随时添加属性或者方法的。可以在高阶组件里面处理~~
    2.允许快速创建一个ReactNode进而让用户插入


### 3.支持左右键调整元素位置,最好能够全局让用户设置它
### 4.支持参考线 https://github.com/think2011/ref-line/blob/master/src/ref-line.js
### 5.所有的css都在html中引入，后面用less-loader处理

### 6.createElement传入的props不对导致disable不更新

### 7.type不能随意修改，我们组件依赖与他，所以text/textarea差别很大

### 8.redux-saga
```js
/**
 * 
 * @param {*} isShow
 * 行为+数据组件 
 */
export const showActionDispatch = (isShow, addOn) => (dispatch, getState) => {
  dispatch({
    type: SHOW_ACTION_DISPATCH_MODEL,
    payload: isShow,
    addOn: addOn
  });
  dispatch(showPageFieldsDispatch(isShow, addOn));
};
/**
 * 设置选项异步被saga捕获
 */
export const showPageFieldsDispatch = (isShow, addOn) => (
  dispatch,
  getState
) => {
  const model = graphApi.getModel();
  dispatch({
    type: GET_ACTION_DISPATCH_MODEL_DATA,
    payload: {
      isShow,
      addOn,
      data: model
    }
  });
};
```
一开始我是在点击按钮的时候直接发出showActionDispatch这个action去修改state,然后在componentDidMount中dispatch第二个action，但是遇到的问题是第二个action无法获取到第一个action保存的值。即使我第二个action被redux-saga拦截了一次。
```js
/**
 * 得到服务端的Model
 */
function* getServerModel() {
  yield take(actions.GET_ACTION_DISPATCH_MODEL_DATA);
  const model = graphApi.getModel();
  console.log("得到数据为职位诶===", model);
  yield put({
    type: actions.GET_ACTION_DISPATCH_MODEL_DATA,
    payload: {
      data: model
    }
  });
}
// main saga
// 所有DeskPage的接口都会被拦截
export default function* mainSaga() {
  yield [fork(getServerModel)];
}

```