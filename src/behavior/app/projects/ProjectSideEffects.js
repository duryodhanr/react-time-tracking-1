import { put, select, takeLatest } from 'redux-saga/effects';
import {
  CREATE_ENTITY_REQUESTED,
  READ_ENTITY_REQUESTED,
  READ_COLLECTION_REQUESTED,
  UPDATE_ENTITY_REQUESTED,
  DELETE_ENTITY_REQUESTED,
} from './types';
import { getCollection, hasEntity } from './ProjectState';
import {
  createEntityFailed,
  createEntityStarted,
  createEntitySucceeded,
  readEntityFailed,
  readEntityStarted,
  readEntitySucceeded,
  readCollectionFailed,
  readCollectionStarted,
  readCollectionSucceeded,
  updateEntityFailed,
  updateEntityStarted,
  updateEntitySucceeded,
  deleteEntityFailed,
  deleteEntityStarted,
  deleteEntitySucceeded,
  clearDatabase,
  updateDatabase,
} from './ProjectActions';


function* createEntitySaga({ meta }) {
  try {
    yield put(createEntityStarted());

    const { makeRequest, resource, successCb } = meta.http;
    const data = yield makeRequest(resource);

    yield put(clearDatabase());
    yield put(updateDatabase(data));
    yield put(createEntitySucceeded());
    if (successCb) successCb();
  } catch (error) {
    yield put(createEntityFailed(error));
  }
}

function* readEntitySaga({ meta }) {
  const { makeRequest, killCache, resource } = meta.http;
  const { query } = resource;

  if (!killCache && query && query.unit && query.unit.id) {
    const entityExists = yield select(hasEntity, query);
    if (entityExists) return;
  }

  try {
    yield put(readEntityStarted());

    const data = yield makeRequest(resource);

    yield put(updateDatabase(data));
    yield put(readEntitySucceeded());
  } catch (error) {
    yield put(readEntityFailed(error));
  }
}

function* readCollectionSaga({ meta }) {
  const { makeRequest, killCache, resource } = meta.http;
  const { query } = resource;

  if (!killCache) {
    const cachedResult = yield select(getCollection, query);
    if (cachedResult) return;
  }

  try {
    yield put(readCollectionStarted());

    const response = yield makeRequest(resource);

    yield put(updateDatabase(response));
    yield put(readCollectionSucceeded({ response, query }));
  } catch (error) {
    yield put(readCollectionFailed(error));
  }
}

function* updateEntitySaga({ meta }) {
  try {
    yield put(updateEntityStarted());

    const { makeRequest, resource, successCb } = meta.http;
    const data = yield makeRequest(resource);

    yield put(updateDatabase(data));
    yield put(updateEntitySucceeded());
    if (successCb) successCb();
  } catch (error) {
    yield put(updateEntityFailed(error));
  }
}

function* deleteEntitySaga({ meta }) {
  try {
    const { makeRequest, resource, successCb } = meta.http;

    yield put(deleteEntityStarted());
    yield makeRequest(resource);
    yield put(clearDatabase());
    yield put(deleteEntitySucceeded());
    if (successCb) successCb();
  } catch (error) {
    yield put(deleteEntityFailed(error));
  }
}

export default function* () {
  yield takeLatest(CREATE_ENTITY_REQUESTED, createEntitySaga);
  yield takeLatest(READ_ENTITY_REQUESTED, readEntitySaga);
  yield takeLatest(READ_COLLECTION_REQUESTED, readCollectionSaga);
  yield takeLatest(UPDATE_ENTITY_REQUESTED, updateEntitySaga);
  yield takeLatest(DELETE_ENTITY_REQUESTED, deleteEntitySaga);
}
