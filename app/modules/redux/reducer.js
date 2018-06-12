import { combineReducers } from 'redux';
import modalReducerReducer from './containers/drag/reducer.js';
                
export default combineReducers({
    modalReducer: modalReducerReducer
});
