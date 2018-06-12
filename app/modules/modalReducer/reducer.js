import { combineReducers } from 'redux';
import modalReducerReducer from './containers/ModalReducer/reducer.js';
                
export default combineReducers({
    modalReducer: modalReducerReducer
});
