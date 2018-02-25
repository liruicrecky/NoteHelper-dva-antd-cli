import React, { Component } from 'react';
import {
  Row, Col, Divider, List, Button, Spin, Avatar, Input, Collapse,
  Icon, Rate, Upload, message, Tag, Tooltip, Select
} from 'antd';
import { connect } from 'dva';

import styles from './PaperDetail.less';
import { pageSize } from "../../../utils/constant";

const { TextArea } = Input;
const Panel = Collapse.Panel;
const Option = Select.Option;

class PaperDetail extends Component {

  state = {
    // comment
    BeginIndex: 0,
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    paperId: "",
    comments: [],
    paperComment: "",
    rateValue: 3,
    // tags
    customTags: [],
    customTagNames: [],
    inputVisible: false,
    inputValue: '',
  };

  // load data at first time
  componentDidMount() {

    // get paper id from params and set to state
    const { paperId } = this.props.match.params;
    this.setState({ paperId: paperId });

    // get paper comment
    const values = {
      BeginIndex: 0,
      PageSize: pageSize,
      docId: paperId,
    };

    this.props.dispatch({ type: 'paper/fetchPaperComment', payload: values })
      .then(() => {
        let BeginIndex = this.state.BeginIndex + pageSize;
        this.setState({
          BeginIndex,
          loading: false,
          comments: this.props.comments,
        })
      });

    // get tags
    const data = {
      token: this.props.account.token,
    };

    this.props.dispatch({ type: 'tag/fetchCustomTag', payload: data })
      .then(() => {
        const customTags = this.props.customTags;
        const customTagNames = this.props.customTagNames;

        this.setState({
          customTags,
          customTagNames,
        })
      });
  }

  // time format
  getTime = (time) => {
    const newDate = new Date();
    newDate.setTime(time * 1000);
    return newDate.toLocaleString();
  };

  // comment
  textAreaOnChange = (e) => {
    this.setState({
      paperComment: e.target.value,
    })
  };

  onHandleCommentPost = (e) => {
    e.preventDefault();
    const data = {
      userId: this.props.account.userId,
      mContent: this.state.paperComment,
      docId: this.state.paperId,
    };
    this.props.dispatch({
      type: 'paper/commentPaper',
      payload: data,
    }).then(() => {
      const newComment = {}
    })
  };

  // rate
  rateHandleChange = (rateValue) => {
    this.setState({ rateValue });
  };

  // tags
  tagHandleClose = (removedTagName) => {

    const removeTag = this.state.customTags.find(v => v.tag_name === removedTagName);
    const data = {
      tagId: removeTag.tag_id,
      token: this.props.token,
    };

    const customTagNames = this.state.customTagNames.filter(tag => tag !== removedTagName);
    const customTags = this.state.customTags.filter(tag => tag.tag_name !== removedTagName);

    this.props.dispatch({ type: 'tag/deleteCustomTag', payload: data })
      .then(() => {

      });

    this.setState({ customTagNames, customTags });
  };

  tagShowInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  tagHandleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  tagHandleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let customTagNames = state.customTagNames;
    if (inputValue && customTagNames.indexOf(inputValue) === -1) {
      customTagNames = [...customTagNames, inputValue];
    }

    const data = {
      tagName: inputValue,
      token: this.props.token,
    };

    this.props.dispatch({
      type: 'tag/addCustomTag',
      payload: data,
    }).then(() =>
      this.setState({
        customTagNames,
        inputVisible: false,
        inputValue: '',
      }))

  };

  tagSaveInputRef = input => this.input = input;

  // select
  selectHandleChange = (value) => {
    console.log(`selected ${value}`);
  };

  render() {

    const { loading, loadingMore, showLoadingMore, comments, rateValue } = this.state;

    // tags
    const { inputVisible, inputValue, customTagNames } = this.state;

    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin/>}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;

    const uploadProps = {
      name: 'file',
      action: '/api/uploadDoc?docId=' + this.state.paperId,
      headers: {
        'token': this.props.account.token,
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功！`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 不知道怎么的文件上传失败了！`);
        }
      },
    };

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }}/>
          {text}
      </span>
    );

    return (
      <div className={styles.gutter}>
        <Row gutter={18}>
          <Col className={styles["ant-row"]} span={18}>
            <Row>
              <div>Nano-sized transition-metal oxides as negative-electrode materials for lithium-ion batteries</div>
              <Divider/>
              <div><p>摘要</p></div>
              <div>Rechargeable solid-state batteries have long been considered an attractive power source for a
                wide variety of applications, and in particular, lithium-ion batteries are emerging as the
              </div>
            </Row>
            <Row>
              <Divider/>

              <List
                header={<div className={styles}>评论</div>}
                className={styles["loadmore-list"]}
                loading={loading}
                itemLayout="vertical"
                loadMore={loadMore}
                dataSource={comments}
                size="small"
                renderItem={item => (
                  <List.Item
                    key={item.user_id}
                    actions={[<IconText type="delete" text="删除"/>]}
                  >
                    <List.Item.Meta
                      /*avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}*/
                      title={item.name}
                      description={this.getTime(item.m_time)}
                    />
                    {item.m_content}
                  </List.Item>
                )}
              />
              <TextArea
                autosize={{ minRows: 5 }}
                placeholder="评论一下吧！"
                onChange={this.textAreaOnChange}
              />
              <Button
                type="primary"
                className={styles["button-post"]}
                onClick={this.onHandleCommentPost.bind(this)}
              >
                评论</Button>

            </Row>
          </Col>
          <Col className={styles["ant-row"]} span={6}>
            <Collapse bordered={true} defaultActiveKey={['1', '2']}>
              <Panel header="关于" key="1">
                <div>
                  <Button type="primary" size="small">
                    <Icon type="tag"/>已关注
                  </Button>

                  <Upload {...uploadProps}>
                    <Button type="primary" size="small" className={styles["button-right"]}>
                      上传PDF文件<Icon type="upload"/>
                    </Button>
                  </Upload>

                </div>
                <div style={{ marginTop: "2vh" }}>
                  <span>
                    <Rate onChange={this.rateHandleChange} value={rateValue}/>
                    {rateValue && <span className="ant-rate-text">{rateValue} stars</span>}
                  </span>
                </div>
                <Divider/>
                <div>
                  Poizot P, Laruelle S, Grugeon S, Dupont L, and Tarascon J M.

                  Nano-sized transition-metal oxides as negative-electrode materials for lithium-ion batteries.

                  Nature, Volume 407, Issue 6803, 2000, Pages 496-499.
                </div>

              </Panel>
              <Panel header="标签" key="2">

                <div>
                  {customTagNames.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag key={tag} closable={true} style={{ marginBottom: "5px" }}
                           afterClose={() => this.tagHandleClose(tag)}>
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                  })}
                  {inputVisible && (
                    <Input
                      ref={this.tagSaveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={inputValue}
                      onChange={this.tagHandleInputChange}
                      onBlur={this.tagHandleInputConfirm}
                      onPressEnter={this.tagHandleInputConfirm}
                    />
                  )}
                  {!inputVisible && (
                    <Tag
                      onClick={this.tagShowInput}
                      style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                      <Icon type="plus"/> 新标签
                    </Tag>
                  )}
                </div>

                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Tags Mode"
                  onChange={this.selectHandleChange}
                >

                </Select>


              </Panel>
            </Collapse>

          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customTags: state.tag.customTags,
    customTagNames: state.tag.customTagNames,
    comments: state.paper.comments,
    error: state.paper.error,
    account: state.user.account,
  };
};

export default connect(mapStateToProps)(PaperDetail);
