import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Divider } from 'antd';
import { pageSize } from "../../../utils/constant";

const CheckableTag = Tag.CheckableTag;

class ShowAllPaperTagPage extends Component {
  state = {
    publicTags: [],
    publicTagNames: [],
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
  }

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
        type: 'paper/fetchPaperByTagSetTagPapers',
      });
    }

    this.setState({ selectedTags: nextSelectedTags });
  }

  render() {
    const { publicTagNames, selectedTags } = this.state;
    return (
      <div>
        <span style={{ fontSize: '16px' }}>公共标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "5px" }}/>

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

export default connect(mapStateToProps)(ShowAllPaperTagPage);
