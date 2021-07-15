import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card, Table, Switch } from 'antd'
import { selectSitesStatus } from 'store/modules/sites'
import { listMiscFile, uploadFiles, selectMiscFile, selectDataFilesStatus, UPLOAD_FILES } from 'store/modules/datafiles'
import { PageLayout } from 'containers/Layouts'
import { successAction } from 'utils/state-helpers'

import MiscFileUpload from './MiscFileUpload'
import DefaultFileUpload from './DefaultFileUpload'

export class DataFilePage extends Component {
  static propTypes = {
    miscFile: PropTypes.array,
    status: PropTypes.string,
    dataFileStatus: PropTypes.string,
    history: PropTypes.object,
    uploadFiles: PropTypes.func,
    listMiscFile: PropTypes.func,
  }

  state = {
    showMiscFile: false,
  }

  componentWillMount() {
    this.props.listMiscFile()
  }

  componentWillReceiveProps(nextProps) {
    const { dataFileStatus } = this.props

    if (dataFileStatus !== nextProps.dataFileStatus && nextProps.dataFileStatus === successAction(UPLOAD_FILES)) {
      this.props.history.goBack()
    }
  }

  render() {
    const { status, miscFile, dataFileStatus } = this.props

    const { showMiscFile } = this.state

    const miscTableColumns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id,
        defaultSortOrder: 'descend',
      },
      {
        title: 'File',
        dataIndex: 'file',
        key: 'file',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Study name',
        dataIndex: 'study',
        key: 'study',
        render: record => <span>{record.full_name}</span>,
      },
    ]

    const tableMiscFile = {
      width: '80%',
      margin: '0 auto',
    }

    return (
      <PageLayout heading="Upload Data">
        <Card>
          <div style={{ textAlign: 'right' }}>
            <Switch
              checkedChildren="Miscellaneous File"
              unCheckedChildren="DataFile"
              onChange={checked => {
                this.setState({ showMiscFile: checked })
              }}
            />
          </div>
          {showMiscFile ? (
            <MiscFileUpload status={status} dataFileStatus={dataFileStatus} onLoadMiscFile={this.props.listMiscFile} />
          ) : (
            <DefaultFileUpload status={status} dataFileStatus={dataFileStatus} onSubmit={this.props.uploadFiles} />
          )}
          {showMiscFile && miscFile && (
            <div style={tableMiscFile}>
              <Table rowKey="id" dataSource={miscFile} columns={miscTableColumns} />
            </div>
          )}
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  status: selectSitesStatus,
  dataFileStatus: selectDataFilesStatus,
  miscFile: selectMiscFile,
})

const actions = {
  listMiscFile,
  uploadFiles,
}

export default connect(
  selectors,
  actions,
)(DataFilePage)
