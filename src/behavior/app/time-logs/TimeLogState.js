import merge from 'lodash/merge';
import isString from 'lodash/isString';
import { combineReducers } from 'redux';
import build from 'redux-object';
import {
  CREATE_ENTITY_STARTED,
  CREATE_ENTITY_SUCCEEDED,
  CREATE_ENTITY_FAILED,
  READ_ENTITIES_STARTED,
  READ_ENTITIES_SUCCEEDED,
  READ_ENTITIES_FAILED,
  READ_ENTITY_STARTED,
  READ_ENTITY_SUCCEEDED,
  READ_ENTITY_FAILED,
  UPDATE_ENTITY_STARTED,
  UPDATE_ENTITY_SUCCEEDED,
  UPDATE_ENTITY_FAILED,
  DELETE_ENTITY_STARTED,
  DELETE_ENTITY_SUCCEEDED,
  DELETE_ENTITY_FAILED,
  CLEAR_DATABASE,
  UPDATE_DATABASE,
} from './TimeLogActions';

const QUERY_ALL = 'app/time-logs/query/entity/all';

export const entities = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_DATABASE:
      return merge({ ...state }, action.payload);

    case CLEAR_DATABASE:
      return {};

    default:
      return state;
  }
};

const cachedQueries = (state = {}, { payload, type }) => {
  switch (type) {
    case READ_ENTITIES_SUCCEEDED: {
      let query = payload.query || QUERY_ALL;
      query = isString(query) ? query : JSON.stringify(query);

      return {
        ...state,
        [query]: {
          ids: payload.data.data.map(entity => entity.id),
          links: payload.data.links,
        },
      };
    }

    case CLEAR_DATABASE:
      return {};

    default:
      return state;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case CREATE_ENTITY_FAILED:
    case DELETE_ENTITY_FAILED:
    case READ_ENTITIES_FAILED:
    case READ_ENTITY_FAILED:
    case UPDATE_ENTITY_FAILED:
      return action.payload || null;

    case CREATE_ENTITY_STARTED:
    case CREATE_ENTITY_SUCCEEDED:
    case DELETE_ENTITY_STARTED:
    case DELETE_ENTITY_SUCCEEDED:
    case READ_ENTITIES_STARTED:
    case READ_ENTITIES_SUCCEEDED:
    case READ_ENTITY_STARTED:
    case READ_ENTITY_SUCCEEDED:
    case UPDATE_ENTITY_STARTED:
    case UPDATE_ENTITY_SUCCEEDED:
      return null;

    default:
      return state;
  }
};

const isConnecting = (state = false, action) => {
  switch (action.type) {
    case CREATE_ENTITY_SUCCEEDED:
    case CREATE_ENTITY_FAILED:
    case DELETE_ENTITY_SUCCEEDED:
    case DELETE_ENTITY_FAILED:
    case READ_ENTITIES_SUCCEEDED:
    case READ_ENTITIES_FAILED:
    case READ_ENTITY_SUCCEEDED:
    case READ_ENTITY_FAILED:
    case UPDATE_ENTITY_SUCCEEDED:
    case UPDATE_ENTITY_FAILED:
      return false;

    case CREATE_ENTITY_STARTED:
    case DELETE_ENTITY_STARTED:
    case READ_ENTITIES_STARTED:
    case READ_ENTITY_STARTED:
    case UPDATE_ENTITY_STARTED:
      return true;

    default:
      return state;
  }
};

export const getEntity = (state, id) => {
  if (!id) return undefined;

  const entity = build(state.database, 'timeLogs', id, { eager: true, ignoreLinks: true });
  if (entity === null) return undefined;

  if (entity.logDate) entity.logDate = new Date(entity.logDate);
  return entity;
};

export const getEntities = (state, _query = QUERY_ALL) => {
  if (!state.timeLogs) return undefined;

  const query = isString(_query) ? _query : JSON.stringify(_query);
  const cachedQuery = state.timeLogs.cachedQueries[query];

  if (!cachedQuery) return undefined;

  return {
    entities: cachedQuery.ids.map(id => getEntity(state, id)),
    pagination: cachedQuery.links,
  };
};

export default combineReducers({
  error,
  cachedQueries,
  isConnecting,
});
