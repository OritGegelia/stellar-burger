import userReducer, {
  initialState,
  register,
  logIn,
  changeUser,
  logOut,
  resetPassword,
  setAuthChecked,
  setUser
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'mail@mail.com',
  name: 'User Name'
}

describe('user slice reducers', () => {
  it('Проверка initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Тест для редьюсера setAuthChecked', () => {
    const actualState = userReducer(initialState, setAuthChecked(true));
    expect(actualState.isAuth).toEqual(true);
  });

  it('Тест для редьюсера setUser', () => {
    const user = mockUser;
    const actualState = userReducer(initialState, setUser(user));
    expect(actualState.user).toEqual({ ...user, key: expect.any(String) });
  });

  it('Тест для register.fulfilled', () => {
    const user = mockUser;
    const action = { type: register.fulfilled.type, payload: user };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('succeeded');
    expect(actualState.user).toEqual(user);
  });

  it('Тест для register.rejected', () => {
    const error = { message: 'Неудачная регистрация' };
    const action = { type: register.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });
  
  it('Тест для logIn.fulfilled', () => {
    const user = mockUser;
    const action = { type: logIn.fulfilled.type, payload: user };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('succeeded');
    expect(actualState.user).toEqual(user);
  });
  
  it('Тест для logIn.rejected', () => {
    const error = { message: 'Неудачный логин' };
    const action = { type: logIn.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });
  
  it('Тест для changeUser.fulfilled', () => {
    const user = mockUser;
    const action = { type: changeUser.fulfilled.type, payload: user };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('succeeded');
    expect(actualState.user).toEqual(user);
  });
  
  it('Тест для changeUser.rejected', () => {
    const error = { message: 'Неудачное изменение данных юзера' };
    const action = { type: changeUser.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });

  it('Тест для logOut.fulfilled', () => {
    const action = { type: logOut.fulfilled.type };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('succeeded');
    expect(actualState.user).toEqual(null);
  });

  it(' Тест для logOut.rejected', () => {
    const error = { message: 'Неудачный логаут' };
    const action = { type: logOut.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });

  it('Тест для resetPassword.fulfilled', () => {
    const action = { type: resetPassword.fulfilled.type };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('succeeded');
  });

  it('Тест для resetPassword.rejected', () => {
    const error = { message: 'Неудачное восстановление пароля' };
    const action = { type: resetPassword.rejected.type, error };
    const actualState = userReducer(initialState, action);
    expect(actualState.status).toEqual('failed');
    expect(actualState.error).toEqual(error.message);
  });
});
