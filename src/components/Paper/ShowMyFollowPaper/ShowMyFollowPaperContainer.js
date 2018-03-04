import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import styles from './ShowMyFollowPaper.less';
import MyFollowPaper from './ShowMyFollowPaper';
import TagPage from './TagPage';
import { pageSize } from "../../../utils/constant";

class ShowMyFollowPaperContainer extends Component {

  state = {
    // page pagination
    BeginIndex: 0,
    papers: [],
  };

  componentDidMount() {

    const values = {
      token: this.props.token,
      BeginIndex: 0,
      PageSize: pageSize,
    };

    this.props.dispatch({
      type: 'paper/fetchAllFollowPaper',
      payload: values
    }).then(() => {
      let BeginIndex = this.state.BeginIndex + pageSize;

      this.setState({
        BeginIndex,
        papers: this.props.paperList,
      })

    })

  }

  setBeginIndex = (BeginIndex) => {
    this.setState({
      BeginIndex,
    })
  };

  setPapers = (papers) => {
    this.setState({
      papers,
    })
  };

  render() {

    const { papers, BeginIndex } = this.state;

    return (
      <div className={styles.gutter}>
        <Row gutter={16}>
          <Col className={styles["ant-row"]} span={18}>
            <MyFollowPaper papers={papers} BeginIndex={BeginIndex} setBeginIndex={this.setBeginIndex}
                           setPapers={this.setPapers}/>
          </Col>
          <Col className={styles["ant-row"]} span={6}>
            <TagPage papers={papers} setPapers={this.setPapers}/>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.user.account.token,
    paperList: state.paper.papers,
    error: state.paper.error,
  };
};

export default connect(mapStateToProps)(ShowMyFollowPaperContainer);
