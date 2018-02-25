import React, { Component } from 'react';
import { List, Button, Spin, message } from 'antd';
import { connect } from 'dva';

import styles from './DynamicMessage.less';

class DynamicMessage extends Component {

  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,

  };

  // load data at first time
  componentDidMount() {

    const dMessageNum = this.props.dynamicMessageNum;
    if(dMessageNum !== 0){
      const data = {
        userId : this.props.userId,
      };

      this.props.dispatch({
        type:'user/fetchDynamicMessage',
        payload: data,
      }).then(() => {
        this.setState({
          loading: false,
        })
      })
    }
  }

  // load more
  getData = () => {
    const values = {
      BeginIndex: this.state.BeginIndex,
      docType: "M",
    };

    this.props.dispatch({ type: 'paper/showAllPaper', payload: values })
      .then(() => {
        let papers = this.state.papers;
        this.props.paperList.forEach((v) => {
          papers.push(v)
        });
        this.setState({
          papers,
          loadingMore: false,
        })
      });
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

  // time format
  getTime = (time) => {
    const newDate = new Date();
    newDate.setTime(time * 1000);
    return newDate.toLocaleString();
  };


  render() {
    const { loading, loadingMore, showLoadingMore } = this.state;
    const {dynamicMessage} = this.props;

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
          dataSource={dynamicMessage}
          renderItem={item => (
            <List.Item key={item.doc_id}
                       extra={<Button disabled>已读</Button>}>
              <List.Item.Meta
                title={item.doc_name}
                description={this.getTime(item.in_time)}
              />
              <span>您关注的文章有新动态了！</span>
            </List.Item>
          )}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dynamicMessageNum: state.user.dynamicMessageNum,
    dynamicMessage: state.user.dynamicMessage,
    error: state.user.error,
    userId: state.user.account.userId,
  };
};

export default connect(mapStateToProps)(DynamicMessage);
