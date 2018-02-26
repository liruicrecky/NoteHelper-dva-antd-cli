import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Input, Button, Spin, List } from 'antd';

import styles from './MainPage.less';

const Search = Input.Search;

class MainPage extends Component {

  state = {
    BeginIndex: 0,
    loading: false,
    loadingMore: false,
    showLoadingMore: true,
    showList: false,
    papers: [],
  };

  searchPaper = (value) => {
    const data = {
      keyword: value,
      token: this.props.token,
    };

    this.props.dispatch({
      type: 'paper/searchPaperByKeyword',
      payload: data,
    }).then(() => {
      const papers = this.props.papers;
      this.setState({
        papers,
        showList: true,
      })
    })
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


  render() {

    const { loading, loadingMore, showLoadingMore, showList, papers } = this.state;

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button disabled onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    return (
      <div style={{ marginTop: "5vh" }}>
        <Row type="flex" justify="center">
          <Col span={12}>
            <Search
              placeholder="试试搜索一下吧...  :)"
              onSearch={this.searchPaper}
              enterButton
            />
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: "5vh" }}>
          <Col span={16}>
            {showList &&
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
                    title={<Link to={"/dashboard/paperDetail/" + item.doc_id}>{item.doc_title}</Link>}
                    description={item.doc_publish + " " + item.doc_author}
                  />
                  <div>{item.doc_summary}</div>
                </List.Item>
              )}
            />
            }
          </Col>
        </Row>
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

export default connect(mapStateToProps)(MainPage);
