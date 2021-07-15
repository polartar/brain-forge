import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Tabs, List } from 'antd'
import { FileInfo } from 'components'
import { encodePathURL } from 'utils/analyses'
import OutputFileTree from './OutputFileTree'
import VolumeViewer from './VolumeViewer'

const { TabPane } = Tabs
const { Item } = List

const VBMResult = ({ data, dataFile, token }) => {
  if (!data) return null

  const { all_files, all_subject_figures, summary, qa_summary, qa_subjects, out_dir, save_path } = data
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
              <TabPane tab="Summary" key="output-summary">
                <div className="analysis-result__description text-left">{summary}</div>
              </TabPane>
              <TabPane tab="Files" key="output-files">
                <div className="w-33 mx-auto text-left">
                  <OutputFileTree files={all_files} />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </TabPane>

        <TabPane tab="Quality" key="quality">
          <div className="w-75">
            <Tabs tabPosition="left">
              <TabPane tab="Summary" key="qa-summary">
                <div className="analysis-result__description text-left">{qa_summary}</div>
              </TabPane>

              <TabPane tab="Flagged Subjects" key="qa-flagged-subjects">
                <List>
                  {map(qa_subjects, (corrs, subject) => (
                    <Item key={subject}>
                      {subject}: {corrs}
                    </Item>
                  ))}
                </List>
              </TabPane>
            </Tabs>
          </div>
        </TabPane>

        <TabPane tab="Figures" key="figures">
          {map(all_subject_figures, (subject, ind) => (
            <div key={ind} style={{ marginTop: '1rem' }}>
              <div className="analysis-result__subheading">Subject {ind + 1}</div>
              <Tabs defaultActiveKey="Grey matter" tabPosition="left" animated={false}>
                {map(subject, (something, anat_type) => (
                  <TabPane tab={anat_type} key={anat_type}>
                    <Tabs defaultActiveKey="warped" tabPosition="top" animated={false}>
                      {map(something, (img, pp_type) => (
                        <TabPane tab={pp_type} key={pp_type}>
                          <img id={pp_type} alt={pp_type} src={encodePathURL(outDir, img, token)} />
                        </TabPane>
                      ))}
                    </Tabs>
                  </TabPane>
                ))}
              </Tabs>
            </div>
          ))}
        </TabPane>

        <TabPane tab="Volume Viewer" key="volume-viewer">
          <VolumeViewer data={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}

VBMResult.propTypes = {
  token: PropTypes.string,
  data: PropTypes.shape({
    summary: PropTypes.any,
    all_files: PropTypes.array,
    all_subject_figures: PropTypes.array,
    qa_summary: PropTypes.any,
    qa_subjects: PropTypes.any,
    out_dir: PropTypes.string,
    save_path: PropTypes.string,
  }),
  dataFile: PropTypes.object,
}

export default VBMResult
