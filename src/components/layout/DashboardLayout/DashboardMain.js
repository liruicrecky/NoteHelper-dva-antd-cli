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
    const data = {
      docId: paperId,
      token: this.props.token,
    };
    this.props.dispatch({
      type: 'paper/followPaper',
      payload: data,
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
                       extra={<Button onClick={this.followPaper.bind(null, item.doc_id)}>关注</Button>}>
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
