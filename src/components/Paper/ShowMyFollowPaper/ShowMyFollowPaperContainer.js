import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import styles from './ShowMyFollowPaper.less';
import MyFollowPaper from './ShowMyFollowPaper';
import TagPage from './TagPage';

class ShowAllPaperContainer extends Component {

  state = {
    tagId: "",
  };

  render() {
    return (
      <div className={styles.gutter}>
        <Row gutter={16}>
          <Col className={styles["ant-row"]} span={18}>
            <MyFollowPaper/>
          </Col>
          <Col className={styles["ant-row"]} span={6}>
            <TagPage/>
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
