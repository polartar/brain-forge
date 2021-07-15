import React from 'react'
import PropTypes from 'prop-types'
import { includes, filter, find, map } from 'lodash'
import { Col, Row, Tabs } from 'antd'
import { FileInfo } from 'components'
import { encodePathURL } from 'utils/analyses'
import OutputFileTree from './OutputFileTree'
import VolumeViewer from './VolumeViewer'

const { TabPane } = Tabs

const FMRI32Result = ({ dataFile, data, token }) => {
  if (!data) return null

  const { all_files, figures, out_dir, save_path } = data
  const outDir = out_dir || save_path
  const alEpiFigures = filter(figures, fig => includes(fig, 'Epi_Motion'))
  const qaRegFigures = filter(figures, fig => includes(fig, 'QAreg'))
  const simpleProcedure = find(figures, fig => includes(fig, 'graph.png'))
  const detailedProcedure = find(figures, fig => includes(fig, 'graph_detailed.png'))

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

        <TabPane tab="AlEpiAnat Figures" key="al-epi-anat-figures">
          <Row>
            {map(alEpiFigures, figure => (
              <Col key={figure} style={{ marginBottom: 10 }}>
                <img className="w-100" alt={figure} src={encodePathURL(outDir, figure, token)} />
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="QAReg Figures" key="qa-reg-figures">
          <Row gutter={16}>
            {map(qaRegFigures, figure => (
              <Col key={figure} md={12} style={{ marginBottom: 10 }}>
                <span>{figure}</span>
                <img className="w-100" alt={figure} src={encodePathURL(outDir, figure, token)} />
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Procedure" key="procedure">
          <Tabs tabPosition="left">
            <TabPane tab="Simple" key="simple">
              <Row>
                <span>{simpleProcedure}</span>
              </Row>
              <Row>
                <img alt={simpleProcedure} src={encodePathURL(outDir, simpleProcedure, token)} />
              </Row>
            </TabPane>
            <TabPane tab="Detailed" key="detailed">
              <span>{detailedProcedure}</span>
              <img className="w-100" alt={detailedProcedure} src={encodePathURL(outDir, detailedProcedure, token)} />
            </TabPane>
          </Tabs>
        </TabPane>

        <TabPane tab="Volume Viewer" key="volume-viewer">
          <VolumeViewer data={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}

FMRI32Result.propTypes = {
  token: PropTypes.string,
  data: PropTypes.shape({
    figures: PropTypes.array,
    all_files: PropTypes.array,
    out_dir: PropTypes.string,
    save_path: PropTypes.string,
  }),
  dataFile: PropTypes.object,
}

export default FMRI32Result
