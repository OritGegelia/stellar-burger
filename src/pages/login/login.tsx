import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUser,
  logIn,
  setUser
} from '../../services/slices/userSlice/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(getUser);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const logInData = { email, password };
    try {
      await dispatch(logIn(logInData)).unwrap();
      await dispatch(setUser(logInData));
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
