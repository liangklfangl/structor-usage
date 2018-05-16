// import TestGroupSagas from 'modules/TestGroup/sagas.js';
// export default [...TestGroupSagas];
import { call, put, select, takeLatest } from "redux-saga/effects";
export function* initialSaga(action) {}

export function* taskListSaga() {
  yield takeLatest("Initial", initialSaga);
}

export default [...taskListSaga];
