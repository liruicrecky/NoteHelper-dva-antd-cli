import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Input, Button, Spin, List, Tag, Divider } from 'antd';

import styles from './MainPage.less';

const Search = Input.Search;

class MainPage extends Component {

  state = {
    BeginIndex: 0,
    loading: false,
    loadingMore: false,
    showLoadingMore: true,
    papers: [],
  };

  componentDidMount() {
    // if login, then fetch top ten papers
    const props = this.props;
    const state = this.state;

    if (props.isLogin) {
      if (state.papers.length === 0) {
        props.dispatch({
          type: 'paper/fetchTopTenPapers',
          payload: {
            token: props.token,
          }
        }).then(() => {
          this.setState({
            papers: this.props.papers,
          })
        })
      }
    }
  }

  searchPaper = (value) => {
    this.props.dispatch({
      type: 'paper/searchPaperByKeyword',
      payload: {
        keyword: value,
      },
    }).then(() => {
      this.setState({
        papers: this.props.papers,
      })
    })
  };

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


  /*
  <Row type="flex" justify="center" style={{ marginTop: "5vh" }}>
  <div className={styles["tag-title"]}>热门标签</div>
  </Row>

  <Row type="flex" justify="center" style={{ marginTop: "2vh" }}>
  <Tag className={styles["tag"]} color="magenta">C++</Tag>
  <Tag className={styles["tag"]} color="red">red</Tag>
  <Tag className={styles["tag"]} color="volcano">volcano</Tag>
  <Tag className={styles["tag"]} color="orange">orange</Tag>
  <Tag className={styles["tag"]} color="gold">gold</Tag>
  </Row>
  */


  render() {

    const { loading, loadingMore, showLoadingMore } = this.state;
    const { papers } = this.state;


    const isTopTen = papers.length === 10;

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
            {isTopTen &&
            <div>
              <span className={styles["top-ten"]}>最新上传Top10</span>
              <Divider/>
            </div>
            }
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
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    papers: state.paper.papers,
    showList: state.paper.showList,
    error: state.paper.error,
    token: state.user.account.token,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(MainPage);
