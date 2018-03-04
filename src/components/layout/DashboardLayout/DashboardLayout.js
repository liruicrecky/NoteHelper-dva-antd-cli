import React from 'react';
import { connect } from 'dva';
import { Layout, Icon } from 'antd';
import { Route, Switch } from 'dva/router';

import styles from './DashboardLayout.less';
import SideMenu from './SideMenu';
import DashboardMain from './DashboardMain';
import DynamicMessage from '../../DynamicMessage/DynamicMessage';
import ModifyPersonalInformationComponent from '../../ModifyPersonalInformation/ModifyPersonalInformation';
import ShowAllPaperContainer from '../../Paper/ShowAllPaper/ShowAllPaperContainer';
import ShowMyFollowPaperContainer from '../../Paper/ShowMyFollowPaper/ShowMyFollowPaperContainer';
import PaperDetail from '../../Paper/PaperDetail/PaperDetail';
import AddPaper from '../../Paper/AddPaper/AddPaperContainer';

const { Header, Content } = Layout;

class DashboardLayout extends React.Component {

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <SideMenu collapsed={this.state.collapsed}
                  name={this.props.account.name}
                  location={this.props.location} />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: '90vh' }}>

            <Switch>
              <Route path="/dashboard/dynamicMessage" component={DynamicMessage}/>
              <Route path="/dashboard/modifyPersonalInformation" component={ModifyPersonalInformationComponent}/>
              <Route path="/dashboard/showAllPaper" component={ShowAllPaperContainer}/>
              <Route path="/dashboard/showMyFollowPaper" component={ShowMyFollowPaperContainer}/>
              <Route path="/dashboard/paperDetail/:paperId" component={PaperDetail}/>
              <Route path="/dashboard/addPaper" component={AddPaper}/>
              <Route path="/dashboard/" component={DashboardMain}/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.user.account
  };
};

export default connect(mapStateToProps)(DashboardLayout);
