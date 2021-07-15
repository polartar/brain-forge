import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAnalysisType, selectAnalysis } from 'store/modules/analyses'
import { updateCurrentFileFields, setAllFiles, setCurrentFiles } from 'store/modules/datafiles'
import { selectModalities } from 'store/modules/mappings'
import { DataFileTree } from 'components'

export class DataFileSelect extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisType: PropTypes.object,
    initialValue: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.object]),
    multiple: PropTypes.bool,
    name: PropTypes.string,
    handleSelectedFiles: PropTypes.func,
    updateCurrentFileFields: PropTypes.func,
    setAllFiles: PropTypes.func,
    setCurrentFiles: PropTypes.func,
  }

  handleOnChange = files => {
    this.props.handleSelectedFiles(files)
    this.props.setAllFiles(files)
    this.props.setCurrentFiles(files)
  }

  render() {
    const { analysis, analysisType, name, multiple, initialValue } = this.props

    return (
      <DataFileTree
        initialValue={initialValue}
        multiple={multiple}
        analysisType={analysisType}
        analysis={analysis}
        name={name}
        onChange={this.handleOnChange}
        onUpdateFields={this.props.updateCurrentFileFields}
      />
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
  modalities: selectModalities,
})

const actions = {
  updateCurrentFileFields,
  setAllFiles,
  setCurrentFiles,
}

export default connect(
  selectors,
  actions,
)(DataFileSelect)
