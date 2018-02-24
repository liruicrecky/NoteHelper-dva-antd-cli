import React from 'react';
import { Layout } from 'antd';

import styles from './index.less';

const { Content } = Layout;

const LoginLayout = props => {
  return (
    <Layout className={styles.normal}>
      <Content className={styles.content}>
        {props.children}
      </Content>
    </Layout>
  );
};

export default LoginLayout;
