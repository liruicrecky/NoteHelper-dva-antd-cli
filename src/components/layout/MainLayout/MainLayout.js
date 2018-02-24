import React from 'react';

import styles from './MainLayout.less';
import Header from './Header';

const MainLayout = ({ children, location }) => {
  return (
    <div className={styles.normal}>
      <Header location={location}/>
      <div className={styles.content}>
        <div className={styles.main}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
