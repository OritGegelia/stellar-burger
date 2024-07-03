import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import Protected from '../protected-route/protected-route';
import {
  getAuthChecked,
  checkUserAuth,
  getUser
} from '../../services/slices/userSlice';
import { useEffect } from 'react';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  console.log(`User: `, user);

  const matchFeed = useMatch('/feed/:number');
  const matchProfileOrders = useMatch('/profile/orders/:number');

  const number = matchFeed?.params.number || matchProfileOrders?.params.number;

  const background = location.state?.background;

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={<Protected onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/register'
          element={<Protected onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<Protected onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<Protected onlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<Protected component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<Protected component={<ProfileOrders />} />}
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={<Protected component={<OrderInfo />} />}
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Ингредиент подробно'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${number}`} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Protected
                component={
                  <Modal title={`#${number}`} onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
