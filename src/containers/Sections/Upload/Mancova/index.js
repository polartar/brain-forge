import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Alert, Button, Col, Form, Icon, Row } from 'antd'
import { get, map, orderBy } from 'lodash'
import { ANALYSIS_RESULTS, ANALYSIS_TYPES_ID } from 'config/base'
import { listUploadableStudy, selectUploadableStudies, selectSitesStatus } from 'store/modules/sites'
import { initializeCurrentFiles, setAllFiles, setCurrentFiles, updateCurrentFileFields } from 'store/modules/datafiles'
import { selectAnalysisType, selectAnalysis } from 'store/modules/analyses'
import {
  initAnalysisOptions,
  selectAnalysisOptions,
  setAnalysisOption,
  listAnalysis,
  selectAnalyses,
} from 'store/modules/analyses'
import { DefaultUploadSection } from 'containers/Sections/Upload/DefaultUpload'
import { DataFileTree, Loader, Select, Option } from 'components'

const { Item: FormItem } = Form

export class MancovaUploadSection extends DefaultUploadSection {
  static propTypes = {
    analysis: PropTypes.object,
    analysisOptions: PropTypes.object,
    initAnalysisOptions: PropTypes.func,
    setAnalysisOption: PropTypes.func,
    analyses: PropTypes.object,
    listAnalysis: PropTypes.func,
    studies: PropTypes.array,
    status: PropTypes.string,
    sitesStatus: PropTypes.string,
    analysisType: PropTypes.object,
    showSelector: PropTypes.bool,
    listUploadableStudy: PropTypes.func,
    setAllFiles: PropTypes.func,
    setCurrentFiles: PropTypes.func,
    updateCurrentFileFields: PropTypes.func,
    initializeCurrentFiles: PropTypes.func,
  }

  componentWillMount() {
    const { analysis } = this.props

    if (analysis) {
      const analysisOptions = analysis.parameters.analysis.options
      this.props.initAnalysisOptions(analysisOptions)
    } else {
      this.props.initAnalysisOptions({
        ica_parent: { value: 'default' },
      })
    }

    const params = {
      pageSize: 1000,
      status: ANALYSIS_RESULTS.Complete,
      analysis_type: ANALYSIS_TYPES_ID.GICA,
    }

    this.props.listAnalysis({ params })
  }

  handleSetOption = (optionName, parameterName, value) => {
    this.props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  render() {
    const { analysis, analysisOptions, analyses, studies, showSelector, analysisType } = this.props
    const inputFile = get(analysis, 'input_file.id')
    const sortedAnalyses = orderBy(analyses.results, ['id'], ['desc'])

    if (this.loading) {
      return <Loader />
    }

    return (
      <div>
        <Row>
          <Col>
            <FormItem label="Upload a new data:">
              {studies.length > 0 ? (
                <Link to="/data/new/">
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Link>
              ) : (
                <Alert
                  className="mb-1"
                  message="You do not have any studies. To upload data, please create your own study or get study permission from others"
                  type="warning"
                  showIcon
                  banner
                />
              )}
            </FormItem>
          </Col>
          {showSelector && (
            <Col>
              <FormItem label="Or select a previously uploaded/output dataset:">
                <DataFileTree
                  multiple
                  analysisType={analysisType}
                  analysis={analysis}
                  initialValue={inputFile}
                  onChange={this.handleTreeChange}
                  onUpdateFields={this.props.updateCurrentFileFields}
                />
              </FormItem>
            </Col>
          )}
        </Row>
        <FormItem label="Select a previously run Group ICA:">
          {analysisOptions.ica_parent && (
            <Select
              style={{ minWidth: 300 }}
              defaultValue={['default']}
              value={analysisOptions.ica_parent.value || 'default'}
              onChange={value => this.handleSetOption('ica_parent', 'value', value)}
            >
              <Option key={0} value={'default'} style={{ minWidth: 300 }}>
                Select a previous Group ICA
              </Option>
              {sortedAnalyses &&
                map(sortedAnalyses, analysis => (
                  <Option key={analysis.id} value={analysis.id}>
                    {analysis.id} - {analysis.name}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
  studies: selectUploadableStudies,
  sitesStatus: selectSitesStatus,
  analysisOptions: selectAnalysisOptions,
  analyses: selectAnalyses,
})

const actions = {
  initializeCurrentFiles,
  listUploadableStudy,
  setCurrentFiles,
  setAllFiles,
  updateCurrentFileFields,
  initAnalysisOptions,
  setAnalysisOption,
  listAnalysis,
}

export default connect(
  selectors,
  actions,
)(MancovaUploadSection)
