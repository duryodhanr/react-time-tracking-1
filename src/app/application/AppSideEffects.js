import { all } from 'redux-saga/effects';
// import { clearCache } from './shared/net/http/caching/Services';
import bindAuth from './auth/AuthSideEffects';
import bindEmailSignIn from './auth/email/EmailSignInSideEffects';
import bindEmailSignUp from './auth/email/EmailSignUpSideEffects';
import bindNet from './shared/net/SideEffects';
import bindRestoreSession from './auth/restore-session/RestoreSessionSideEffects';
import bindSignOut from './auth/sign-out/SignOutSideEffects';
import bindStopwatch from './stopwatches/StopwatchSideEffects';
import bindTimeLog from './time-logs/TimeLogSideEffects';
// import { CLEAR_DATABASE as CLEAR_PROJECTS_DATABASE } from './projects/types';
/*
function* clearEntitiesSaga(entityType) {
  yield put(clearCache(entityType));
}

function* bindApp() {
  yield takeLatest(CLEAR_PROJECTS_DATABASE, clearEntitiesSaga, 'projects');
}
*/
export default function* () {
  yield all([
    // bindApp(),
    bindAuth(),
    bindEmailSignIn(),
    bindEmailSignUp(),
    bindNet(),
    bindRestoreSession(),
    bindSignOut(),
    bindStopwatch(),
    bindTimeLog(),
  ]);
}
