import React, { Component } from 'react';
import { List, Button, Spin, message } from 'antd';
import { connect } from 'dva';

import styles from './ShowAllPaper.less';
import { pageSize } from '../../../utils/constant';

class ShowAllPaperContainer extends Component {

  state = {
    BeginIndex: 0,
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    papers: [],
  };

  // load data at first time
  componentDidMount() {
    const values = {
      BeginIndex: 0,
      PageSize: pageSize,
      docType: "M",
    };

    this.props.dispatch({ type: 'paper/showAllPaper', payload: values })
      .then(() => {
        let BeginIndex = this.state.BeginIndex + pageSize;
        this.setState({
          BeginIndex,
          loading: false,
          papers: this.props.paperList,
        })
      });
  }

  // load more
  getData = () => {
    const values = {
      BeginIndex: this.state.BeginIndex,
      PageSize: pageSize,
      docType: "M",
    };

    this.props.dispatch({ type: 'paper/showAllPaper', payload: values })
      .then(() => {
        let BeginIndex = this.state.BeginIndex + pageSize;
        let papers = this.state.papers;
        this.props.paperList.forEach((v) => {
          papers.push(v)
        });
        this.setState({
          papers,
          BeginIndex,
          loadingMore: false,
        })
      });
  };

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

  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData(() => {
      this.setState({}, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
    });
  };

  render() {
    const { loading, loadingMore, showLoadingMore, papers } = this.state;
    // const { paper } = this.props;
    // console.log("papers ", paper);

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;
    // actions={[<a>edit</a>, <a>more</a>]}
    //  {/*{this.props.error && message.error('由于不可知原因，关注失败！')}*/}
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
                /*avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}*/
                title={item.doc_title}
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
    error: state.paper.error,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(ShowAllPaperContainer);
