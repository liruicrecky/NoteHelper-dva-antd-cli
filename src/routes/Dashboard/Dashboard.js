import React from 'react';
import { connect } from 'dva';

import styles from './Dashboard.less';
import DashboardComponent from '../../components/layout/DashboardLayout/DashboardLayout';
import MainLayout from '../../components/layout/MainLayout/MainLayout';

const Dashboard = ({ location }) => {
  return (
    <MainLayout location={location}>
      <div className={styles.normal}>
        <DashboardComponent location={location}/>
      </div>
    </MainLayout>
  );
};

export default connect()(Dashboard);
