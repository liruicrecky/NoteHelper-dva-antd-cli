import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Input, Tooltip, Icon, Divider } from 'antd';

class TagPage extends Component {
  state = {
    tags: [],
    tagsList: [],
    inputVisible: false,
    inputValue: '',
  };

  // load data at first time
  componentDidMount() {
    const data = {
      token: this.props.token,
    };

    this.props.dispatch({ type: 'tag/fetchCustomTag', payload: data })
      .then(() => {
        const tagsList = this.props.tagList;
        const tags = this.props.tags;
        //
        // tagsList.forEach((v) => {
        //   tags.push(v.tag_name)
        // });

        this.setState({
          tags,
          tagsList,
        })
      });
  }

  handleClose = (removedTagName) => {

    const removeTag = this.state.tagsList.find(v => v.tag_name === removedTagName);
    const data = {
      tagId: removeTag.tag_id,
      token: this.props.token,
    };

    const tags = this.state.tags.filter(tag => tag !== removedTagName);
    const tagsList = this.state.tagsList.filter(tag => tag.tag_name !== removedTagName);

    this.props.dispatch({ type: 'tag/deleteCustomTag', payload: data })
      .then(() => {

      });

    this.setState({ tags, tagsList });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
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
        tags,
        inputVisible: false,
        inputValue: '',
      }))

  };

  saveInputRef = input => this.input = input;

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        <span style={{ fontSize: '16px' }}>标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "5px" }}/>
        <div>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable={true} style={{ marginBottom: "5px" }}
                   afterClose={() => this.handleClose(tag)}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus"/> 新标签
            </Tag>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tagsList: state.tag.tags,
    tags: state.tag.tagNames,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(TagPage);
