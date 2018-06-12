
// 1.modalReducer不再是用户输入,而是根据页面的pageName,即路由地址来判断
// 2.高阶组件connect我们store的值,输入值变化的时候修改store的值。每一个页面维护一个store,只会从store中的值
// 我们一部分通过修改props(structor内部机制);一部分通过store的dispatch修改
import modalReducerReducer from 'modules/redux/reducer.js';
export default { modalReducer: modalReducerReducer };