import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Row, Col, TreeSelect } from 'antd'
import { filter, isEmpty, uniq } from 'lodash'
import { FileInfo, PapayaViewer } from 'components'
import { encodePathURL } from 'utils/analyses'
import FileTreeBuilder from 'utils/file-tree-builder'

import VolumeViewer from './VolumeViewer'
import OutputFileTree from './OutputFileTree'

const { TabPane } = Tabs
const WMH_MASK_BIN = 'WMH_Mask_bin.nii'

const WMHResult = ({ data, dataFile, token }) => {
  if (!data) return null

  const { all_files, base_image, wmh_mask_vol, out_dir, save_path } = data

  const [baseImage, setBaseImage] = React.useState(base_image)
  const [overlayImage, setOverlayImage] = React.useState(all_files.includes(WMH_MASK_BIN) ? WMH_MASK_BIN : null)
  const [treeData, setTreeData] = React.useState([])

  const outDir = out_dir || save_path
  const baseImagePath = encodePathURL(outDir, baseImage, token)
  const overlayImagePath = overlayImage ? encodePathURL(outDir, overlayImage, token) : ''

  React.useEffect(() => {
    const niiFiles = filter(all_files, file => file.endsWith('.nii'))
    const uniqNiis = uniq(niiFiles)

    if (isEmpty(uniqNiis)) {
      setTreeData([])
    } else {
      const builder = new FileTreeBuilder()
      const treeData = builder.run(uniqNiis)
      setTreeData(treeData)
    }
  }, [])

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
              <TabPane tab="WMH Mask Vol" key="wmh-mask-vol">
                <span>{wmh_mask_vol}</span>
              </TabPane>
              <TabPane tab="Files" key="output-files">
                <div className="w-33 mx-auto text-left">
                  <OutputFileTree files={all_files} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </TabPane>

        <TabPane tab="WMH Mask bin" key="wmh-viewer">
          <Row gutter={12}>
            <Col span={10} offset={1} style={{ textAlign: 'left' }}>
              <Row style={{ marginBottom: 10 }}>
                <strong>Overlay Image</strong>
              </Row>
              <Row>
                <TreeSelect
                  className="w-100"
                  value={overlayImage}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeData}
                  placeholder="Please select Overlay Image"
                  treeDefaultExpandAll
                  onChange={value => setOverlayImage(value)}
                />
              </Row>
            </Col>
            <Col span={10} offset={1} style={{ textAlign: 'left' }}>
              <Row style={{ marginBottom: 10 }}>
                <strong>Base Image</strong>
              </Row>
              <Row>
                <TreeSelect
                  className="w-100"
                  value={baseImage}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={treeData}
                  placeholder="Please select Base Image"
                  treeDefaultExpandAll
                  onChange={value => setBaseImage(value)}
                />
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: 30 }}>
            {overlayImage && <PapayaViewer file={`${overlayImagePath},${baseImagePath}`} />}
          </Row>
        </TabPane>

        <TabPane tab="Volume Viewer" key="volume-viewer">
          <VolumeViewer data={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}

WMHResult.propTypes = {
  token: PropTypes.string,
  dataFile: PropTypes.object,
  data: PropTypes.shape({
    figures: PropTypes.array,
    all_files: PropTypes.array,
    base_image: PropTypes.string,
    wmh_mask_vol: PropTypes.string,
    out_dir: PropTypes.string,
    save_path: PropTypes.string,
  }),
}

export default WMHResult
