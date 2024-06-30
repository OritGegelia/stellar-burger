import { useSelector } from '../../services/store';
import { getUser, getAuthChecked } from '../../services/slices/userSlice';
import { useLocation, Navigate } from 'react-router-dom';
import React from 'react';
import { Preloader } from '../ui/preloader';

type TProtectedProps = {
  onlyUnAuth?: boolean;
  component: JSX.Element;
};

const Protected: React.FC<TProtectedProps> = ({
  onlyUnAuth = false,
  component
}) => {
  const isAuthChecked = useSelector(getAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!onlyUnAuth && !user) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return component;
};

export default Protected;
