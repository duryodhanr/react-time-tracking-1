import { call, put, select, takeLatest } from 'redux-saga/effects';
import normalize from 'json-api-normalizer';
import { getProjectById, denormalizeItem } from './ProjectReducers';
import { getFetcher } from '../api/ApiConfig';
import { extractApiErrors } from '../api/ApiErrors';

export const ADD_PROJECT_START = 'ADD_PROJECT_START';
export const ADD_PROJECT_SUCCESS = 'ADD_PROJECT_SUCCESS';
export const ADD_PROJECT_ERROR = 'ADD_PROJECT_ERROR';

export const GET_PROJECT_REQUESTED = 'GET_PROJECT_REQUESTED';
export const GET_PROJECT_START = 'GET_PROJECT_START';
export const GET_PROJECT_SUCCESS = 'GET_PROJECT_SUCCESS';
export const GET_PROJECT_ERROR = 'GET_PROJECT_ERROR';
export const SELECT_PROJECT = 'SELECT_PROJECT';
export const SELECT_PROJECT_SUCCESS = 'SELECT_PROJECT_SUCCESS';

export const GET_PROJECTS_START = 'GET_PROJECTS_START';
export const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';
export const GET_PROJECTS_ERROR = 'GET_PROJECTS_ERROR';

export const UPDATE_PROJECT_START = 'UPDATE_PROJECT_START';
export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export const UPDATE_PROJECT_ERROR = 'UPDATE_PROJECT_ERROR';

const addProjectStart = () => ({ type: ADD_PROJECT_START });
const addProjectSuccess = payload => ({ type: ADD_PROJECT_SUCCESS, payload });
const addProjectError = payload => ({ type: ADD_PROJECT_ERROR, payload });

export const getProject = id => ({ type: GET_PROJECT_REQUESTED, payload: { id } });
const getProjectStart = () => ({ type: GET_PROJECT_START });
const getProjectSuccess = payload => ({ type: GET_PROJECT_SUCCESS, payload });
const getProjectError = payload => ({ type: GET_PROJECT_ERROR, payload });
export const selectProject = id => ({ type: SELECT_PROJECT, payload: { id } });
const selectProjectSuccess = payload => ({ type: SELECT_PROJECT_SUCCESS, payload });

const getProjectsStart = () => ({ type: GET_PROJECTS_START });
const getProjectsSuccess = payload => ({ type: GET_PROJECTS_SUCCESS, payload });
const getProjectsError = payload => ({ type: GET_PROJECTS_ERROR, payload });

const updateProjectStart = () => ({ type: UPDATE_PROJECT_START });
const updateProjectSuccess = payload => ({ type: UPDATE_PROJECT_SUCCESS, payload });
const updateProjectError = payload => ({ type: UPDATE_PROJECT_ERROR, payload });

export const addProject = data => (
  (dispatch) => {
    // console.log('Projects.actions().addProject() - data: ', data);

    dispatch(addProjectStart());

    const errorHandler = (error) => {
      // console.log('Project.Actions::addProject().errorHandler() - error: ', error);
      const errors = extractApiErrors(error);
      dispatch(addProjectError(errors));
      return new Promise((resolve, reject) => reject(error));
    };

    const successHandler = (json) => {
      // console.log('Projects.Actions::addProject().successHandler() - json: ', json);

      const normalizedData = normalize(json).projects;
      const normalizedItem = Object.values(normalizedData)[0];

      dispatch(addProjectSuccess(normalizedItem));
      const denormalizedItem = denormalizeItem(normalizedItem);
      return denormalizedItem;
    };

    const opts = {
      body: JSON.stringify(data),
      method: 'POST',
    };

    const payload = {
      opts,
      path: 'projects',
    };

    return getFetcher().fetch(payload).then(successHandler).catch(errorHandler);
  }
);

export const getProjects = () => (
  (dispatch) => {
    // console.log('Projects.actions().getProjects()');

    dispatch(getProjectsStart());

    const errorHandler = (error) => {
      // console.log('Project.Actions::getProjects().errorHandler() - error: ', error);
      const errors = extractApiErrors(error);
      dispatch(getProjectsError(errors));
      return new Promise((resolve, reject) => reject(error));
    };

    const successHandler = (json) => {
      // console.log('Projects.Actions::getProjects().successHandler() - json: ', json);
      const normalizedData = normalize(json);
      dispatch(getProjectsSuccess(normalizedData.projects));
      return normalizedData;
    };

    const opts = {
      method: 'GET',
    };

    const payload = {
      opts,
      path: 'projects',
    };

    return getFetcher().fetch(payload).then(successHandler).catch(errorHandler);
  }
);

const getProjectPromise = (id) => {
  console.log('ProjectActions().getProjectPromise() - id: ', id);
  if (!id) throw new Error(`Argument <id> must not be null. Received: ${id}`);

  const opts = {
    method: 'GET',
  };

  const path = `projects/${id}`;

  const payload = {
    opts,
    path,
  };

  return getFetcher().fetch(payload);
};

function* selectProjectSaga(action) {
  const cachedProject = yield select(getProjectById, action.payload.id);
  if (cachedProject) {
    yield put(selectProjectSuccess(denormalizeItem(cachedProject)));
    return;
  }

  yield put(getProject(action.payload.id));
}

function* getProjectSaga(action) {
  let normalizedItem;

  try {
    yield put(getProjectStart());

    const data = yield call(getProjectPromise, action.payload.id);

    const normalizedData = normalize(data).projects;
    normalizedItem = Object.values(normalizedData)[0];

    yield put(getProjectSuccess(normalizedItem));

    const denormalizedItem = denormalizeItem(normalizedItem);
    yield put(selectProjectSuccess(denormalizedItem));
  } catch (error) {
    yield put(getProjectError(extractApiErrors(error)));
  }

  return denormalizeItem(normalizedItem);
}

export function* bindActionsToSagas() {
  yield takeLatest(GET_PROJECT_REQUESTED, getProjectSaga);
  yield takeLatest(SELECT_PROJECT, selectProjectSaga);
}

/*
export const getProject = id => (
  (dispatch) => {
    // console.log('Projects.actions().getProject() - id: ' + id);
    if (!id) throw new Error(`Argument <id> must not be null. Received: ${id}`);

    dispatch(getProjectStart());

    const errorHandler = (error) => {
      // console.log('Project.Actions::getProject().errorHandler() - error: ', error);
      const errors = extractApiErrors(error);
      dispatch(getProjectError(errors));
      return new Promise((resolve, reject) => reject(error));
    };

    const successHandler = (json) => {
      // console.log('Projects.Actions::getProject().successHandler() - json: ', json);
      const normalizedData = normalize(json).projects;
      const normalizedItem = Object.values(normalizedData)[0];

      dispatch(getProjectSuccess(normalizedItem));
      const denormalizedItem = denormalizeItem(normalizedItem);
      return denormalizedItem;
    };

    const opts = {
      method: 'GET',
    };

    const path = `projects/${id}`;

    const payload = {
      opts,
      path,
    };

    return getFetcher().fetch(payload).then(successHandler).catch(errorHandler);
  }
);
*/

export const updateProject = (id, data) => (
  (dispatch) => {
    // console.log('Projects.actions().updateProject() - data: ', data);

    dispatch(updateProjectStart());

    const errorHandler = (error) => {
      // console.log('Project.Actions::updateProject().errorHandler() - error: ', error);
      const errors = extractApiErrors(error);
      dispatch(updateProjectError(errors));
      return new Promise((resolve, reject) => reject(error));
    };

    const successHandler = (json) => {
      // console.log('Projects.Actions::updateProject().successHandler() - json: ', json);
      const normalizedData = normalize(json).projects;
      const normalizedItem = Object.values(normalizedData)[0];

      dispatch(updateProjectSuccess(normalizedItem));
      const denormalizedItem = denormalizeItem(normalizedItem);
      return denormalizedItem;
    };

    const opts = {
      body: JSON.stringify(data),
      method: 'PUT',
    };

    const path = `projects/${id}`;
    const payload = {
      opts,
      path,
    };

    return getFetcher().fetch(payload).then(successHandler).catch(errorHandler);
  }
);
