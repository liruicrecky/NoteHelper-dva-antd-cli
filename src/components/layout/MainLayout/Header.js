import React from 'react';
import { connect } from 'dva';
import { Menu, Button, Icon, Tooltip, Row, Col } from 'antd';
import { Link } from 'dva/router';

import style from './Header.less'


const Header = ({ location, loading, dispatch, isLogin, account }) => {

  const handleClickLogOut = (e) => {
    e.preventDefault();
    dispatch({ type: 'user/logout' });
  };

  const login = username => {
    return (
      <div>
        <Link to="/dashboard">
          <Tooltip title="我的主页">
            <Icon type="dashboard" style={{ fontSize: 20, color: 'rgba(0,0,0,.25)', marginRight: '1vw' }}/>
            <span style={{ marginRight: '1vw', color: 'rgba(0,0,0,.25)' }}>我的主页</span>
          </Tooltip>
        </Link>
        <div className={style.user}>
                <span>您好, <em className={style.username}>{username} !</em>
            </span>
          <Button icon="logout" type="primary" loading={loading} size="small"
                  onClick={handleClickLogOut}>注销</Button>
        </div>
      </div>
    )
  };

  const notLogin = () => {
    return (
      <div>
        <Link to="/login">
          <Button className={style["margin-right"]}>立即登录</Button>
        </Link>

        <Link to="/signUp">
          <Button type="primary">免费注册</Button>
        </Link>
      </div>
    )
  };

  return (
    <div>
      <Row>
        <Col span={16}>
          <Menu
            mode="horizontal"
            className={style["menu"]}
          >
            <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item>
            <Menu.Item key="archive"><Link to="archive">Archive</Link></Menu.Item>
            <Menu.Item key="about"><Link to="about">About me</Link></Menu.Item>
          </Menu>
        </Col>
        <Col span={8}>
          <div className={style.right}>
            {isLogin ? login(account.name) : notLogin()}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLogin: state.user.isLogin,
    account: state.user.account,
    loading: state.loading.global,
  };
};

export default connect(mapStateToProps)(Header);
