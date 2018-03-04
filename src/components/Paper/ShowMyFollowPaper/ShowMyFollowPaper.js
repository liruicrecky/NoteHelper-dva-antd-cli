import React, { Component } from 'react';
import { List, Button, Spin, Modal, Menu, Dropdown, Icon, Select, Row, Checkbox, Divider, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import axios from 'axios';

import styles from './ShowMyFollowPaper.less';
import { pageSize } from '../../../utils/constant';
import { saveAsFile } from '../../../utils/helper';

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
    //  papers: [],
    selectTagsChildren: [],
    selectTags: [],
    // check state
    checkedList: [],
    indeterminate: true,
    checkAll: false,
    // page pagination
    //  BeginIndex: 0,
  };

  // load data at first time
  componentDidMount() {
    /* const values = {
       token: this.props.token,
       BeginIndex: 0,
       PageSize: pageSize,
     };

     this.props.dispatch({
       type: 'paper/fetchAllFollowPaper',
       payload: values
     }).then(() => {*/

    // paper
    //  let BeginIndex = this..BeginIndex + pageSize;

    // select tag
    const customTagNames = this.props.customTagNames;
    const selectTagsChildren = [];
    customTagNames.forEach((v) => {
      selectTagsChildren.push(<Option key={v}>{v}</Option>);
    });

    // paper id
    const paperList = this.props.papers;
    paperList.forEach((v) => {
      v.checked = false
    });

    this.setState({
      loading: false,
      // papers: paperList,
      // BeginIndex,
      // selectTagsChildren,
    })
    // });
  }

  /*  componentWillReceiveProps(nextProps) {
      this.setState({ papers: nextProps.paperList });
    }*/

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
  getData = (callback) => {
    const values = {
      BeginIndex: this.props.BeginIndex,
      PageSize: pageSize,
      token: this.props.token,
    };

    this.props.dispatch({
      type: 'paper/fetchAllFollowPaper',
      payload: values
    }).then(() => {
      callback();
    });
  };

  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData(() => {

      const BeginIndex = this.props.BeginIndex + pageSize;

      const papers = this.props.papers.concat(this.props.paperList);
      this.props.setPapers(papers);
      this.props.setBeginIndex(BeginIndex);


      this.setState({
        //  papers,
        //  BeginIndex,
        loadingMore: false,
      }, () => {
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

      this.props.setPapers(this.props.papers.filter((v) => v.doc_id !== paperId));

      /*this.setState({
        papers: this.state.papers.filter((v) => v.doc_id !== paperId)
      })*/
    })
  };

  // operation menu click
  handleMenuClick = (key, e) => {
    switch (e.key) {
      case "downloadPdf":
        this.downPaperAsPDF(key);
        break;
      case "exportReference":
        this.exportPaperReference(key);
        break;
      case "unFollow":
        this.unFollowShowModal(key);
        break;
      default:
    }
  };

  // export pdf
  exportPaperReference = (paperId) => {

    const postUrl = '/api/exportFormat?list=' + paperId;

    axios.post(postUrl, null, {
      headers: {
        'token': this.props.token,
      }
    }).then((response) => {
      saveAsFile(response.data.result.list, "txt", "1.txt")
    })
  };

  exportPaperReferenceAll = (e) => {

    e.preventDefault();
    const { checkedList } = this.state;
    const lenght = checkedList.length;
    let postUrl = '/api/exportFormat?list=';

    if (lenght > 0) {
      checkedList.forEach((v, i) => {
        if (i !== lenght - 1)
          postUrl += v + ",";
        else
          postUrl += v;
      });

      axios.post(postUrl, null, {
        headers: {
          'token': this.props.token,
        }
      }).then((response) => {
        console.log(response);
        saveAsFile(response.data.result.list, "txt", "1.txt")
      })
    } else {
      message.info("请先勾选需要的文献！")
    }


  };

  // down pdf
  downPaperAsPDF = (paperId) => {

    const postUrl = '/api/showPdf?docId=' + paperId;
    /*axios.get(postUrl, {
      headers: {
        'Token': this.props.token,
      }
    }).then(() => {

    })*/
    axios.get(postUrl, {
      responseType: "blob",
      headers: {
        'token': this.props.token,
      }
    }).then((response) => {
      saveAsFile(response.data, "pdf", "1")
    })

  };

  // add paper to tag modal function

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

  // menu

  menu = (key) => (
    <Menu onClick={this.handleMenuClick.bind(this, key)}>
      <Menu.Item key="downloadPdf">下载PDF</Menu.Item>
      <Menu.Item key="exportReference">导出引用</Menu.Item>
      <Menu.Item key="unFollow">取消关注</Menu.Item>
      <Menu.Item key="5">占位</Menu.Item>
    </Menu>
  );

  // check box
  onCheckChange = (paperId, e) => {
    console.log("paperId ", paperId);
    console.log("e ", e);
    e.preventDefault();
    const { checkedList } = this.state;
    const { papers } = this.props;
    let checkAll = false;

    if (e.target.checked) {
      // 选中
      checkedList.push(paperId);
      if (papers.length === checkedList.length) checkAll = true;
      papers.find((v) => v.doc_id === paperId).checked = true;
      this.setState({
        checkedList, checkAll, papers,
        indeterminate: !!checkedList.length && (checkedList.length < papers.length),
      });

    } else {
      // 没选中
      const newCheckedList = checkedList.filter((v) => v !== paperId);
      if (papers.length !== newCheckedList.length) checkAll = false;
      papers.find((v) => v.doc_id === paperId).checked = false;
      this.setState({
        checkedList: newCheckedList, checkAll, papers,
        indeterminate: !!newCheckedList.length && (newCheckedList.length < papers.length),
      });
    }
  };

  onCheckAllChange = (e) => {
    const { checkedList } = this.state;
    const { papers } = this.props;

    checkedList.splice(0, checkedList.length);

    if (e.target.checked) {
      papers.forEach((v) => {
        v.checked = true;
        checkedList.push(v.doc_id);
      })
    } else {
      papers.forEach((v) => {
        v.checked = false;
      });
    }

    this.setState({
      papers,
      checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    const { loading, loadingMore, showLoadingMore, selectTagsChildren } = this.state;
    const { unFollowVisible, addPaperToTagVisible, confirmLoading } = this.state;

    const { papers } = this.props;

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    // check box
    const { indeterminate, checkAll } = this.state;

    return (
      <div>
        <Row>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >全部选中</Checkbox>
          <Button
            type="primary"
            onClick={this.exportPaperReferenceAll}
            style={{ float: "right", marginRight: 8 }}
          >导出</Button>
        </Row>
        <Divider/>
        <Row>
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
                             <Checkbox
                               style={{ marginRight: 8 }}
                               checked={item.checked}
                               onChange={this.onCheckChange.bind(this, item.doc_id)}
                             />

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
        </Row>
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
