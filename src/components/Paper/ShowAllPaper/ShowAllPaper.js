import React, { Component } from 'react';
import { List, Button, Spin } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';

import styles from './ShowAllPaper.less';
import { pageSize } from '../../../utils/constant';

class ShowAllPaper extends Component {

  state = {
    BeginIndex: 0,
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    papers: [],
    tagPapers: [],
  };

  // load data at first time
  componentDidMount() {
    const values = {
      BeginIndex: 0,
      PageSize: pageSize,
      token: this.props.token,
    };

    this.props.dispatch({
      type: 'paper/fetchAllPaper',
      payload: values
    }).then(() => {
      let BeginIndex = this.state.BeginIndex + pageSize;
      this.setState({
        BeginIndex,
        loading: false,
        papers: this.props.paperList,
        tagPapers: [],
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tagPapers: nextProps.tagPapers });
  }

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

  // load more
  getData = (callback) => {
    const values = {
      BeginIndex: this.state.BeginIndex,
      PageSize: pageSize,
      token: this.props.token,
    };

    this.props.dispatch({
      type: 'paper/fetchAllPaper',
      payload: values,
    }).then(() => {
      callback();
    })
  };

  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData(() => {
      const BeginIndex = this.state.BeginIndex + pageSize;
      const papers = this.state.papers.concat(this.props.paperList);
      this.setState({
        papers,
        BeginIndex,
        loadingMore: false,
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
    });
  };

  render() {
    const { loading, loadingMore, showLoadingMore, papers, tagPapers } = this.state;

    const showPapers = tagPapers.length > 0 ? tagPapers : papers;

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <div>

        <List
          className={styles["loadmore-list"]}
          loading={loading}
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={showPapers}
          renderItem={item => (
            <List.Item key={item.doc_id}
                       extra={
                         !!item.is_follow ?
                           <Button onClick={this.followPaper.bind(null, item.doc_id)}>关注</Button> :
                           <div>已关注</div>
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

    );
  }
}

const mapStateToProps = (state) => {
  return {
    paperList: state.paper.papers,
    tagPapers: state.paper.tagPapers,
    error: state.paper.error,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(ShowAllPaper);
