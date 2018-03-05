import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Icon } from 'antd';

import AddSinglePaper from './AddSinglePaper';
import AddMultiPaper from './AddMultiPaper';

const TabPane = Tabs.TabPane;

class AddPaperContainer extends Component {


  render() {

    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><Icon type="file-add"/>导入文献</span>} key="1">
          <AddSinglePaper/>
        </TabPane>
       {/* <TabPane tab={<span><Icon type="folder-add"/>批量导入文献</span>} key="2">
          <AddMultiPaper/>
        </TabPane>*/}
      </Tabs>
    )
  }

}

export default connect()(AddPaperContainer);
