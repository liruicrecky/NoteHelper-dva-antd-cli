import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Spin, List } from 'antd';

import styles from './DashboardLayout.less';

class DashboardMain extends Component {

  state = {
    papers: [],
  };

  componentDidMount() {
    const props = this.props;
    if (props.papers.length > 0) {
      this.setState({
        papers: props.papers,
      })
    }
  }

  /*  componentWillReceiveProps(nextProps) {
      this.setState({ papers: nextProps.papers });
    }*/

  followPaper = (paperId) => {
    const state = this.state;
    const data = {
      docId: paperId,
      token: this.props.token,
    };
    this.props.dispatch({
      type: 'paper/followPaper',
      payload: data,
    }).then(() => {
      const papers = state.papers;
      papers.find((v) => v.doc_id === paperId).is_follow = true;

      this.setState({
        papers,
      })
    })
  };

  unFollowPaper = (paperId) => {
    const state = this.state;
    const data = {
      docId: paperId,
      token: this.props.token,
    };
    this.props.dispatch({
      type: 'paper/unFollowPaper',
      payload: data,
    }).then(() => {
      const papers = state.papers;
      papers.find((v) => v.doc_id === paperId).is_follow = false

      this.setState({
        papers,
      })
    })
  };

  render() {

    const { loading, loadingMore, showLoadingMore, papers } = this.state;

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button disabled onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <div>
        <List
          className={styles["loadmore-list"]}
          loading={loading}
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={papers}
          renderItem={item => (
            <List.Item key={item.doc_id}
                       extra={
                         item.is_follow ?
                           <Button onClick={this.unFollowPaper.bind(null, item.doc_id)} type="primary">已关注</Button>
                           :
                           <Button onClick={this.followPaper.bind(null, item.doc_id)}>关注</Button>
                       }
            >
              <List.Item.Meta
                title={<Link to={"/dashboard/paperDetail/" + item.doc_id}>{item.doc_title}</Link>}
                description={item.doc_publish + " " + item.doc_author}
              />
              <div>{item.doc_summary}</div>
            </List.Item>
          )}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    papers: state.paper.papers,
    error: state.paper.error,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(DashboardMain)
