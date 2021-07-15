import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Button, Col, Form, Row, Radio, Input } from 'antd'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { find, flatten, get, map } from 'lodash'
import { selectAnalysisOptions, setAnalysisOption } from 'store/modules/analyses'
import { setCurrentFiles } from 'store/modules/datafiles'
import { Loader, MetadataEditor } from 'components'

const { Item: FormItem } = Form
const DATAFILE_PARENTS = ['site', 'pi', 'study', 'scanner', 'subject', 'session', 'series', 'datafile']

export const SPMMetadataEditor = props => {
  let axiosCancelSource
  const [targetGroupScan, setTargetGroupScan] = useState(null)
  const [metadata, setMetadata] = useState({})
  const [loadingScans, setLoadingScans] = useState(false)
  const [targetMetaColumn, setTargetMetaColumn] = useState(null)
  const [targetFieldSearch, setTargetFieldSearch] = useState('datafile')
  const [targetFileName, setTargetFileName] = useState(null)

  useEffect(() => {
    axiosCancelSource = axios.CancelToken.source()
  })

  const getDataFile = params => {
    return axios.get('data-file/', { params, cancelToken: axiosCancelSource.token })
  }

  const getAnalysisOutput = params => {
    return axios.get('analysis-output/', { params, cancelToken: axiosCancelSource.token })
  }

  const handleSetOption = (optionName, parameterName, value) => {
    props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  const handleCreateGroup = () => {
    const { analysisOptions } = props

    const scansSource = get(analysisOptions, 'Scans_Source.value')
    const data = get(metadata, 'result')
    const fileSubjects = map(data, targetMetaColumn)
    setLoadingScans(true)

    // Send all the file search requests.
    // Wait for the response and process at the same time.
    if (scansSource === 'datafile') {
      const axiosRequests = map(fileSubjects, subject => getDataFile({ files: subject, pageSize: 1000 }))

      axios.all(axiosRequests).then(
        axios.spread((...args) => {
          const argsData = map(args, 'data')
          const argsFiles = flatten(argsData)

          handleSetOption(targetGroupScan, 'value', argsFiles)
          props.setCurrentFiles(argsFiles)

          setLoadingScans(false)
        }),
      )
    } else {
      const axiosRequests = map(fileSubjects, subject =>
        getAnalysisOutput({ [targetFieldSearch]: subject, all_files: targetFileName }),
      )

      axios.all(axiosRequests).then(
        axios.spread((...args) => {
          const argsData = map(args, 'data')
          const argsAnalyses = flatten(argsData)

          // Set initial value for Gropu Scans.
          const outputValues = map(argsAnalyses, analysis => ({
            analysis: analysis.id,
            file: find(analysis.output_result.all_files, file => file.includes(targetFileName)),
          }))
          handleSetOption(targetGroupScan, 'value', flatten(outputValues))

          // Set current files for analysis.
          const argsInputFiles = map(argsAnalyses, 'input_file')
          props.setCurrentFiles(argsInputFiles)

          setLoadingScans(false)
        }),
      )
    }
  }

  const groupScanOptions = () => {
    const { analysisOptions } = props
    const designType = get(analysisOptions, 'Design_Type.value')

    switch (designType) {
      case 'One Sample T-Test':
        return ['Scans']
      case 'Two Sample T-Test':
        return ['Scans_Group1', 'Scans_Group2']
      default:
        return []
    }
  }
  const { analysisOptions } = props

  const designType = get(analysisOptions, 'Design_Type.value')
  const columnTitles = map(get(metadata, 'tableColumns'), 'title')

  if (!designType) {
    return <Loader />
  }

  return (
    <Fragment>
      <MetadataEditor onChange={metadata => setMetadata(metadata)} />
      {get(metadata, 'result') && (
        <Fragment>
          <FormItem label="Please select a target Group Scan">
            <Radio.Group className="w-100" onChange={e => setTargetGroupScan(e.target.value)} value={targetGroupScan}>
              {map(groupScanOptions(), option => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </FormItem>
          {targetGroupScan && (
            <Fragment>
              <FormItem label={`Please select the File Column to create ${targetGroupScan}`}>
                <Radio.Group
                  className="w-100"
                  value={targetMetaColumn}
                  onChange={e => setTargetMetaColumn(e.target.value)}
                >
                  {map(columnTitles, option => (
                    <Radio key={option} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </FormItem>
              {targetMetaColumn && (
                <Fragment>
                  <FormItem label={`Please select the level to search for ${targetMetaColumn}`}>
                    <Radio.Group
                      className="w-100"
                      value={targetFieldSearch}
                      onChange={e => setTargetFieldSearch(e.target.value)}
                    >
                      {map(DATAFILE_PARENTS, option => (
                        <Radio key={option} value={option}>
                          {option}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </FormItem>
                  {targetFieldSearch !== 'datafile' && (
                    <FormItem label={`Please type the target datafile name in ${targetFieldSearch}`}>
                      <Input
                        value={targetFileName}
                        placeholder="Please input target datafile name"
                        onChange={evt => setTargetFileName(evt.target.value)}
                      />
                    </FormItem>
                  )}
                </Fragment>
              )}
            </Fragment>
          )}
          <Row>
            <Col md={8}>
              <Button
                className="w-100"
                disabled={!targetGroupScan || !targetMetaColumn || loadingScans}
                onClick={handleCreateGroup}
              >
                {loadingScans ? `Creating ${targetGroupScan} ...` : `Create ${targetGroupScan}`}
              </Button>
            </Col>
          </Row>
        </Fragment>
      )}
    </Fragment>
  )
}

const selectors = createStructuredSelector({
  analysisOptions: selectAnalysisOptions,
})

const actions = {
  setCurrentFiles,
  setAnalysisOption,
}

SPMMetadataEditor.propTypes = {
  analysisOptions: PropTypes.object,
  readOnly: PropTypes.bool,
  setAnalysisOption: PropTypes.func,
  setCurrentFiles: PropTypes.func,
}

SPMMetadataEditor.defaultProps = {
  readOnly: false,
}

export default connect(
  selectors,
  actions,
)(SPMMetadataEditor)
