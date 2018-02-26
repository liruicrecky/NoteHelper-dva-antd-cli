import React from 'react';
import { connect } from 'dva';

import MainLayout from '../components/layout/MainLayout/MainLayout';
import MainPage from '../components/MainPage/MainPage';

const IndexPage = ({ location }) => {
  return (
    <MainLayout location={location}>
      <MainPage/>
    </MainLayout>
  );
};


IndexPage.propTypes = {};

export default connect()(IndexPage);
