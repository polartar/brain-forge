import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Card } from 'antd'
import cx from 'classnames'
import { AsyncSelect } from 'components'

const { Item: FormItem } = Form

class SubjectSearchForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    studyLabel: PropTypes.string,
    visible: PropTypes.bool,
    onSubmit: PropTypes.func,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
  }

  handleSubmit = e => {
    e.preventDefault()

    const subject = this.props.form.getFieldValue('subject')

    this.props.onSubmit(subject)
  }

  handleReset = () => {
    this.props.onSubmit(null)
    this.props.form.resetFields(['subject'])
    this.props.onToggle()
  }

  render() {
    const { form, studyLabel, visible } = this.props
    const { getFieldDecorator } = form

    return (
      <Form className={cx('subject-search-form', { 'd-none': !visible })} onSubmit={this.handleSubmit}>
        <Card bodyStyle={{ padding: '0.5rem' }}>
          <Row>
            <Col span={24}>
              <FormItem className="mb-05">
                {getFieldDecorator('subject')(
                  <AsyncSelect placeholder="Subject" fetchUrl={{ base: `study/${studyLabel}/subject` }} />,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" size="small">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} size="small" onClick={this.handleReset}>
                Clear
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    )
  }
}

const WrappedSubjectSearchForm = Form.create()(SubjectSearchForm)

export default WrappedSubjectSearchForm
