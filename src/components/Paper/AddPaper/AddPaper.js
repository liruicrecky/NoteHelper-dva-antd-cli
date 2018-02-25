import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Alert, Select, DatePicker } from 'antd';

import FormLayout from '../../layout/LoginSignUpLayout';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AddPaper extends Component {

  state = {
    publicTags: [],
    selectTagsChildren: [],
    selectTags: "",
  };

  componentDidMount() {

    // get tags
    const data = {
      token: this.props.token,
    };

    this.props.dispatch({ type: 'tag/fetchTag', payload: data })
      .then(() => {
        const publicTags = this.props.publicTags;
        const publicTagNames = this.props.publicTagNames;
        const selectTagsChildren = [];

        publicTagNames.forEach((v) => {
          selectTagsChildren.push(<Option key={v}>{v}</Option>);
        });

        this.setState({
          publicTags,
          selectTagsChildren,
        })
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const tags = this.state.publicTags;
    const selectTag = tags.find((v) => v.tag_name === this.state.selectTags);

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }

      values.token = this.props.token;
      values.list = [selectTag.tag_id];

      this.props.dispatch({
        type: 'paper/addNewPaper', payload: values
      })
    });
  };

  selectHandleChange = (value) => {
    this.setState({
      selectTags: value,
    });
  };

  render() {

    const { loading, error, dispatch, token } = this.props;
    const { form: { getFieldDecorator, validateFieldsAndScroll, getFieldValue } } = this.props;

    const { selectTagsChildren } = this.state;

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

    const checkNum = (rule, value, callback) => {
      if (value) {
        if (!/^[0-9]*$/.test(value)) {
          callback('请输入数字！');
        }
        callback()
      } else {
        callback();
      }
    };

    const checkPaperPage = (rule, value, callback) => {
      if (value) {
        if (!/^\d+-\d+$/.test(value)) {
          callback('请按有效格式输入！');
        }
        const nums = value.split("-");
        if (nums[0] >= nums[1]) {
          callback('尾页怎么能比开始页数小呢！');
        }
        callback()
      } else {
        callback();
      }
    };

    return (
      <FormLayout>
        <Form
          onSubmit={this.handleSubmit}
          style={{
            maxWidth: '400px',
          }}
        >
          {error && <Alert message="发生错误了啊...请重试  :)" type="error"/>}
          <FormItem {...formItemLayout} label="文献标题">
            {getFieldDecorator('docTitle', {
              rules: [
                {
                  required: true,
                  message: '请输入文献标题！',
                },
              ],
            })(<Input
              prefix={<Icon type="file" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="Paper Title"
            />)}
          </FormItem>

          <FormItem {...formItemLayout} label="文献作者">
            {getFieldDecorator('docAuthor', {
              rules: [
                {
                  required: true,
                  message: '请输入文献作者！',
                },
              ],
            })(<Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="Paper Author"
            />)}
          </FormItem>
          <FormItem {...formItemLayout} label="出版社">
            {getFieldDecorator('docPublish', {
              rules: [
                {
                  required: true,
                  message: '请输入文献出版社！',
                }
              ],
            })(<Input
              prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="text"
              placeholder="Paper Publisher"
            />)
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="出版日期"
          >
            {getFieldDecorator('docPubtime', {
              rules: [
                {
                  required: true,
                  message: '请选择出版日期'
                }
              ]
            })(
              <DatePicker placeholder="Select a data"/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="文献类型"
            hasFeedback
          >
            {getFieldDecorator('docType', {
              rules: [
                {
                  required: true,
                  message: '请选择文献类型...'
                }
              ]
            })(
              <Select>
                <Option value="M">图书M</Option>
                <Option value="J">期刊J</Option>
                <Option value="D">论文D</Option>
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="文献分类"
            hasFeedback
          >
            {getFieldDecorator('list', {
              rules: [
                {
                  required: true,
                  message: '请选择文献分类...'
                }
              ]
            })(
              <Select onChange={this.selectHandleChange}>
                {selectTagsChildren}
              </Select>
            )}
          </FormItem>


          <FormItem {...formItemLayout} label="文献卷">
            {getFieldDecorator('volume', {
              rules: [
                {
                  validator: checkNum,
                },
                {
                  required: false,
                }
              ],
            })(<Input
              type="text"
              placeholder="Paper Volume"
            />)
            }
          </FormItem>

          <FormItem {...formItemLayout} label="文献期">
            {getFieldDecorator('number', {
              rules: [
                {
                  required: false,
                },
                {
                  validator: checkNum,
                }
              ],
            })(<Input
              type="text"
              placeholder="Paper Number"
            />)
            }
          </FormItem>

          <FormItem {...formItemLayout} label="文献页">
            {getFieldDecorator('pages', {
              rules: [
                {
                  required: false,
                },
                {
                  validator: checkPaperPage,
                }
              ],
            })(<Input
              type="text"
              placeholder="11-20"
            />)
            }
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="文章摘要"
          >
            {getFieldDecorator('docSummary', {
              rules: [
                {
                  required: true,
                  message: '请输入文献摘要...'
                }
              ]
            })(
              <TextArea
                autosize={{ minRows: 5 }}
                placeholder="Paper Abstract"
              />
            )}
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </FormLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    publicTags: state.tag.publicTags,
    publicTagNames: state.tag.publicTagNames,
    token: state.user.account.token,
    error: state.paper.error,
    loading: state.loading.global,
  };
};

export default connect(mapStateToProps)(Form.create()(AddPaper));
