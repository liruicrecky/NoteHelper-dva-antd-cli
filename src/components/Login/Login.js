import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Alert, Checkbox } from 'antd';

import style from './Login.less';
import LoginLayout from '../layout/LoginSignUpLayout';

const FormItem = Form.Item;

const Login = ({
                 loading,
                 error,
                 dispatch,
                 form: {
                   getFieldDecorator,
                   validateFieldsAndScroll,
                 },
               }) => {
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        dispatch({ type: 'user/auth', payload: values });
      }
    });
  };

  return (
    <LoginLayout>
      <Form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '400px',
        }}
      >
        {error && <Alert message="错误的用户名或密码呀...  :)" type="error"/>}
        <FormItem {...formItemLayout} label="电子邮件">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: '请输入正确的Email地址！',
              }, {
                required: true,
                message: '请输入Email地址！',
              },
            ],
          })(<Input
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            placeholder="Email地址"
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label="密码">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码！',
              },
            ],
          })(<Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
            type="password"
            placeholder="密码"
          />)
          }
        </FormItem>

        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住登录</Checkbox>
          )}
          <a className={style["login-form-forgot"]} href="">忘记密码</a>
          <Button type="primary" size="large" htmlType="submit" loading={loading}
                  className={style["login-form-button"]}>
            登陆
          </Button>
        </FormItem>
      </Form>
    </LoginLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.user.error,
    loading: state.loading.global,
  };
};

export default connect(mapStateToProps)(Form.create()(Login));
