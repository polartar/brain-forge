import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Alert, Button, Col, Form, Icon, Row } from 'antd'
import { get } from 'lodash'
import { MANAGED_SOURCE } from 'config/base'
import {
  listUploadableStudy,
  selectUploadableStudies,
  selectSitesStatus,
  LIST_UPLOADABLE_STUDY,
} from 'store/modules/sites'
import { initializeCurrentFiles, setAllFiles, setCurrentFiles, updateCurrentFileFields } from 'store/modules/datafiles'
import { DataFileTree, Loader } from 'components'
import { selectAnalysisType, selectAnalysis } from 'store/modules/analyses'

const { Item: FormItem } = Form

export class DefaultUploadSection extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    studies: PropTypes.array,
    sitesStatus: PropTypes.string,
    analysisType: PropTypes.object,
    showSelector: PropTypes.bool,
    listUploadableStudy: PropTypes.func,
    setAllFiles: PropTypes.func,
    setCurrentFiles: PropTypes.func,
    updateCurrentFileFields: PropTypes.func,
    initializeCurrentFiles: PropTypes.func,
  }

  static defaultProps = {
    showSelector: true,
  }

  componentWillMount() {
    this.props.listUploadableStudy()
  }

  componentWillUnmount() {
    this.props.initializeCurrentFiles()
  }

  get loading() {
    const { sitesStatus } = this.props

    return sitesStatus === LIST_UPLOADABLE_STUDY
  }

  handleTreeChange = files => {
    this.props.setAllFiles(files)
    this.props.setCurrentFiles(files)
  }

  get isManagedSource() {
    const { analysis } = this.props
    const analysisFileSource = get(analysis, 'input_file.source')

    return analysisFileSource === MANAGED_SOURCE
  }

  render() {
    const { showSelector, studies, analysis, analysisType } = this.props
    const inputFile = get(analysis, 'parameters.analysis.options.files.value')

    if (this.loading) {
      return <Loader />
    }

    return (
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
                message={
                  'You do not have any studies. To upload data, please create your own study or get permission to add data to other studies.'
                }
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
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
  studies: selectUploadableStudies,
  sitesStatus: selectSitesStatus,
})

const actions = {
  initializeCurrentFiles,
  listUploadableStudy,
  setCurrentFiles,
  setAllFiles,
  updateCurrentFileFields,
}

export default connect(
  selectors,
  actions,
)(DefaultUploadSection)
