import { createSelector } from "reselect";

const selectModalreducer = () => state => state.modalReducer.modalReducer;
/**
 * 
 */
const selectName = () =>
  createSelector(
    selectModalreducer(),
    modalReducerState => modalReducerState.name
  );
export default selectModalreducer;

export { selectName };
