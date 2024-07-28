import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  resetPasswordApi
} from '../../../utils/burger-api';
import { deleteCookie, setCookie, getCookie } from '../../../utils/cookie';

// Register
export const register = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => {
    const res = await registerUserApi(registerData);
    return res.user;
  }
);

// Log In
export const logIn = createAsyncThunk(
  'user/logInUser',
  async (loginData: TLoginData) => {
    const res = await loginUserApi(loginData);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

// Change user
export const changeUser = createAsyncThunk(
  'user/changeUser',
  async (newData: TUser) => {
    const res = await updateUserApi(newData);
    return res.user;
  }
);

// Log out
export const logOut = createAsyncThunk(
  'user/logOutUser',
  async (_, thunkApi) => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'user/resetPassworrd',
  async (data: { password: string; token: string }) => {
    const res = await resetPasswordApi(data);
    return res;
  }
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => {
          console.log('Hello, world', res);
          dispatch(setUser(res.user));
        })
        .catch(() => {
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
        })
        .finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

// Типизация стейта

type TUserState = {
  user: TUser | null;
  isAuth: boolean;
  error: string | undefined;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

export const initialState: TUserState = {
  user: null,
  error: undefined,
  status: 'idle',
  isAuth: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: {
      reducer: (
        state,
        action: PayloadAction<(TUser & { key: string }) | null>
      ) => {
        state.user = action.payload;
      },
      prepare: (user) => ({ payload: { ...user, key: uuidv4() } })
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getAuthChecked: (state) => state.isAuth
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(changeUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(changeUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setAuthChecked, setUser } = userSlice.actions;
export const { getUser, getAuthChecked } = userSlice.selectors;
export default userSlice.reducer;
