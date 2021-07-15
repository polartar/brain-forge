import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input } from 'antd'
import { concat, find, get, uniqBy } from 'lodash'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

class StudyForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    submitting: PropTypes.bool,
    sites: PropTypes.array,
    study: PropTypes.object,
    user: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedSite: get(props.study, 'site.id', null),
    }
  }

  componentDidMount() {
    const { study } = this.props

    if (study) {
      this.props.form.setFieldsValue({
        full_name: get(study, 'full_name'),
        label: get(study, 'label'),
        site: get(study, 'site.id'),
        principal_investigator: get(study, 'principal_investigator.id'),
      })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()

    const { study } = this.props

    this.props.form.validateFields((err, values) => {
      /* istanbul ignore next */
      if (err) {
        return
      }

      this.props.onSubmit({ id: get(study, 'id'), data: values })
    })
  }

  handleSiteChange = site => {
    this.setState({ selectedSite: site })
    this.props.form.resetFields(['principal_investigator'])
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

    const { form, submitting, sites, study, user } = this.props
    const { getFieldDecorator } = form
    const { selectedSite } = this.state

    let availablePIs = []

    if (selectedSite && user.site_role !== 'Member') {
      availablePIs = get(find(sites, { id: selectedSite }), 'members', [])

      if (study) {
        availablePIs = uniqBy(concat(availablePIs, study.created_by), 'id')
      }
    }

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="Name" extra="Full name of the study">
              {getFieldDecorator('full_name', {
                rules: [{ required: true, message: 'Please input name!' }],
              })(<Input placeholder="Name" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Label" extra="Abbreviation for study, no spaces">
              {getFieldDecorator('label', {
                rules: [{ required: true, message: 'Please input label!' }],
              })(<Input placeholder="Label" />)}
            </FormItem>
          </Col>
          {sites.length > 0 && (
            <Fragment>
              <Col>
                <FormItem {...formItemLayout} label="Site">
                  {getFieldDecorator('site', {
                    rules: [{ required: true, message: 'Please select site!' }],
                  })(
                    <Select name="site" onChange={this.handleSiteChange}>
                      {sites.map(site => (
                        <Option key={site.id} value={site.id}>
                          {site.full_name}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem {...formItemLayout} label="PI">
                  {getFieldDecorator('principal_investigator', {
                    rules: [{ required: true, message: 'Please select principal investigator!' }],
                  })(
                    <Select disabled={availablePIs.length === 0}>
                      {availablePIs.map(pi => (
                        <Option key={pi.id} value={pi.id}>
                          {pi.username}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Fragment>
          )}
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
              {!study ? 'Add' : 'Save'}
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

const WrappedForm = Form.create()(StudyForm)

export default WrappedForm
