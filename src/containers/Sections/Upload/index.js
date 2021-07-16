import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { get } from 'lodash'
import { selectAnalysisType } from 'store/modules/analyses'

import DefaultUploadSection from './DefaultUpload'
import DFNCUploadSection from './dFNC'
import ASLUploadSection from './ASL'
import MancovaUploadSection from './Mancova'
import FMRI32UploadSection from './fMRI32'
import GroupICAUploadSection from './GICA'
import GroupSPMGLMUploadSection from './GroupSPMGLM'
import SPMGLMUploadSection from './SPMGLM'
import WMHUploadSection from './WMH'
import FreesurferRegressionUploadSection from './FreesurferRegression'

const UploadSection = ({ analysisType }) => {
  function getUploadSection() {
    const analysisLabel = get(analysisType, 'label')

    switch (analysisLabel) {
      case 'ASL':
        return <ASLUploadSection />
      case 'dFNC':
        return <DFNCUploadSection />
      case 'fMRI_32ch':
        return <FMRI32UploadSection />
      case 'FSR':
        return <FreesurferRegressionUploadSection />
      case 'GICA':
        return <GroupICAUploadSection />
      case 'GroupSPMGLM':
        return <GroupSPMGLMUploadSection />
      case 'MANCOVA':
        return <MancovaUploadSection />
      case 'SPMGLM':
        return <SPMGLMUploadSection />
      case 'WMH':
        return <WMHUploadSection />
      default:
        return <DefaultUploadSection />
    }
  }

  return (
    <div className="analysis-start-widget">
      <div className="analysis-start-widget-heading">Data Sets</div>
      {getUploadSection()}
    </div>
  )
}

UploadSection.propTypes = {
  analysisType: PropTypes.object,
}

const selectors = createStructuredSelector({
  analysisType: selectAnalysisType,
})

export default connect(selectors)(UploadSection)
