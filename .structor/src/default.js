import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// react-redux的Provider
import { Router, browserHistory } from "react-router";
import PageForDesk from "./PageForDesk.js";
import { getRealPathName } from "./commons/constants.js";
import configureStore from "../app/store.js";
// store注册是.structor/app/store.js
/**
 * 页面包装器
 */
class PageContainer extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
let store;
let routeConfig = [];
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
 * 创建桌面工作区的函数并监听路由配置
 */
window.__createPageDesk = function() {
  store = configureStore();
  window.__switchToPath = function(pagePath) {
    browserHistory.push(getRealPathName(pagePath));
  };
  let childRoutes = [];
  if (window.__pages && window.__pages.length > 0) {
    childRoutes = window.__pages.map((page, idex) => {
      return { path: page.pagePath, component: PageForDesk };
    });
    // 子级路由有一个*的路由
    childRoutes.push({ path: "*", component: PageForDesk });
  } else {
    console.warn("Please check project model, pages were not found.");
  }

  routeConfig = [
    {
      path: "/",
      component: PageContainer,
      //   默认的container
      indexRoute: { component: PageForDesk },
      //   默认的子级路由为PageForDesk
      childRoutes: childRoutes
      //   子级路由数组
    }
  ];
  render();
  window.pageReadyState = "initialized";
};

if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  //   监听PageForDesk.js变化并重新render
  module.hot.accept(["./PageForDesk.js"], () => {
    render();
  });
}

window.pageReadyState = "ready";
