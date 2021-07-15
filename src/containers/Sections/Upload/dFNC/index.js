import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { map, orderBy } from 'lodash'
import { ANALYSIS_RESULTS, ANALYSIS_TYPES_ID } from 'config/base'
import {
  initAnalysisOptions,
  selectAnalysis,
  selectAnalysisOptions,
  setAnalysisOption,
  listAnalysis,
  selectAnalyses,
} from 'store/modules/analyses'
import { initializeCurrentFiles } from 'store/modules/datafiles'
import { DefaultUploadSection } from 'containers/Sections/Upload/DefaultUpload'
import { Loader, Select, Option } from 'components'

const { Item: FormItem } = Form

export class DFNCUploadSection extends DefaultUploadSection {
  static propTypes = {
    analysis: PropTypes.object,
    analysisOptions: PropTypes.object,
    initAnalysisOptions: PropTypes.func,
    setAnalysisOption: PropTypes.func,
    analyses: PropTypes.object,
    listAnalysis: PropTypes.func,
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
    const { analysisOptions, analyses } = this.props
    const sortedAnalyses = orderBy(analyses.results, ['id'], ['desc'])

    if (this.loading) {
      return <Loader />
    }

    return (
      <FormItem label="Select a previously run Group ICA:">
        {analysisOptions.ica_parent && (
          <Select
            style={{ width: '100%' }}
            defaultValue={['default']}
            value={analysisOptions.ica_parent.value || 'default'}
            onChange={value => this.handleSetOption('ica_parent', 'value', value)}
          >
            <Option key={0} value={'default'}>
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
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisOptions: selectAnalysisOptions,
  analyses: selectAnalyses,
})

const actions = {
  initializeCurrentFiles,
  initAnalysisOptions,
  setAnalysisOption,
  listAnalysis,
}

export default connect(selectors, actions)(DFNCUploadSection)
