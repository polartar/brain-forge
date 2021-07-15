import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Modal,
  Row,
  Tooltip,
  Typography,
  Upload,
  Table,
  Divider,
} from 'antd'
import { concat, flatten, get, intersectionBy, isEqual, uniqBy, includes, find, map, isEmpty } from 'lodash'
import { AsyncSelect, Select, Option } from 'components'

const { Item: FormItem } = Form
const { Title } = Typography

export default class SearchForm extends Component {
  static propTypes = {
    analysisTypes: PropTypes.array,
    modalities: PropTypes.array,
    protocols: PropTypes.array,
    studies: PropTypes.array,
    tags: PropTypes.array,
    values: PropTypes.object,
    isMobile: PropTypes.bool,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  state = {
    fileData: {
      content: [],
      name: null,
    },
    studies: [],
    showModal: false,
    showAdvancedSearch: false,
  }

  componentWillReceiveProps(nextProps) {
    const { studies } = this.state

    if (!isEqual(this.props.values.tags, nextProps.values.tags)) {
      const { tags, values } = nextProps

      this.props.onChange({
        study: intersectionBy(this.getStudiesInTags(tags, values), studies, 'key').map(study => String(study.key)),
      })
    }
  }

  handleSubmit = () => {
    const { fileData } = this.state
    const payload = {
      subject_sessions:
        fileData.content.length === 0
          ? undefined
          : fileData.content.map(elem => `${elem.subject}/${elem.session}`).join(','),
    }

    this.props.onChange(payload)
    this.props.onSubmit()
  }

  handleReset = () => {
    this.handleFileRemove()
    this.props.onReset()
  }

  handleFileChange = payload => {
    const { file } = payload

    if (file.status === 'removed') {
      return
    }

    const reader = new FileReader()
    reader.onload = async e => {
      const { result } = e.target

      this.setState({
        fileData: {
          content: result
            .split('\n')
            .filter(elem => !!elem)
            .map((elem, id) => ({ id, subject: elem.split('/')[0], session: elem.split('/')[1] })),
          name: file.name,
        },
      })
    }
    reader.readAsText(file)
  }

  handleFileRemove = () => {
    this.setState({ fileData: { content: [], name: null } })
  }

  handleChange = (key, evt) => {
    const value = get(evt, 'target.value') === undefined ? evt : evt.target.value
    this.props.onChange({ [key]: value })
  }

  toggleFileModal = () => {
    const { showModal } = this.state
    this.setState({ showModal: !showModal })
  }

  toggleAdvancedSearch = () => {
    const { showAdvancedSearch } = this.state
    this.setState({ showAdvancedSearch: !showAdvancedSearch })
  }

  parameterSetFilter = data => {
    const { values } = this.props
    const { analysis_type } = values

    if (!analysis_type) {
      return data
    }

    return data.filter(elem => elem.analysis_type === Number(analysis_type))
  }

  renderMissingStudiesError = () => {
    const { tags, values } = this.props
    const { studies } = this.state

    if (this.getStudiesInTags(tags, values).length > studies.length) {
      return (
        <Alert
          type="warning"
          showIcon
          message="There are other studies under this tag that you do not have access to, which are not included in this selection."
        />
      )
    }

    return null
  }

  getStudiesInTags = (tags, values) => {
    return uniqBy(
      flatten(concat(tags.filter(tag => get(values, 'tags', []).includes(String(tag.id))).map(tag => tag.studies))),
      'id',
    ).map(study => ({ key: study.id, label: study.name }))
  }

  get isStudySelected() {
    const { values } = this.props
    return values.study && values.study.length > 0
  }

  listProtocolsByStudy = () => {
    const { values, protocols, studies } = this.props

    return uniqBy(
      flatten(
        concat(
          map(values.study, item =>
            protocols.filter(protocol =>
              includes(
                get(find(studies, study => String(study.id) === item), 'all_protocols', []).map(
                  protocol => protocol.id,
                ),
                protocol.id,
              ),
            ),
          ),
        ),
      ),
    )
  }

  render() {
    const { analysisTypes, modalities, tags, values, isMobile } = this.props
    const { fileData, showModal, showAdvancedSearch } = this.state
    const formItemLayout = {
      labelCol: {
        md: { span: 24 },
        lg: { span: 8 },
      },
      wrapperCol: {
        md: { span: 24 },
        lg: { span: 16 },
      },
    }

    const status = [
      { id: 0, value: 'Ready to run' },
      { id: 1, value: 'Pending' },
      { id: 2, value: 'Complete' },
      { id: 3, value: 'Error' },
    ]

    if (isEmpty(values.study) || isEmpty(this.listProtocolsByStudy())) {
      values.protocol = []
    }

    return (
      <React.Fragment>
        <Card>
          <Row gutter={24}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Title level={4}>Basic Search</Title>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Studies" {...formItemLayout}>
                <AsyncSelect
                  placeholder="Studies"
                  fetchUrl={{ base: '/data-directory-filter/study/' }}
                  searchByDefault
                  mode="multiple"
                  value={values.study}
                  onChange={evt => this.handleChange('study', evt)}
                  onSetData={studies => this.setState({ studies })}
                />
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Modality" {...formItemLayout}>
                <Select
                  placeholder="Modality"
                  className="w-100"
                  allowClear
                  value={values.modality}
                  onChange={evt => this.handleChange('modality', evt)}
                >
                  {modalities.map(modality => (
                    <Option key={modality.id}>{modality.full_name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Protocol" {...formItemLayout}>
                <Select
                  placeholder="Protocol"
                  disabled={!this.isStudySelected}
                  showSearch
                  allowClear
                  className="w-100"
                  value={values.protocol}
                  onChange={evt => this.handleChange('protocol', evt)}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.listProtocolsByStudy().map(protocol => (
                    <Option key={protocol.id}>{protocol.full_name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Subject" {...formItemLayout}>
                <AsyncSelect
                  placeholder="Subject"
                  fetchUrl={{ base: '/data-directory-filter/subject/' }}
                  value={values.subject}
                  onChange={evt => this.handleChange('subject', evt)}
                />
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Series" {...formItemLayout}>
                <Input placeholder="Series" value={values.series} onChange={evt => this.handleChange('series', evt)} />
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Status" {...formItemLayout}>
                <Select
                  placeholder="Status"
                  className="w-100"
                  allowClear
                  value={values.status}
                  onChange={evt => this.handleChange('status', evt)}
                >
                  {status.map(option => (
                    <Option key={option.id}>{option.value}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Parameter Set" {...formItemLayout}>
                <AsyncSelect
                  placeholder="Parameter Set"
                  fetchUrl={{ base: '/data-directory-filter/parameterset/' }}
                  filter={this.parameterSetFilter}
                  searchByDefault
                  value={values.parameter_set}
                  onChange={evt => this.handleChange('parameter_set', evt)}
                />
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="DataFile" {...formItemLayout}>
                <Input placeholder="DataFile" value={values.name} onChange={evt => this.handleChange('name', evt)} />
              </FormItem>
            </Col>

            <Col xs={12} sm={8}>
              <FormItem label="Source" {...formItemLayout}>
                <Select
                  placeholder="Source"
                  className="w-100"
                  allowClear
                  value={values.source}
                  onChange={evt => this.handleChange('source', evt)}
                >
                  <Option key={0}>Uploaded</Option>
                  <Option key={1}>Managed</Option>
                  <Option key={3}>Result</Option>
                </Select>
              </FormItem>
            </Col>

            {this.isStudySelected && (
              <Col xs={12} sm={8}>
                <FormItem label="Subject / Session" {...formItemLayout}>
                  <Upload
                    accept=".txt"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={this.handleFileChange}
                    onRemove={this.handleFileRemove}
                  >
                    <Button>
                      <Icon type="upload" /> Upload
                    </Button>
                  </Upload>
                  {fileData.content.length > 0 && (
                    <Fragment>
                      <Tooltip title={fileData.name}>
                        <Button
                          className="ml-1"
                          icon="file-done"
                          size="small"
                          shape="circle"
                          type="primary"
                          onClick={this.toggleFileModal}
                        />
                      </Tooltip>
                      <Button
                        className="ml-05"
                        icon="close"
                        size="small"
                        shape="circle"
                        type="danger"
                        onClick={this.handleFileRemove}
                      />
                    </Fragment>
                  )}
                </FormItem>
              </Col>
            )}
          </Row>
          {showAdvancedSearch && (
            <Row gutter={24}>
              <Divider />
              <Col span={24} style={{ textAlign: 'center' }}>
                <Title level={4}>Advanced Search</Title>
              </Col>

              <Col xs={12} sm={8}>
                <FormItem label="Site" {...formItemLayout}>
                  <AsyncSelect
                    placeholder="Site"
                    fetchUrl={{ base: '/data-directory-filter/site/' }}
                    searchByDefault
                    value={values.site}
                    onChange={evt => this.handleChange('site', evt)}
                  />
                </FormItem>
              </Col>
              <Col xs={12} sm={8}>
                <FormItem label="Scanner" {...formItemLayout}>
                  <AsyncSelect
                    placeholder="Scanner"
                    fetchUrl={{ base: '/data-directory-filter/scanner/' }}
                    searchByDefault
                    value={values.scanner}
                    onChange={evt => this.handleChange('scanner', evt)}
                  />
                </FormItem>
              </Col>

              <Col xs={12} sm={8}>
                <FormItem label="Session" {...formItemLayout}>
                  <AsyncSelect
                    placeholder="Session"
                    fetchUrl={{ base: '/data-directory-filter/session/' }}
                    value={values.session}
                    onChange={evt => this.handleChange('session', evt)}
                  />
                </FormItem>
              </Col>
              <Col xs={12} sm={8}>
                <FormItem label="User" {...formItemLayout}>
                  <AsyncSelect
                    placeholder="User"
                    fetchUrl={{ base: '/data-directory-filter/user/' }}
                    searchByDefault
                    value={values.user}
                    onChange={evt => this.handleChange('user', evt)}
                  />
                </FormItem>
              </Col>

              <Col xs={12} sm={8}>
                <FormItem label="Analysis Type" {...formItemLayout}>
                  <Select
                    placeholder="Analysis Type"
                    className="w-100"
                    allowClear
                    value={values.analysis_type}
                    onChange={evt => this.handleChange('analysis_type', evt)}
                  >
                    {analysisTypes.map(analysisType => (
                      <Option key={analysisType.id}>{analysisType.name}</Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              <Col xs={12} sm={8}>
                <FormItem label="PI" {...formItemLayout}>
                  <AsyncSelect
                    placeholder="PI"
                    fetchUrl={{ base: '/data-directory-filter/pi/' }}
                    searchByDefault
                    value={values.pi}
                    onChange={evt => this.handleChange('pi', evt)}
                  />
                </FormItem>
              </Col>

              {tags.length > 0 && (
                <Col xs={12} sm={8}>
                  <FormItem label="Tags" {...formItemLayout}>
                    <Select
                      placeholder="Tags"
                      mode="multiple"
                      className="w-100"
                      allowClear
                      value={values.tags}
                      onChange={evt => this.handleChange('tags', evt)}
                    >
                      {tags.map(tag => (
                        <Option key={tag.id}>{tag.label}</Option>
                      ))}
                    </Select>
                    {this.renderMissingStudiesError()}
                  </FormItem>
                </Col>
              )}
            </Row>
          )}
          <Row gutter={24}>
            {isMobile ? (
              <Fragment>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button type="link" onClick={this.toggleAdvancedSearch}>
                    {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
                  </Button>
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    Search
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    Clear
                  </Button>
                </Col>
              </Fragment>
            ) : (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="link" onClick={this.toggleAdvancedSearch}>
                  {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
                </Button>
                <Button type="primary" onClick={this.handleSubmit}>
                  Search
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  Clear
                </Button>
              </Col>
            )}
          </Row>
        </Card>

        <Modal
          visible={showModal}
          footer={null}
          destroyOnClose
          title={fileData.name}
          onOk={this.toggleFileModal}
          onCancel={this.toggleFileModal}
        >
          <Table
            dataSource={fileData.content}
            columns={[
              { title: 'Subject', dataIndex: 'subject', key: 'subject' },
              { title: 'Session', dataIndex: 'session', key: 'session' },
            ]}
            rowKey="id"
            size="small"
            pagination={false}
            bordered
          />
        </Modal>
      </React.Fragment>
    )
  }
}
