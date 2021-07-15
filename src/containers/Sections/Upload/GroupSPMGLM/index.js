import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get, map } from 'lodash'
import { Col, Divider, Form, Row } from 'antd'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ANALYSIS_RESULTS, SPM_GLM_DESIGN_TYPES } from 'config/base'
import {
  LIST_ANALYSIS,
  selectAnalysisOptions,
  setAnalysisOption,
  selectAnalyses,
  selectAnalysesStatus,
  selectAnalysis,
  initAnalysisOptions,
  listAnalysis,
} from 'store/modules/analyses'
import { setCurrentFiles } from 'store/modules/datafiles'
import { successAction } from 'utils/state-helpers'
import { Loader, Select, Option } from 'components'
import ContrastsOptionEditor from 'containers/Sections/Upload/SPMGLM/ContrastsOptionEditor'

import SPMMetadataEditor from './SPMMetadataEditor'
import ScansOptionEditor from './ScansOptionEditor'

const { Item: FormItem } = Form
const IMPLEMENTED_DESIGN_TYPES = ['One Sample T-Test', 'Two Sample T-Test']

export const GroupSPMGLMUploadSection = props => {
  const { analysesStatus, analysisOptions, analyses, readOnly } = props

  const [isAnalysesLoaded, setIsAnalysesLoaded] = useState(false)

  useEffect(() => {
    const { analysis } = props

    // Initialize analysis options.
    if (analysis) {
      const analysisOptions = analysis.parameters.analysis.options

      props.initAnalysisOptions(analysisOptions)
      props.setCurrentFiles([analysis.input_file])
    } else {
      props.initAnalysisOptions({
        Contrasts: { value: [] },
        Scans: { value: [] },
        Design_Type: { value: '' },
        Scans_Source: { value: 'datafile' },
      })
    }

    // List Analysis for output select.
    const params = {
      pageSize: 1000,
      status: ANALYSIS_RESULTS.Complete,
    }

    props.listAnalysis({ params })
  }, [])

  useEffect(() => {
    if (analysesStatus === successAction(LIST_ANALYSIS)) {
      setIsAnalysesLoaded(true)
    }
  }, [analysesStatus])

  const handleSetOption = (optionName, parameterName, value) => {
    props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  const isImplementedDesignType = designType => IMPLEMENTED_DESIGN_TYPES.includes(designType)

  const designType = get(analysisOptions, 'Design_Type.value')
  const scansSource = get(analysisOptions, 'Scans_Source.value')

  return (
    <Fragment>
      <Row gutter={24}>
        <Col md={8}>
          <FormItem label="Design Type:">
            <Select
              className="w-100"
              value={designType || undefined}
              disabled={readOnly}
              placeholder="Please select the design type"
              onChange={value => handleSetOption('Design_Type', 'value', value)}
            >
              {map(SPM_GLM_DESIGN_TYPES, design_type => (
                <Option key={design_type} value={design_type} disabled={!isImplementedDesignType(design_type)}>
                  {design_type}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col md={8}>
          <FormItem label="Scans Source:">
            <Select
              className="w-100"
              value={scansSource}
              onSelect={value => handleSetOption('Scans_Source', 'value', value)}
            >
              <Option value="datafile">File</Option>
              <Option value="SPMGLM">SPM GLM L1 Result</Option>
              <Option value="VBM">VBM Result</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>

      {designType && (
        <Fragment>
          <Divider />
          <SPMMetadataEditor />
          {isAnalysesLoaded ? (
            <Fragment>
              <Divider />
              <ScansOptionEditor
                readOnly={readOnly}
                analyses={analyses.results}
                handleSetOption={handleSetOption}
                analysisOptions={analysisOptions}
              />
              <FormItem label="Contrasts">
                <ContrastsOptionEditor readOnly={readOnly} />
              </FormItem>
            </Fragment>
          ) : (
            <Loader />
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

GroupSPMGLMUploadSection.propTypes = {
  analysis: PropTypes.object,
  analyses: PropTypes.object,
  analysesStatus: PropTypes.string,
  analysisOptions: PropTypes.object,
  readOnly: PropTypes.bool,
  setAnalysisOption: PropTypes.func,
  initAnalysisOptions: PropTypes.func,
  listAnalysis: PropTypes.func,
  setCurrentFiles: PropTypes.func,
}

GroupSPMGLMUploadSection.defaultProps = {
  readOnly: false,
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analyses: selectAnalyses,
  analysisOptions: selectAnalysisOptions,
  analysesStatus: selectAnalysesStatus,
})

const actions = {
  setCurrentFiles,
  setAnalysisOption,
  initAnalysisOptions,
  listAnalysis,
}

export default connect(
  selectors,
  actions,
)(GroupSPMGLMUploadSection)
