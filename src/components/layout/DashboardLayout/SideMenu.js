import React, { Component } from 'react';
import { connect } from 'dva';
import { NavLink, withRouter } from 'dva/router';
import { Layout, Menu, Icon, Badge } from 'antd';
import PropTypes from 'prop-types';

import styles from './DashboardLayout.less';

const { Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;


class SideMenu extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired
  };

  render() {
    const { location, name, dynamicMessageNum } = this.props;
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        style={{ height: "200px", background: '#fff' }}
      >
        <div className={styles["side-username"]}>
          <span>{name}</span>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="/dashboard/dynamicMessage">
            <NavLink to="/dashboard/dynamicMessage">
              <Icon type="notification"/>
              <Badge
                count={dynamicMessageNum}
                showZero={true}
                offset={[0, 10]}
              >
                <span>动态消息</span>
              </Badge>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/dashboard/modifyPersonalInformation">
            <NavLink to="/dashboard/modifyPersonalInformation">
              <Icon type="edit"/>
              <span>编辑个人账户</span>
            </NavLink>
          </Menu.Item>
          <MenuItemGroup key="g1" title="文献管理">
            <Menu.Item key="/dashboard/uploadPaper">
              <NavLink to="/dashboard/uploadPaper">
                <Icon type="file-add"/>
                <span>新增文献</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/dashboard/showAllPaper">
              <NavLink to="/dashboard/showAllPaper">
                <Icon type="file"/>
                <span>显示全部论文</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/dashboard/showMyFollowPaper">
              <NavLink to="/dashboard/showMyFollowPaper">
                <Icon type="book"/>
                <span>我关注的论文</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="upload"/>
              <span>我上传的论文</span>
            </Menu.Item>
          </MenuItemGroup>
        </Menu>
      </Sider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dynamicMessageNum: state.user.dynamicMessageNum,
  };
};

export default connect(mapStateToProps)(withRouter(SideMenu));
