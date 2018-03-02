import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import styles from './ShowAllPaper.less';
import AllPaper from './ShowAllPaper';
import ShowAllPaperTagPage from './ShowAllPaperTagPage';

class ShowAllPaperContainer extends Component {

  render() {
    return (
      <div className={styles.gutter}>
        <Row gutter={16}>
          <Col className={styles["ant-row"]} span={18}>
            <AllPaper/>
          </Col>
          <Col className={styles["ant-row"]} span={6}>
            <ShowAllPaperTagPage/>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    paperList: state.paper.papers,
    error: state.paper.error,
  };
};

export default connect(mapStateToProps)(ShowAllPaperContainer);
