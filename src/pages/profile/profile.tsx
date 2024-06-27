import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { RootState } from '../../services/store';
import { changeUser, getUser, logOut } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const logInUser = useSelector(getUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [initialFormValue, setInitialFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const initialValues = {
      name: logInUser?.name || '',
      email: logInUser?.email || '',
      password: ''
    };
    setFormValue(initialValues);
    setInitialFormValue(initialValues);
  }, [logInUser]);

  const isFormChanged =
    formValue.name !== initialFormValue.name ||
    formValue.email !== initialFormValue.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(changeUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue(initialFormValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
