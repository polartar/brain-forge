import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Tabs, Row } from 'antd'
import { filter, chunk } from 'lodash'
import { FileInfo } from 'components'
import { encodePathURL } from 'utils/analyses'
import VolumeViewer from './VolumeViewer'
import OutputFileTree from './OutputFileTree'

const { TabPane } = Tabs

export default class SPMGLMLevel1Result extends Component {
  static propTypes = {
    token: PropTypes.string,
    data: PropTypes.shape({
      figures: PropTypes.array,
      out_dir: PropTypes.string,
      save_path: PropTypes.string,
      all_files: PropTypes.array,
    }),
    dataFile: PropTypes.object,
  }

  get matrixFigures() {
    const { data } = this.props
    return filter(data.figures, figure => figure.indexOf('DesignMatrix') > 0)
  }

  get statFigures() {
    const { data } = this.props
    return filter(data.figures, figure => figure.indexOf('Stat') > 0)
  }

  render() {
    const { dataFile, data, token } = this.props
    const { all_files, out_dir, save_path } = data

    const outDir = out_dir || save_path

    return (
      <div className="analysis-result">
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

          <TabPane tab="Design Matrix" key="design-matrix">
            <Row>
              {this.matrixFigures.map(figure => (
                <Col key={figure} md={12} style={{ marginBottom: 10 }}>
                  <h3>{figure}</h3>
                  <img className="w-100" alt={figure} src={encodePathURL(outDir, figure, token)} />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="Contrasts" key="contrasts">
            {chunk(
              this.statFigures.map(figure => (
                <Col key={figure} md={12} style={{ marginBottom: 10 }}>
                  <img className="w-100" alt={figure} src={encodePathURL(outDir, figure, token)} />
                </Col>
              )),
              2,
            ).map((cols, index) => (
              <Row key={index} gutter={5}>
                {cols}
              </Row>
            ))}
          </TabPane>

          <TabPane tab="Volume Viewer" key="volume-viewer">
            <VolumeViewer data={data} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
