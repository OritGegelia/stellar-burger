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
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';

// Register

export const register = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => {
    try {
      const res = await registerUserApi(registerData);
      return res.user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Log In

export const logIn = createAsyncThunk(
  'user/logInUser',
  async (loginData: TLoginData) => {
    try {
      const res = await loginUserApi(loginData);
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Change user

export const changeUser = createAsyncThunk(
  'user/changeUser',
  async (newData: TUser) => {
    try {
      const res = await updateUserApi(newData);
      return res.user;
    } catch (error) {
      return Promise.reject(error);
    }
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
    try {
      const res = await resetPasswordApi(data);
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

// Auth checking

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (localStorage.getItem('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
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

const initialState: TUserState = {
  user: null,
  isAuth: false,
  error: undefined,
  status: 'idle'
};

// Слайс

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
        state.isAuth = true;
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
        state.isAuth = false;
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
