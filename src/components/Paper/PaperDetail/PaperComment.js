import React, { Component } from 'react';
import {
  List, Button, Input, Icon, Popconfirm
} from 'antd';

import styles from './PaperDetail.less';
import {getTime} from '../../../utils/helper';

const { TextArea } = Input;

class PaperComment extends Component {

  render() {

    const { loading, comments } = this.props;


    const IconText = ({ type, text, m_id }) => (
      <Popconfirm title="你确认要删除此条评论吗？"
                  onConfirm={this.props.deleteComment.bind(this, m_id)}
                  okText="确认"
                  cancelText="取消">
       <span>
        <Icon type={type} style={{ marginRight: 8 }}/>
         {text}
      </span>
      </Popconfirm>
    );

    return (
      <div>
        <List
          header={<div className={styles["paper-sub-title"]}>评论</div>}
          className={styles["loadmore-list"]}
          loading={loading}
          itemLayout="vertical"
          loadMore={this.props.loadMore}
          dataSource={comments}
          size="small"
          renderItem={item => (
            <List.Item
              key={item.user_id}
              actions={[<IconText type="delete" text="删除" m_id={item.m_id}/>]}
            >
              <List.Item.Meta
                /*avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}*/
                title={item.name}
                description={getTime(item.m_time)}
              />
              {item.m_content}
            </List.Item>
          )}
        />
        <TextArea
          autosize={{ minRows: 5 }}
          placeholder="评论一下吧！"
          onChange={this.props.textAreaOnChange}
        />
        <Button
          type="primary"
          className={styles["button-post"]}
          onClick={this.props.onHandleCommentPost.bind(this)}
        >评论</Button>
      </div>
    )
  }
}

export default PaperComment;
