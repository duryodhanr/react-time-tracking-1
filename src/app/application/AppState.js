import api from './shared/net/http/ApiState';
import auth from './auth/AuthState';
import database from './DatabaseState';
import projects from './projects/ProjectState';
import stopwatches from './stopwatches/StopwatchState';
import timeLogs from './time-logs/TimeLogState';

export const observeStore = (store, select, onChange) => {
  let currentState;

  function handleChange() {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

export const reducers = {
  api,
  auth,
  database,
  projects,
  stopwatches,
  timeLogs,
};
