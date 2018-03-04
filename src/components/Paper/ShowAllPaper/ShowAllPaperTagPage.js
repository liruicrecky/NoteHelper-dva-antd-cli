import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Divider } from 'antd';

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

    if (checked) {
      this.props.dispatch({
        type: 'paper/fetchPaperByTag',
        payload: {
          tagId: tag.tag_id,
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
    const { publicTags, selectedTags } = this.state;

    return (
      <div>
        <span style={{ fontSize: '1.4em' }}>公共标签</span>
        <Divider style={{ marginTop: "1px", marginBottom: "1vh" }}/>

        <div>
          {publicTags.map(tag => (
            < CheckableTag
              key={tag.tag_name}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={checked => this.publicTagHandleChange(tag, checked)}
              style={{ marginBottom: '1vh' }}
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
    publicTags: state.tag.publicTags,
    publicTagNames: state.tag.publicTagNames,
    token: state.user.account.token,
  };
};

export default connect(mapStateToProps)(ShowAllPaperTagPage);
