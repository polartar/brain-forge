import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import { FileInfo } from 'components'
import OutputFileTree from './OutputFileTree'
import VolumeViewer from './VolumeViewer'

const { TabPane } = Tabs

const ASLResult = ({ dataFile, data }) => {
  if (!data) return null

  const { all_files } = data

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

        <TabPane tab="Volume Viewer" key="volume-viewer">
          <VolumeViewer data={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}

ASLResult.propTypes = {
  data: PropTypes.shape({
    figures: PropTypes.array,
    all_files: PropTypes.array,
    out_dir: PropTypes.string,
  }),
  dataFile: PropTypes.object,
}

export default ASLResult
