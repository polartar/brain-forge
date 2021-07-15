import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button } from 'antd'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

class UserSelectForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    submitting: PropTypes.bool,
    users: PropTypes.array,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  handleSubmit = evt => {
    evt.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.props.onSubmit(values)
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    const { form, users, submitting } = this.props
    const { getFieldDecorator } = form

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="User">
              {getFieldDecorator('user', {
                rules: [{ required: true, message: 'Please select a user' }],
              })(
                <Select name="user">
                  {users.map(({ id, username }) => (
                    <Option key={id} value={id}>
                      {username}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
              Add
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.props.onCancel} disabled={submitting}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(UserSelectForm)

export default WrappedForm
