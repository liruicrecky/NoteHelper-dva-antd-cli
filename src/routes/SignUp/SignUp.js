import React from 'react';
import { connect } from 'dva';
import styles from './SignUp.less';
import SignUpComponent from '../../components/SignUp/SignUp';
import MainLayout from '../../components/layout/MainLayout/MainLayout';

const SignUp = ({ location }) => {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <SignUpComponent/>
      </div>
    </MainLayout>
  );
};

export default connect()(SignUp);
