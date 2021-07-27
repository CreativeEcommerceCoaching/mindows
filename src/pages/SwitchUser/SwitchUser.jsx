import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LockCover from '../../components/LockCover/LockCover';
import { selectBootBackgrounds } from '../../redux/boot/boot.selectors';
import { signInUser } from '../../redux/auth/auth.actions';
import { selectAuthError, selectAuthSuccess } from '../../redux/auth/auth.selectors';
import { getBootBackgrounds } from '../../redux/boot/boot.actions';
import LoginView from './LoginView';
import './SwitchUser.scss';
import { useLocation } from 'react-router-dom';


const SwitchUser = ({ users, ...props }) => {

  const backgrounds = useSelector(selectBootBackgrounds);
  const authError = useSelector(selectAuthError);
  const authSuccess = useSelector(selectAuthSuccess);
  const [hasDoneLoading, onDoneLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => dispatch(getBootBackgrounds()), [dispatch]);
  useEffect(() => {
    authSuccess && setTimeout(() => console.log('Logged in'), 2000);
  }, [authSuccess]);

  const onLogin = (userIndex, password) => {
    dispatch(signInUser(userIndex, password));
  };

  return (
    <React.Fragment>
      {
        hasDoneLoading
          && <LoginView
          users={users}
          onLogin={onLogin}
          authError={authError}
          authSuccess={authSuccess}
          background={backgrounds.login} /> 
      }
      {
        backgrounds.lock && backgrounds.login
          && 
          <LockCover
            background={backgrounds.lock}
            autoHide={new URLSearchParams(location.search).get('cover') === 'false'}
            onDoneLoading={to => setTimeout(() => onDoneLoading(to), 1000)} />
      }
    </React.Fragment>
  );
};

export default SwitchUser;