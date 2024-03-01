import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';

export const SignOut = async (dispatch) => {
  try {
    dispatch(signOutUserStart());

    const res = await fetch('/api/user/signout', {
      method: 'POST',
    });

    const data = res.json();

    if (data.success === false) {
      dispatch(signOutUserFailure(data.message));
      return;
    }

    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
};
