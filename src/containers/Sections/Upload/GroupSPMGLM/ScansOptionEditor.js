import React from 'react'
import PropTypes from 'prop-types'
import DataFileSelect from 'containers/Sections/Upload/DataFileSelect'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setCurrentFiles, selectCurrentFiles } from 'store/modules/datafiles'
import { find, filter, first, get, isEmpty } from 'lodash'
import { Alert, Col, Form, Row } from 'antd'
import { AnalysisOutputTree } from 'components'
import { ANALYSIS_TYPES_ID } from 'config/base'

const { Item: FormItem } = Form

export const ScansOptionEditor = props => {
  const handleOutputSelect = (scanKey, value) => {
    const { analyses, currentFiles } = props
    const currentFile = first(currentFiles)

    if (!get(currentFile, 'id') && !isEmpty(value)) {
      const selectedAnalysis = find(analyses, { id: first(value).analysis })

      if (selectedAnalysis && selectedAnalysis.input_file) {
        props.setCurrentFiles([selectedAnalysis.input_file])
      }
    }

    props.handleSetOption(scanKey, 'value', value)
  }

  const renderScansSelect = scanKey => {
    const { analysisOptions, analyses, readOnly } = props
    const scansSource = get(analysisOptions, 'Scans_Source.value')
    const scansAnalyses =
      scansSource === 'datafile' ? [] : filter(analyses, { analysis_type: ANALYSIS_TYPES_ID[scansSource] })

    return (
      <FormItem label={scanKey}>
        {scansSource === 'datafile' ? (
          <DataFileSelect
            initialValue={get(analysisOptions, [scanKey, 'value'])}
            handleSelectedFiles={value => props.handleSetOption(scanKey, 'value', value)}
            disabled={readOnly}
            multiple
          />
        ) : isEmpty(scansAnalyses) ? (
          <Alert
            message={`No ${scansSource} Analysis outputs to select`}
            type="warning"
            className="mb-2"
            showIcon
            banner
          />
        ) : (
          <AnalysisOutputTree
            initialValue={get(analysisOptions, [scanKey, 'value'])}
            analyses={scansAnalyses}
            multiple={true}
            onChange={value => {
              handleOutputSelect(scanKey, value)
            }}
          />
        )}
      </FormItem>
    )
  }

  const { analysisOptions } = props
  const designType = get(analysisOptions, 'Design_Type.value')

  switch (designType) {
    case 'One Sample T-Test':
      return (
        <Row>
          <Col md={12}>{renderScansSelect('Scans')}</Col>
        </Row>
      )
    case 'Two Sample T-Test':
      return (
        <Row gutter={16}>
          <Col md={11}>{renderScansSelect('Scans_Group1')}</Col>
          <Col md={11}>{renderScansSelect('Scans_Group2')}</Col>
        </Row>
      )
    default:
      return <React.Fragment />
  }
}

const selectors = createStructuredSelector({
  currentFiles: selectCurrentFiles,
})

const actions = {
  setCurrentFiles,
}

ScansOptionEditor.propTypes = {
  analyses: PropTypes.array,
  analysisOptions: PropTypes.object,
  currentFiles: PropTypes.array,
  readOnly: PropTypes.bool,
  handleSetOption: PropTypes.func,
  setCurrentFiles: PropTypes.func,
}

export default connect(
  selectors,
  actions,
)(ScansOptionEditor)
