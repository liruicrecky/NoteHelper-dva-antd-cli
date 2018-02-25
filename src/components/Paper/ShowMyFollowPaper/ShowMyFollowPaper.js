import React, { Component } from 'react';
import { List, Button, Spin, Modal, Menu, Dropdown, Icon, Select } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';

import styles from './ShowMyFollowPaper.less';
import { pageSize } from '../../../utils/constant';

const Option = Select.Option;

class ShowMyFollowPaper extends Component {

  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    unFollowVisible: false,
    addPaperToTagVisible: false,
    confirmLoading: false,
    docId: "",
    papers: [],
    selectTagsChildren: [],
    selectTags: [],
  };

  // load data at first time
  componentDidMount() {
    const values = {
      token: this.props.token,
    };

    this.props.dispatch({ type: 'paper/showAllFollowPaper', payload: values })
      .then(() => {

        // select tag
        const customTagNames = this.props.customTagNames;
        const selectTagsChildren = [];
        customTagNames.forEach((v) => {
          selectTagsChildren.push(<Option key={v}>{v}</Option>);
        });

        this.setState({
          loading: false,
          papers: this.props.paperList,
          selectTagsChildren,
        })
      });
  }

  // unFollow paper modal
  unFollowShowModal = (paperId) => {
    this.setState({
      unFollowVisible: true,
      docId: paperId,
    });
  };

  unFollowHandleOk = () => {
    this.unFollowPaper(this.state.docId);
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        unFollowVisible: false,
        confirmLoading: false,
      });
    }, 1000);
  };

  unFollowHandleCancel = () => {
    this.setState({
      unFollowVisible: false,
    });
  };

  // load more
  getData = () => {
    const values = {
      token: this.props.token,
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

  // unFollow paper
  unFollowPaper = (paperId) => {
    const data = {
      docId: paperId,
      token: this.props.token,
    };
    this.props.dispatch({
      type: 'paper/unFollowPaper',
      payload: data,
    }).then(() => {
      this.setState({
        papers: this.state.papers.filter((v) => v.doc_id !== paperId)
      })
    })
  };

  // operation menu click
  handleMenuClick = (key, e) => {
    switch (e.key) {
      case "addToTag":
        this.addPaperToTagShowModal(key);
        break;
      default:
    }
  };

  addPaperToTag = (paperId, tagId) => {
    let data = {
      token: this.props.token,
      docId: paperId,
      tagId: tagId,
    };
    this.props.dispatch({
      type: 'tag/addPaperToTag',
      payload: data,
    })
  };

  // add paper to tag modal function
  addPaperToTagShowModal = (docId) => {
    this.setState({
      docId: docId,
      addPaperToTagVisible: true,
    });
  };

  addPaperToTagHandleOk = () => {

    const paperId = this.state.docId;
    const customTags = this.props.customTags;
    const tag = customTags.find((v) => v.tag_name === this.state.selectTags[0]);

    this.addPaperToTag(paperId, tag.tag_id);
    this.setState({
      confirmLoading: true,
      selectTags: [],
    });
    setTimeout(() => {
      this.setState({
        addPaperToTagVisible: false,
        confirmLoading: false,
      });
    }, 1000);
  };

  addPaperToTagHandleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      addPaperToTagVisible: false,
    });
  };

  selectHandleChange = (value) => {
    this.setState({
      selectTags: value,
    });
  };

  menu = (key) => (
    <Menu onClick={this.handleMenuClick.bind(this, key)}>
      <Menu.Item key="addToTag">添加到自定义标签</Menu.Item>
      <Menu.Item key="2">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
  );

  render() {
    const { loading, loadingMore, showLoadingMore, papers, selectTagsChildren } = this.state;
    const { unFollowVisible, addPaperToTagVisible, confirmLoading } = this.state;

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button onClick={this.onLoadMore} disabled>加载更多</Button>}
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
                         <div>
                           <Button onClick={this.unFollowShowModal.bind(this, item.doc_id)}>取消关注</Button>
                           <Modal title="取消关注"
                                  visible={unFollowVisible}
                                  onOk={this.unFollowHandleOk}
                                  confirmLoading={confirmLoading}
                                  onCancel={this.unFollowHandleCancel}
                                  okText="确认"
                                  cancelText="取消"
                           ><p>您确认要取消关注《{item.doc_title}》这篇文献吗？</p>
                           </Modal>
                           <Dropdown overlay={this.menu(item.doc_id)}>
                             <Button style={{ marginLeft: 8 }}>
                               操作 <Icon type="down"/>
                             </Button>
                           </Dropdown>
                           <Modal title="增加文献到标签"
                                  visible={addPaperToTagVisible}
                                  onOk={this.addPaperToTagHandleOk}
                                  confirmLoading={confirmLoading}
                                  onCancel={this.addPaperToTagHandleCancel}
                                  okText="确认"
                                  cancelText="取消"
                           >
                             <p>把文献《{item.doc_title}》增加到以下标签：</p>
                             <Select
                               mode="multiple"
                               style={{ width: '100%' }}
                               placeholder="请选择标签"
                               onChange={this.selectHandleChange}
                             >
                               {selectTagsChildren}
                             </Select>
                           </Modal>
                         </div>
                       }>
              <List.Item.Meta
                /*avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}*/
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
    customTags: state.tag.customTags,
    customTagNames: state.tag.customTagNames,
    paperList: state.paper.papers,
    error: state.paper.error,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(ShowMyFollowPaper);
