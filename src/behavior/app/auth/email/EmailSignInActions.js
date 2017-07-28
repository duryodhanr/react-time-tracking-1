import { getFetcher } from '../../api/ApiConfig';
import { extractApiErrors } from '../../api/ApiErrors';

export const EMAIL_SIGN_IN_START = 'EMAIL_SIGN_IN_START';
export const EMAIL_SIGN_IN_SUCCESS = 'EMAIL_SIGN_IN_SUCCESS';
export const EMAIL_SIGN_IN_ERROR = 'EMAIL_SIGN_IN_ERROR';

const emailSignInStart = () => ({ type: EMAIL_SIGN_IN_START });
const emailSignInSuccess = payload => ({ type: EMAIL_SIGN_IN_SUCCESS, payload });
const emailSignInError = payload => ({ type: EMAIL_SIGN_IN_ERROR, payload });

export const emailSignIn = (email, password) => (
  (dispatch) => {
    // console.log('EmailSignInActions::emailSignIn()');

    dispatch(emailSignInStart());

    const errorHandler = (error) => {
      // console.log('EmailSignInActions::emailSignIn().errorHandler() - error: ', error);

      const errors = extractApiErrors(error);
      dispatch(emailSignInError(errors));
      return new Promise((resolve, reject) => reject(errors));
    };

    const successHandler = (json) => {
      // console.log('EmailSignInActions::emailSignIn().successHandler() - json: ', json);

      dispatch(emailSignInSuccess(json.data));
      return json.data;
    };

    const opts = {
      body: JSON.stringify({
        email,
        password,
      }),
      method: 'POST',
    };

    const payload = {
      opts,
      path: 'auth/sign_in',
      isSigningIn: true,
    };

    return getFetcher().fetch(payload).then(successHandler).catch(errorHandler);
  }
);
