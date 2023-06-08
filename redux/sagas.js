import {put, takeLatest, all} from 'redux-saga/effects';
import axios from 'axios';

function* fetchPhotos(action) {
  try {
    const response = yield axios.get(
      //   `https://jsonplaceholder.typicode.com/photos?_page=${action.page}&_limit=10`
      'https://jsonplaceholder.typicode.com/photos?_limit=10&_page=1' +
        action.page,
    );
    yield put({type: 'FETCH_PHOTOS_SUCCESS', payload: response.data});
  } catch (error) {
    yield put({type: 'FETCH_PHOTOS_FAILURE'});
  }
}

function* watchFetchPhotos() {
  yield takeLatest('FETCH_PHOTOS_REQUEST', fetchPhotos);
}

export default function* rootSaga() {
  yield all([watchFetchPhotos()]);
}
