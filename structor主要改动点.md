### 1.
```js
this.contentWindow.__pages = pages;
```
这句代码改成iframe的onload之前就设置，未等到之后。这样客户端可以根据页面来设置store的配置，即动态生成reducer


### 2.reducer热加载
```js
 // Make reducers hot reloadable, see http://mxs.is/googmo
  if (module.hot) {
    System.import("./reducers").then(reducerModule => {
      // const nextReducers = createReducers(reducerModule.default);
      store.replaceReducer(reducers);
    });
  }
  //saga运行
```