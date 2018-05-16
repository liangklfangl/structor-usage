// import TestGroupReducer from 'modules/TestGroup/reducer.js';
// export default { TestGroup: TestGroupReducer };

const initialState = {};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case "Initial": {
      return state.set("isClientCache", action.isClientCache);
    }
    default:
      return state;
  }
}
//(4)必须请求回来才能显示弹窗，否则会存在问题，必须通过每次产生一个新的key来完成以前通过initialValue能完成的功能

export default {
  homeReducer:homeReducer
};
