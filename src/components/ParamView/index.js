import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  OptionEditor,
  RegressionOptionEditor,
  PolyssifierOptionEditor,
  DFNCOptionEditor,
  FMRIPhantomQAOptionEditor,
  GroupICAOptionEditor,
  GroupSPMGLMOptionEditor,
  SPMGLMOptionEditor,
  StructuralMRIOptionEditor,
  FunctionalMRIPreprocOptionEditor,
  FMRI32OptionEditor,
  DTIOptionEditor,
  MancovaOptionEditor,
  ASLOptionEditor,
  WMHOptionEditor,
  VariableConfigurationTable,
} from 'components'

export default class ParamView extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    label: PropTypes.string,
    file: PropTypes.object,
  }

  renderSubEditor = () => {
    const { analysis, label, file } = this.props

    const props = {
      analysisOptions: analysis.parameters,
      file,
      readOnly: true,
    }

    switch (label) {
      case 'Regression':
        return <RegressionOptionEditor {...props} />
      case 'Polyssifier':
        return <PolyssifierOptionEditor {...props} />
      case 'GICA':
        return <GroupICAOptionEditor {...props} />
      case 'dFNC':
        return <DFNCOptionEditor {...props} />
      case 'MANCOVA':
        return <MancovaOptionEditor {...props} />
      case 'VBM':
        return <StructuralMRIOptionEditor {...props} />
      case 'fMRI':
        return <FunctionalMRIPreprocOptionEditor {...props} />
      case 'fMRI_32ch':
        return <FMRI32OptionEditor {...props} />
      case 'DTI':
        return <DTIOptionEditor {...props} />
      case 'SPMGLM':
        return <SPMGLMOptionEditor {...props} />
      case 'GroupSPMGLM':
        return <GroupSPMGLMOptionEditor {...props} />
      case 'ASL':
        return <ASLOptionEditor {...props} />
      case 'fMRI_PhantomQA':
        return <FMRIPhantomQAOptionEditor {...props} />
      case 'WMH':
        return <WMHOptionEditor {...props} />
      default:
        return null
    }
  }

  render() {
    const { analysis, file } = this.props

    if (!analysis) {
      return null
    }

    return (
      <Fragment>
        <VariableConfigurationTable analysis={analysis} file={file} readOnly />
        <OptionEditor analysisOptions={analysis.parameters} readOnly fullWidth />
        <div>{this.renderSubEditor()}</div>
      </Fragment>
    )
  }
}
