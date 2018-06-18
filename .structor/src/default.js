import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import PageForDesk from "./PageForDesk.js";
import { getRealPathName } from "./commons/constants.js";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import sagas from "./redux/sagas";
import ReducerCreationFactory from "./redux/ReducerFactory";
// reducer的工厂函数
const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => noop => noop);
let store;
let routeConfig = [];

/**
 * 配置store
 */
function configureStore(initialState = {}, reducers = {}) {
  const middlewares = [sagaMiddleware];
  const enhancers = [applyMiddleware(...middlewares), devtools()];
  const store = createStore(
    combineReducers(reducers),
    initialState,
    compose(...enhancers)
  );
  sagas.map(sagaMiddleware.run);
  return store;
}
/**
 * 每次重新渲染的函数、
 */
const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routeConfig} />
    </Provider>,
    document.getElementById("content")
  );
};

/**
 * 根据window.__pages产生新的reducers列表
 */
const generateReducers = () => {
  return (window.__pages || []).reduce((prev, cur) => {
    const key = cur["pageName"];
    prev[key] = ReducerCreationFactory(key);
    return prev;
  }, {});
};
/**
 * 创建桌面工作区的函数并监听路由配置
 */
window.__createPageDesk = function() {
  let childRoutes = [];
  // 每一个路由都会加载PageForDesk为当前路由的实例组件
  if (window.__pages && window.__pages.length > 0) {
    childRoutes = window.__pages.map((page, idex) => {
      return { path: page.pagePath, component: PageForDesk };
    });
    childRoutes.push({ path: "*", component: PageForDesk });
  } else {
    console.warn("Please check project model, pages were not found.");
  }
  store = configureStore({}, generateReducers());
  // 创建自己的store
  window.__switchToPath = function(pagePath) {
    browserHistory.push(getRealPathName(pagePath));
  };

  routeConfig = [
    {
      path: "/",
      component: PageContainer,
      indexRoute: { component: PageForDesk },
      childRoutes: childRoutes
    }
  ];

  render();
  window.pageReadyState = "initialized";
};

/**
 * 页面包装器,必须加载
 */
class PageContainer extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
/**
 * 热加载
 */
if (module.hot) {
  module.hot.accept(["./PageForDesk.js"], () => {
    render();
  });
}
/**
 * 页面状态
 */
window.pageReadyState = "ready";
