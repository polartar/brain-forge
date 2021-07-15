import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Empty, Table, Row, Col } from 'antd'
import { first, get, last, split } from 'lodash'
import { FileInfo, PapayaViewer, Tabs, TabPane } from 'components'
import { PAPAYA_ALLOWED_FILE_TYPES, UPLOAD_PATH, ARCHIVE_PATH } from 'config/base'

export default class DataFileTab extends Component {
  static propTypes = {
    dataFile: PropTypes.object,
  }

  renderSharedUsers = () => {
    const { dataFile } = this.props
    const colums = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
    ]

    return (
      <div>
        <h2 className="text-center mb-2">Shared Users</h2>
        {dataFile.shared_users.length > 0 ? (
          <Table
            dataSource={dataFile.shared_users}
            columns={colums}
            size="small"
            rowKey="id"
            pagination={false}
            bordered
          />
        ) : (
          <Empty description="No Shared Users" />
        )}
      </div>
    )
  }

  render() {
    const { dataFile } = this.props

    if (!dataFile) return null

    const isManaged = get(dataFile, 'series.is_managed')
    const mediaPath = isManaged ? ARCHIVE_PATH : UPLOAD_PATH
    const dataFilePath = `/${mediaPath}/${dataFile.path}/${first(dataFile.files)}`
    const fileExt = last(split(dataFile.name, '.')).toLowerCase()
    const isPapaya = PAPAYA_ALLOWED_FILE_TYPES.includes(fileExt)

    return (
      <Row>
        <Col>
          <div className="app-page__subheading">{dataFile.name}</div>
          <Card>
            <Tabs>
              <TabPane tab="Data Info" key="data-info">
                <FileInfo dataFile={dataFile} />
              </TabPane>
              <TabPane tab="Shared Users" key="shared-users">
                {this.renderSharedUsers()}
              </TabPane>
              {isPapaya && (
                <TabPane tab="Papaya" key="papaya">
                  <PapayaViewer file={dataFilePath} />
                </TabPane>
              )}
            </Tabs>
          </Card>
        </Col>
      </Row>
    )
  }
}
