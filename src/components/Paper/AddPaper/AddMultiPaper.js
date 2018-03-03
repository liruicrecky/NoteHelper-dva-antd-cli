import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input } from 'antd';

import styles from './AddPaper.less';

const { TextArea } = Input;

class AddMultiPaper extends Component {

  state = {
    bibTex: "",
  };

  textAreaOnChange = (e) => {
    this.setState({
      bibTex: e.target.value,
    })
  };

  onHandleMultiPaperPost = (e) => {
    e.preventDefault();
  };

  render() {

    return (
      <div>
        <TextArea
          className={styles.text}
          autosize={{ minRows: 10 }}
          placeholder="请粘贴BibTex！"
          onChange={this.textAreaOnChange}
        />
        <div className={styles["button-div"]}>
          <Button
            className={styles.button}
            onClick={this.onHandleMultiPaperPost}
            size="large"
            type="primary"
          >提交</Button>
        </div>
      </div>
    )
  }
}

export default connect()(AddMultiPaper);
