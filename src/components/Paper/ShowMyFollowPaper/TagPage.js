import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Input, Tooltip, Icon, Divider } from 'antd';
import { pageSize } from "../../../utils/constant";

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

        const publicTags = this.props.publicTags;
        const publicTagNames = this.props.publicTagNames;

        this.setState({
          publicTags,
          publicTagNames,
        })
      });

    this.props.dispatch({ type: 'tag/fetchCustomTag', payload: data })
      .then(() => {
        const customTags = this.props.customTags;
        const customTagNames = this.props.customTagNames;
        this.setState({
          customTags,
          customTagNames,
        })
      })
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
  tagHandleChange(tag, checked) {
    /*const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
      [...selectedTags, tag] :
      selectedTags.filter(t => t !== tag);*/
    const nextSelectedTags = checked ? [tag] : [];

    if (checked) {
      this.props.dispatch({
        type: 'paper/fetchPaperByTag',
        payload: {
          tagId: tag.tag_id,
          token: this.props.token,
        }
      }).then(() => {
        const papers = this.props.tagPapers;
        this.props.setPapers(papers);
      })
    } else {
      this.props.dispatch({
        type: 'paper/fetchAllFollowPaper',
        payload: {
          token: this.props.token,
          BeginIndex: 0,
          PageSize: pageSize,
        }
      }).then(() => {
        const papers = this.props.papers;
        this.props.setPapers(papers);
      })
    }

    this.setState({ selectedTags: nextSelectedTags });
  }

  render() {
    const { customTagNames,customTags, publicTags, publicTagNames, inputVisible, inputValue, selectedTags } = this.state;
    return (
      <div>
        <span style={{ fontSize: '16px' }}>公共标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "1vh" }}/>

        <div>
          {publicTags.map(tag => (
            < CheckableTag
              key={tag.tag_name}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={checked => this.tagHandleChange(tag, checked)}
              style={{ marginBottom: '1vh' }}
            >
              <div style={{ fontSize: '1.3em' }}>
                {tag.tag_name} | {tag.count}
              </div>
            </CheckableTag>
          ))}
        </div>

        <Divider style={{ marginTop: "1vh", marginBottom: "1vh" }}/>
        <span style={{ fontSize: '16px' }}>自定义标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "1vh" }}/>

        <div>
          {customTags.map(tag => (
            <CheckableTag
              key={tag.tag_name}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={checked => this.tagHandleChange(tag, checked)}
            >
              <div style={{ fontSize: '1.3em' }}>
                {tag.tag_name} | {tag.count}
              </div>
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
    tagPapers: state.paper.tagPapers,
    papers: state.paper.papers,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(TagPage);
