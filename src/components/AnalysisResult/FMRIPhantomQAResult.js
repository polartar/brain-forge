import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Row, Tabs, Typography } from 'antd'
import { FileInfo } from 'components'
import { encodePathURL } from 'utils/analyses'
import OutputFileTree from './OutputFileTree'

const { TabPane } = Tabs
const { Text } = Typography

function formatNumber(num) {
  return (Math.round(num * 100) / 100).toFixed(2)
}

const FMRIPhantomQAResult = ({ data, dataFile, token }) => {
  if (!data) return null

  const { all_files, figure_lookup, report, out_dir, save_path } = data
  const outDir = out_dir || save_path

  return (
    <div className="analysis-result">
      <Tabs animated={false}>
        <TabPane tab="Metadata" key="meta-data">
          <div className="w-50">
            <FileInfo dataFile={dataFile} />
          </div>
        </TabPane>

        <TabPane tab="Report" key="report">
          <div className="w-33 mx-auto text-left">
            <Row>
              <Text>Slice: {get(report, 'slice')}</Text>
            </Row>
            <Row>
              <Text>Signal: {formatNumber(get(report, 'signal'))}</Text>
            </Row>
            <Row>
              <Text>Signal P2P (%): {formatNumber(get(report, 'signal_p2p (%)'))}</Text>
            </Row>
            <Row>
              <Text>SNR: {formatNumber(get(report, 'snr'))}</Text>
            </Row>
            <Row>
              <Text>Ghost (%): {formatNumber(get(report, 'ghost (%)'))}</Text>
            </Row>
          </div>
        </TabPane>

        <TabPane tab="Output" key="output">
          <div className="w-33 mx-auto text-left">
            <OutputFileTree files={all_files} />
          </div>
        </TabPane>

        <TabPane tab="Figures" key="figures">
          <div key="figures-div" className="mt-1">
            <Tabs defaultActiveKey="Montage" tabPosition="left" animated={false}>
              <TabPane tab="Montage" key="montage">
                <Tabs defaultActiveKey="Mean Signal" tabPosition="top" animated={false}>
                  <TabPane tab="Mean Signal" key="mean_signal_montage">
                    <img
                      className="w-100"
                      id="mean_signal_montage"
                      alt="Mean signal montage"
                      src={encodePathURL(outDir, figure_lookup['mean_signal_montage'], token)}
                    />
                  </TabPane>
                  <TabPane tab="Min - Mean Signal" key="min_mean_signal_montage">
                    <img
                      className="w-100"
                      id="min_mean_signal_montage"
                      alt="Min - mean signal montage"
                      src={encodePathURL(outDir, figure_lookup['min_mean_signal_montage'], token)}
                    />
                  </TabPane>
                  <TabPane tab="Standard Deviation" key="std_dev_montage">
                    <img
                      className="w-100"
                      id="std_dev_montage"
                      alt="Standard deviation montage"
                      src={encodePathURL(outDir, figure_lookup['std_dev_montage'], token)}
                    />
                  </TabPane>
                  <TabPane tab="Temporal SNR" key="temporal_snr_montage">
                    <img
                      className="w-100"
                      id="temporal_snr_montage"
                      alt="Temporal SNR montage"
                      src={encodePathURL(outDir, figure_lookup['temporal_snr_montage'], token)}
                    />
                  </TabPane>
                </Tabs>
              </TabPane>
              <TabPane tab="By Slice" key="by_slice">
                <Tabs defaultActiveKey="Mean Signal" tabPosition="top" animated={false}>
                  <TabPane tab="Mean Signal" key="mean_signal_by_slice">
                    <img
                      className="w-100"
                      id="mean_signal_by_slice"
                      alt="Mean signal by slice"
                      src={encodePathURL(outDir, figure_lookup['mean_signal_by_slice'], token)}
                    />
                  </TabPane>
                  <TabPane tab="Signal P2P" key="signal_p2p_by_slice">
                    <img
                      className="w-100"
                      id="signal_p2p_by_slice"
                      alt="Signal P2P by slice"
                      src={encodePathURL(outDir, figure_lookup['signal_p2p_by_slice'], token)}
                    />
                  </TabPane>
                  <TabPane tab="SNR" key="snr_by_slice">
                    <img
                      className="w-100"
                      id="snr_by_slice"
                      alt="SNR by slice"
                      src={encodePathURL(outDir, figure_lookup['snr_by_slice'], token)}
                    />
                  </TabPane>
                  <TabPane tab="Ghost" key="ghost_by_slice">
                    <img
                      className="w-100"
                      id="ghost_by_slice"
                      alt="Ghost level by slice"
                      src={encodePathURL(outDir, figure_lookup['ghost_by_slice'], token)}
                    />
                  </TabPane>
                </Tabs>
              </TabPane>
              <TabPane tab="By Time" key="by_time">
                <Tabs defaultActiveKey="Mean Signal" tabPosition="top" animated={false}>
                  <TabPane tab="Mean Signal" key="mean_signal_by_time">
                    <img
                      className="w-100"
                      id="mean_signal_by_time"
                      alt="Mean signal by time"
                      src={encodePathURL(outDir, figure_lookup['mean_signal_by_time'], token)}
                    />
                  </TabPane>
                  <TabPane tab="SNR" key="snr_by_time">
                    <img
                      className="w-100"
                      id="snr_by_time"
                      alt="SNR by time"
                      src={encodePathURL(outDir, figure_lookup['snr_by_time'], token)}
                    />
                  </TabPane>
                  <TabPane tab="Ghost" key="ghost_by_time">
                    <img
                      className="w-100"
                      id="ghost_by_time"
                      alt="Ghost level by slice"
                      src={encodePathURL(outDir, figure_lookup['ghost_by_time'], token)}
                    />
                  </TabPane>
                </Tabs>
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

FMRIPhantomQAResult.propTypes = {
  token: PropTypes.string,
  data: PropTypes.shape({
    all_files: PropTypes.array,
    figure_lookup: PropTypes.object,
    report: PropTypes.object,
    out_dir: PropTypes.string,
    save_path: PropTypes.string,
  }),
  dataFile: PropTypes.object,
}

export default FMRIPhantomQAResult
