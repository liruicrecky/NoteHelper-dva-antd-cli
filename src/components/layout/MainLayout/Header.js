import React from 'react';
import { connect } from 'dva';
import { Menu, Button, Input, Icon, Tooltip, Row, Col } from 'antd';
import { Link } from 'dva/router';

import style from './Header.less';
import Logo from '../../../assets/logo.png';

const Search = Input.Search;


const Header = ({ location, loading, dispatch, isLogin, account, inDashboard }) => {

  const handleClickLogOut = (e) => {
    e.preventDefault();
    dispatch({ type: 'user/logout' });
  };

  const notLogin = () => {
    return (
      <Menu
        mode="horizontal"
        className={style["menu"]}
      >
        <Menu.Item key="login">
          <Link to="/login">
            <Button className={style["margin-right"]}>立即登录</Button>
          </Link>
        </Menu.Item>
        <Menu.Item key="signUp">
          <Link to="/signUp">
            <Button type="primary">免费注册</Button>
          </Link>
        </Menu.Item>
      </Menu>
    )
  };

  const login = () => {
    return (
      <Menu
        mode="horizontal"
        className={style["menu"]}
      >
        <Menu.Item key="/dashboard">
          <Link to="/dashboard">
            <Tooltip title="我的主页">
              <Icon type="dashboard" style={{ fontSize: 20, color: 'rgba(0,0,0,.25)', marginRight: '1vw' }}/>
              <span style={{ marginRight: '1vw', color: 'rgba(0,0,0,.25)' }}>我的主页</span>
            </Tooltip>
          </Link>
        </Menu.Item>
        <Menu.Item key="/logout">
          <div className={style.user}>
            <span>您好, <em className={style.username}>{account.name} !</em></span>
            <Button icon="logout" type="primary" loading={loading} size="small"
                    onClick={handleClickLogOut}>注销</Button>
          </div>
        </Menu.Item>
      </Menu>
    )
  };

  const logoImg = {
    backgroundImage: 'url(' + Logo + ')',
    backgroundSize: '100% 100%',
  };

  const searchPaper = (value) => {
    const data = {
      keyword: value,
      token: account.token,
    };

    dispatch({
      type: 'paper/searchPaperByKeyword',
      payload: data,
    })
  };

  return (
    <div>
      <Row>
        <Col span={3}>
          <Link to="/">
            <div className={style.logo} style={logoImg}/>
          </Link>
        </Col>
        <Col span={2}>
          <Menu
            mode="horizontal"
            className={style["menu"]}
          >
            <Menu.Item key="/"><Link to="/">主页</Link></Menu.Item>
          </Menu>
        </Col>
        <Col span={11}>
          {inDashboard &&
          <Search
            style={{ width: "45vw", marginTop: "20px" }}
            placeholder="试试搜索一下吧...  :)"
            onSearch={searchPaper}
            enterButton
          />
          }
        </Col>
        <Col span={8}>
          {isLogin ? login() : notLogin()}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLogin: state.user.isLogin,
    account: state.user.account,
    inDashboard: state.user.inDashboard,
    loading: state.loading.global,
  };
};

export default connect(mapStateToProps)(Header);
