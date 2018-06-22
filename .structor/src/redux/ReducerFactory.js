/**
 * 
 * @param {*} prefix 
 * @param {*} actionMutationMap 
 * Reducer的工厂函数
 */
export default function ReducerFactory(prefix, actionMutationMap = {}) {
    return (state = {}, action) => {
    
      return actionMutationMap[action.type]
        ? actionMutationMap[action.type](state, action.payload)
        : action.type.indexOf(`${prefix}.`) === 0
          ? { ...state, ...action.payload }
          : state;
    };
  }
  