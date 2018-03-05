import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Alert, Select, DatePicker, message, Divider } from 'antd';
import Moment from 'moment';

import SignUpLayout from '../layout/LoginSignUpLayout';

const FormItem = Form.Item;
const Option = Select.Option;

class ModifyPersonalInformation extends Component {

  componentDidMount() {
    // get user information
    this.props.dispatch({
      type: 'user/fetchUserInformation',
      payload: {
        "token": this.props.token,
      }
    })
  }


  render() {

    const { loading, error, dispatch, userInformation } = this.props;

    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, } = this.props.form;

    const birthday = Moment(userInformation.user_brithday);

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
        if (errors) {
          return;
        }
        dispatch({
          type: 'user/modifyUserInformation',
          payload: values
        }).then(() => {
          if (!this.props.error)
            message.success("修改成功！ ...:)")
        })
      });
    };

    const checkPass = (rule, value, callback) => {
      if (value) {
        if (value.length < 8) {
          callback('密码长度不能小于8位！');
        }
        if (!/^([\d]+[a-zA-Z]+)|([a-zA-Z]+[\d]+)$/.test(value)) {
          return callback('密码必须由数字和字母组成！');
        }
        callback();
      } else {
        callback();
      }
    };

    const checkIdentification = (rule, value, callback) => {
      if (value) {
        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
          return callback('请输入正确的身份证号... ');
        }
        callback();
      } else {
        callback();
      }
    };

    const checkPhone = (rule, value, callback) => {
      if (value) {
        if (!/^1[0-9]{10}$/.test(value)) {
          return callback('请输入正确的手机号... ！');
        }
        callback();
      } else {
        callback();
      }
    };

    const checkConfirmPass = (rule, value, callback) => {
      if (value && value !== getFieldValue('newPass')) {
        callback('两次输入的密码不一样啊...');
      } else {
        callback();
      }
    };

    return (
      <SignUpLayout>
        <Form
          onSubmit={handleSubmit}
          style={{
            maxWidth: '400px',
          }}
        >
          {error && <Alert message="原密码输错了啊...请重试  :)" type="error"/>}
          <FormItem {...formItemLayout} label="电子邮件">
            {getFieldDecorator('email', {
              initialValue: userInformation.email,
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
              disabled
            />)}
          </FormItem>

          <FormItem {...formItemLayout} label="昵称">
            {getFieldDecorator('name', {
              initialValue: userInformation.name,
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="来一个昵称吧！"
            />)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('newPass', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码！',
                },
                {
                  validator: checkPass,
                }
              ],
            })(<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="密码"
            />)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="确认新密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认您输入的新密码！',
                }, {
                  validator: checkConfirmPass,
                }
              ],
            })(<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="确认新密码"
            />)
            }
          </FormItem>

          <FormItem {...formItemLayout} label="身份证号">
            {getFieldDecorator('userIdentity', {
              initialValue: userInformation.user_identity,
              rules: [
                {
                  required: true,
                  message: '请输入身份证号！',
                },
                {
                  validator: checkIdentification,
                }
              ],
            })(<Input
              prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="身份证号"
            />)
            }
          </FormItem>

          <FormItem {...formItemLayout} label="手机号码">
            {getFieldDecorator('userPhone', {
              initialValue: userInformation.user_phone,
              rules: [
                {
                  required: true,
                  message: '请输入手机号码！',
                },
                {
                  validator: checkPhone,
                }
              ],
            })(<Input
              prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="手机号码"
            />)
            }
          </FormItem>

          <FormItem {...formItemLayout} label="居住地址">
            {getFieldDecorator('userAddress', {
              initialValue: userInformation.user_address,
              rules: [
                {
                  required: true,
                  message: '请输入居住地址！',
                }
              ],
            })(<Input
              prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="居住地址"
            />)
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="教育程度"
            hasFeedback
          >
            {getFieldDecorator('userEducation', {
              initialValue: userInformation.user_education,
              rules: [
                {
                  required: true,
                  message: '请选择教育您的教育程度...'
                }
              ]
            })(
              <Select>
                <Option value="本科">本科</Option>
                <Option value="硕士">硕士</Option>
                <Option value="博士">博士</Option>
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="出生日期"
          >
            {getFieldDecorator('userBrithday', {
              initialValue: birthday,
              rules: [
                {
                  required: true,
                  message: '请选择您的出生日期...'
                }
              ]
            })(
              <DatePicker placeholder="选择一个日期"/>
            )}
          </FormItem>

          <Divider/>
          <FormItem {...formItemLayout} label="请输入原密码">
            {getFieldDecorator('oldPass', {
              rules: [
                {
                  required: true,
                  message: '请输入原密码！',
                }
              ],
            })(<Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="旧密码"
            />)
            }
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              确认修改
            </Button>
          </FormItem>
        </Form>
      </SignUpLayout>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    error: state.user.error,
    userInformation: state.user.userInformation,
    token: state.user.account.token,
    loading: state.loading.global,
  };
};

export default connect(mapStateToProps)(Form.create()(ModifyPersonalInformation));
