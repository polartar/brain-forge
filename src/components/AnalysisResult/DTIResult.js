import React from 'react'
import PropTypes from 'prop-types'
import { filter, map } from 'lodash'
import { Col, Row, Tabs } from 'antd'
import { FileInfo } from 'components'
import { encodePathURL } from 'utils/analyses'
import OutputFileTree from './OutputFileTree'
import VolumeViewer from './VolumeViewer'

const { TabPane } = Tabs

const DTIResult = ({ dataFile, data, token }) => {
  if (!data) return null

  const { all_files, figures, out_dir, save_path } = data
  const outDir = out_dir || save_path
  const eddyFigures = filter(figures, figure => figure.includes('eddy'))
  const tbssFigures = filter(figures, figure => figure.includes('tbss'))

  return (
    <div className="analysis-result section">
      <Tabs animated={false}>
        <TabPane tab="Metadata" key="meta-data">
          <div className="w-50">
            <FileInfo dataFile={dataFile} />
          </div>
        </TabPane>
        <TabPane tab="Output" key="output">
          <div className="w-75">
            <Tabs tabPosition="left">
              <TabPane tab="Files" key="output-files">
                <div className="w-33 mx-auto text-left">
                  <OutputFileTree files={all_files} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab="QA Figures" key="qa-figures">
          <Row gutter={16}>
            {map(eddyFigures, figure => (
              <Col key={figure} md={12} style={{ marginBottom: '10px' }}>
                <img className="w-100" alt={figure} src={encodePathURL(outDir, figure, token)} />
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Registered DTI Scalar Images" key="dti-scalar">
          <Row gutter={16}>
            {map(tbssFigures, figure => (
              <Col key={figure} style={{ marginBottom: '10px' }}>
                <img className="w-100" alt={figure} src={encodePathURL(outDir, figure, token)} />
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Volume Viewer" key="volume-viewer">
          <VolumeViewer data={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}

DTIResult.propTypes = {
  token: PropTypes.string,
  data: PropTypes.object,
  dataFile: PropTypes.object,
}

export default DTIResult
