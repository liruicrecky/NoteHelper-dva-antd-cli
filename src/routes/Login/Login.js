import React from 'react';
import { connect } from 'dva';
import styles from './Login.less';
import LoginComponent from '../../components/Login/Login';
import MainLayout from '../../components/layout/MainLayout/MainLayout';

const Login = ({ location }) => {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <LoginComponent/>
      </div>
    </MainLayout>
  );
};

export default connect()(Login);
