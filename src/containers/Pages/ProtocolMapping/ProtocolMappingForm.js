import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Modal } from 'antd'
import { filter, find, get, includes } from 'lodash'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

class ProtocolMappingForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    initialValues: PropTypes.object,
    studies: PropTypes.array,
    protocols: PropTypes.array,
    modalities: PropTypes.array,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
  }

  componentDidMount() {
    const { initialValues } = this.props

    if (initialValues) {
      this.props.form.setFieldsValue({
        study: initialValues.study.id,
        protocol: initialValues.protocol.id,
        modalities: initialValues.modalities.map(modality => modality.id),
      })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()

    const { initialValues } = this.props

    this.props.form.validateFields((err, values) => {
      /* istanbul ignore next */
      if (err) {
        return
      }

      this.props.onSubmit({ id: get(initialValues, 'id'), data: values })
    })
  }

  handleDelete = () => {
    const comp = this
    const { initialValues } = this.props

    Modal.confirm({
      title: `Are you sure want to delete this mapping?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.onDelete(initialValues.id)
      },
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }

    const { form, submitting, studies, protocols, modalities, initialValues } = this.props
    const { getFieldDecorator, getFieldValue } = form

    const selectedStudy = getFieldValue('study')

    const selectedProtocol = getFieldValue('protocol')

    const study = find(studies, study => study.id === selectedStudy)

    const filteredProtocols = filter(protocols, protocol =>
      includes(get(study, 'all_protocols', []).map(protocol => protocol.id), protocol.id),
    )

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem label="Study">
              {getFieldDecorator('study', {
                rules: [{ required: true, message: 'Please select study!' }],
              })(
                <Select>
                  {studies.map(study => (
                    <Option key={study.id} value={study.id}>
                      {study.full_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <FormItem label="Protocol">
              {getFieldDecorator('protocol', {
                rules: [{ required: true, message: 'Please select protocol!' }],
              })(
                <Select
                  disabled={!selectedStudy}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {filteredProtocols.map(protocol => (
                    <Option key={protocol.id} value={protocol.id}>
                      {protocol.full_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <FormItem label="Modalities">
              {getFieldDecorator('modalities', {
                rules: [{ required: true, message: 'Please select modalities!' }],
              })(
                <Select mode="multiple" disabled={!selectedProtocol}>
                  {modalities.map(modality => (
                    <Option key={modality.id} value={modality.id}>
                      {modality.full_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
              Save
            </Button>
            {initialValues && (
              <Button
                className="delete-btn"
                style={{ marginLeft: 8 }}
                type="danger"
                disabled={submitting}
                loading={submitting}
                onClick={this.handleDelete}
              >
                Delete
              </Button>
            )}
            <Button style={{ marginLeft: 8 }} onClick={this.props.onCancel} disabled={submitting}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(ProtocolMappingForm)

export default WrappedForm
