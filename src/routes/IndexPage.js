import React from 'react';
import { connect } from 'dva';

import MainLayout from '../components/layout/MainLayout/MainLayout';

const IndexPage = ({ location }) => {
  return (
    <MainLayout location={location}>

    </MainLayout>
  );
};


IndexPage.propTypes = {
};

export default connect()(IndexPage);
