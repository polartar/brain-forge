import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import { FileInfo } from 'components'
import VolumeViewer from './VolumeViewer'
import OutputFileTree from './OutputFileTree'

const { TabPane } = Tabs

const FreeSurferResult = ({ data, dataFile, pi }) => {
  if (!data) return null

  const { all_files } = data

  return (
    <div className="analysis-result">
      <Tabs animated={false}>
        <TabPane tab="Metadata" key="meta-data">
          <div className="w-50">
            <FileInfo dataFile={dataFile} pi={pi} />
          </div>
        </TabPane>

        <TabPane tab="Output Files" key="files">
          <div className="w-33 mx-auto text-left">
            <OutputFileTree files={all_files} />
          </div>
        </TabPane>

        <TabPane tab="Volume Viewer" key="volume-viewer">
          <VolumeViewer data={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}

FreeSurferResult.propTypes = {
  data: PropTypes.shape({
    summary: PropTypes.any,
    all_files: PropTypes.array,
    stats_files: PropTypes.any,
  }),
  dataFile: PropTypes.object,
  pi: PropTypes.string,
}

export default FreeSurferResult
