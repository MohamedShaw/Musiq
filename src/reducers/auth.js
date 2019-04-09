import * as types from '../actions/types';

const initialState = {
  currentUser: null,
  error: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return { ...state, currentUser: action.payload };

    case types.LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case types.LOGIN_RESET_ERROR:
      return {
        ...state,
        error: null,
      };
    case types.LOGOUT:
      return { ...state, currentUser: null };

    default:
      return state;
  }
};
export default AuthReducer;
