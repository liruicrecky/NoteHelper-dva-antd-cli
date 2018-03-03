import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Input, Tooltip, Icon, Divider } from 'antd';

const CheckableTag = Tag.CheckableTag;

class TagPage extends Component {
  state = {
    customTags: [],
    customTagNames: [],
    publicTags: [],
    publicTagNames: [],
    inputVisible: false,
    inputValue: '',

    selectedTags: [],
  };

  // load data at first time
  componentDidMount() {
    const data = {
      token: this.props.token,
    };

    this.props.dispatch({ type: 'tag/fetchTag', payload: data })
      .then(() => {
        const customTags = this.props.customTags;
        const customTagNames = this.props.customTagNames;
        const publicTags = this.props.publicTags;
        const publicTagNames = this.props.publicTagNames;

        this.setState({
          customTags,
          customTagNames,
          publicTags,
          publicTagNames,
        })
      });
  }

  handleClose = (removedTagName) => {

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

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
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

  saveInputRef = input => this.input = input;

  // public tag
  publicTagHandleChange(tag, checked) {
    /*const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
      [...selectedTags, tag] :
      selectedTags.filter(t => t !== tag);*/
    const nextSelectedTags = checked ? [tag] : [];

    const tagId = this.state.publicTags.find(v => v.tag_name === tag).tag_id;

    if (checked) {
      this.props.dispatch({
        type: 'paper/fetchPaperByTag',
        payload: {
          tagId: tagId,
          token: this.props.token,
        }
      });
    } else {
      this.props.dispatch({
        type: 'paper/showAllFollowPaper',
        payload: {
          token: this.props.token,
        }
      });
    }

    this.setState({ selectedTags: nextSelectedTags });
  }

  // custom tag
  customTagHandleChange(tag, checked) {
    /*const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
      [...selectedTags, tag] :
      selectedTags.filter(t => t !== tag);*/
    const nextSelectedTags = checked ? [tag] : [];

    const tagId = this.state.customTags.find(v => v.tag_name === tag).tag_id;

    if (checked) {
      this.props.dispatch({
        type: 'paper/fetchPaperByTag',
        payload: {
          tagId: tagId,
          token: this.props.token,
        }
      });
    } else {
      this.props.dispatch({
        type: 'paper/showAllFollowPaper',
        payload: {
          token: this.props.token,
        }
      });
    }

    this.setState({ selectedTags: nextSelectedTags });
  }

  render() {
    const { customTagNames, publicTagNames, inputVisible, inputValue, selectedTags } = this.state;
    return (
      <div>
        <span style={{ fontSize: '16px' }}>公共标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "1vh" }}/>

        <div>
          {publicTagNames.map(tag => (
            <CheckableTag
              key={tag}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={checked => this.publicTagHandleChange(tag, checked)}
            >
              {tag}
            </CheckableTag>
          ))}
        </div>

        <Divider style={{ marginTop: "1vh", marginBottom: "1vh" }}/>
        <span style={{ fontSize: '16px' }}>自定义标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "1vh" }}/>

        <div>
          {customTagNames.map(tag => (
            <CheckableTag
              key={tag}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={checked => this.customTagHandleChange(tag, checked)}
            >
              {tag}
            </CheckableTag>
          ))}
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customTags: state.tag.customTags,
    customTagNames: state.tag.customTagNames,
    publicTags: state.tag.publicTags,
    publicTagNames: state.tag.publicTagNames,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(TagPage);
