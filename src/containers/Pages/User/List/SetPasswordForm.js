import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Button, Form, Col, Row, Input, Icon, notification } from 'antd'

import validators from 'components/Forms/validators'

const FormItem = Form.Item

export const SetPasswordForm = props => {
  const { userSelected, form, onClose } = props

  const handleSubmit = event => {
    event.preventDefault()

    form.validateFields((error, value) => {
      if (error) {
        return
      }

      axios
        .patch(`/auth/user/${userSelected.id}/`, value)
        .then(() => {
          notification['success']({
            message: `Successfully set password for user ${userSelected.username}`,
          })
          onClose()
        })
        .catch(() => {
          notification['error']({
            message: `Failed to set password for user ${userSelected.username}`,
          })
        })
    })
  }

  const { getFieldDecorator } = form

  return (
    <Form>
      <Row>
        <Col>
          <FormItem>
            {getFieldDecorator('password', validators.password)(
              <Input
                name="password"
                type="password"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
              />,
            )}
          </FormItem>
        </Col>
      </Row>
      <div style={{ marginBottom: 10 }} />
      <Row>
        <Col style={{ textAlign: 'right' }} xs={24}>
          <Button name="submit" type="primary" icon="save" htmlType="submit" onClick={handleSubmit}>
            Save
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button name="close" icon="close" htmlType="submit" onClick={() => onClose()}>
            Canel
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

SetPasswordForm.propTypes = {
  userSelected: PropTypes.object,
  form: PropTypes.object,
  onClose: PropTypes.func,
}

const SetPasswordFormWrapper = Form.create()(SetPasswordForm)

export default SetPasswordFormWrapper
