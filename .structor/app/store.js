/**
 * Create the store
 */
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
// https://github.com/redux-saga/redux-saga
import reducers from "./reducers";
import sagas from "./sagas";
// 全局注册saga和reducer

const sagaMiddleware = createSagaMiddleware();
const devtools = window.devToolsExtension || (() => noop => noop);
// combineReducers合成多个reducer返回
const createReducers = asyncReducers => {
  return combineReducers({
    ...asyncReducers
  });
};

/**
 * 
 * @param {*} initialState 
 * 配置store
 */
export default function configureStore(initialState = {}) {
  const middlewares = [sagaMiddleware];
  const enhancers = [applyMiddleware(...middlewares), devtools()];
  const store = createStore(
    createReducers(reducers),
    // 合并多个reducer，在reducer.js中只要简单导出即可
    initialState,
    // 初始state
    compose(...enhancers)
    // 合成saga.js
  );
  // Make reducers hot reloadable, see http://mxs.is/googmo
  if (module.hot) {
    System.import("./reducers").then(reducerModule => {
      const nextReducers = createReducers(reducerModule.default);
      store.replaceReducer(nextReducers);
    });
  }

  sagas.map(sagaMiddleware.run);

  return store;
}
