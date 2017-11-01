import isDate from 'date-fns/is_date';
import {
  changeElapsedHours,
  changeElapsedMinutes,
  getElapsedTimeInSeconds,
} from './StopwatchUtils';

//---------------------------
// BEGIN BASIC CRUD CONSTANTS
//---------------------------

/* users cannot create or delete stopwatches */

export const READ_ENTITY_REQUESTED = 'app/stopwatch/read/requested';
export const READ_ENTITY_STARTED = 'app/stopwatch/read/started';
export const READ_ENTITY_SUCCEEDED = 'app/stopwatch/read/succeeded';
export const READ_ENTITY_FAILED = 'app/stopwatch/read/failed';

export const UPDATE_ENTITY_FAILED = 'app/stopwatch/update/failed';

//-------------------------
// END BASIC CRUD CONSTANTS
//-------------------------

//----------------------------------
// BEGIN UPDATE ATTRIBUTES CONSTANTS
//----------------------------------

export const PAUSE_STOPWATCH_REQUESTED = 'app/stopwatch/pause/requested';
export const RESET_STOPWATCH_REQUESTED = 'app/stopwatch/reset/requested';
export const START_STOPWATCH_REQUESTED = 'app/stopwatch/start/requested';
export const UPDATE_DATE_REQUESTED = 'app/stopwatch/set/date/requested';
export const UPDATE_DESCRIPTION_REQUESTED = 'app/stopwatch/set/description/requested';
export const UPDATE_HOURS_REQUESTED = 'app/stopwatch/set/hours/requested';
export const UPDATE_MINUTES_REQUESTED = 'app/stopwatch/set/minutes/requested';
export const UPDATE_PROJECT_REQUESTED = 'app/stopwatch/set/project/requested';

//--------------------------------
// END UPDATE ATTRIBUTES CONSTANTS
//--------------------------------

export const UPDATE_DATABASE = 'app/stopwatch/update/database';
export const updateDatabase = payload => ({ type: UPDATE_DATABASE, payload });

//-------------------------
// BEGIN BASIC CRUD ACTIONS
//-------------------------

/* users cannot create or delete stopwatches */

export const readEntity = killCache => ({
  type: READ_ENTITY_REQUESTED,
  meta: {
    http: {
      killCache,
      request: {
        method: 'GET',
        url: 'stopwatches/',
      },
    },
  },
});

export const readEntityStarted = () => ({ type: READ_ENTITY_STARTED });
export const readEntitySucceeded = payload => ({ type: READ_ENTITY_SUCCEEDED, payload });
export const readEntityFailed = payload => ({ type: READ_ENTITY_FAILED, payload });

const generateUpdateRequest = (id, payload = {}) => {
  if (!id) throw new Error('Argument <id> must not be null.');

  return {
    entity: {
      type: 'stopwatches',
    },
    request: {
      data: { ...payload, id },
      method: 'PATCH',
      params: {
        include: 'author,project',
      },
      url: `stopwatches/${id}`,
    },
  };
};

export const updateEntityFailed = payload => ({ type: UPDATE_ENTITY_FAILED, payload });

//-----------------------
// END BASIC CRUD ACTIONS
//-----------------------

//--------------------------------
// BEGIN UPDATE ATTRIBUTES ACTIONS
//--------------------------------

export const pauseStopwatch = ({ id, startedAt, activityTotalTime = 0 }) => {
  if (!id) throw new Error('Argument <id> must not be null.');
  if (!startedAt) throw new Error('Argument <startedAt> must not be null.');
  if (isNaN(activityTotalTime)) throw new Error('Argument <activityTotalTime> must be an integer.');

  return {
    type: PAUSE_STOPWATCH_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, {
        activityTotalTime: getElapsedTimeInSeconds(startedAt, new Date(), activityTotalTime),
        startedAt: null,
      }),
    },
  };
};

export const resetStopwatch = (id) => {
  if (!id) throw new Error('Argument <id> must not be null.');

  return {
    type: RESET_STOPWATCH_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, {
        activityDate: null,
        activityTotalTime: null,
        description: null,
        startedAt: null,
      }),
    },
  };
};

export const startStopwatch = (id) => {
  if (!id) throw new Error('Argument <id> must not be null.');

  return {
    type: START_STOPWATCH_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, { startedAt: new Date() }),
    },
  };
};

export const updateDate = ({ id, date }) => {
  if (!id) throw new Error('Argument <id> must not be null.');
  if (!date) throw new Error('Argument <date> must not be null.');
  if (!isDate(date)) {
    throw new Error('Argument <date> must be a Date object.');
  }

  return {
    type: UPDATE_DATE_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, { activityDate: date }),
    },
  };
};

export const updateDescription = ({ id, description }) => {
  if (!id) throw new Error('Argument <id> must not be null.');

  return {
    type: UPDATE_DESCRIPTION_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, { description }),
    },
  };
};

export const updateHours = ({ id, activityTotalTime = 0, hours = 0, startedAt }) => {
  if (!id) throw new Error('Argument <id> must not be null.');
  if (isNaN(activityTotalTime)) throw new Error('Argument <activityTotalTime> must be an integer.');

  if (isNaN(hours)) {
    throw new Error('Argument <hours> must be an integer.');
  }

  return {
    type: UPDATE_HOURS_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, {
        activityTotalTime: changeElapsedHours(startedAt, hours, activityTotalTime),
      }),
    },
  };
};

export const updateMinutes = ({ id, activityTotalTime = 0, minutes = 0, startedAt }) => {
  if (!id) throw new Error('Argument <id> must not be null.');
  if (isNaN(activityTotalTime)) throw new Error('Argument <activityTotalTime> must be an integer.');

  if (isNaN(minutes)) {
    throw new Error('Argument <minutes> must be an integer.');
  }

  return {
    type: UPDATE_MINUTES_REQUESTED,
    meta: {
      http: generateUpdateRequest(id, {
        activityTotalTime: changeElapsedMinutes(startedAt, minutes, activityTotalTime),
      }),
    },
  };
};

export const updateProject = ({ id, projectId }) => {
  if (!id) throw new Error('Argument <id> must not be null.');
  if (!projectId) throw new Error('Argument <projectId> must not be null.');

  return {
    type: UPDATE_PROJECT_REQUESTED,
    meta: {
      http: {
        ...generateUpdateRequest(id),
        ...{
          entity: {
            type: 'stopwatches',
            relationships: [
              { attrName: 'project', type: 'projects', id: projectId },
            ],
          },
        },
      },
    },
  };
};

//------------------------------
// END UPDATE ATTRIBUTES ACTIONS
//------------------------------
