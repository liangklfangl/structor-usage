/**
 * modalReducer/ModalReducer selectors
 */

import { createSelector } from "reselect";

/**
 * Direct selector to the modalReducer.modalReducer state domain
 */
const selectModalreducer = () => state => state.modalReducer.modalReducer;
/**
 * Other specific selectors
 */
const selectName = () =>
  createSelector(
    selectModalreducer(),
    modalReducerState => modalReducerState.name
  );

export default selectModalreducer;

export { selectName };
