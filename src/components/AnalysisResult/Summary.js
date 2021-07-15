import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button } from 'antd'
import { get } from 'lodash'
import {
  ASLResult,
  DTIResult,
  GiftResult,
  PolyssifierResult,
  RegressionResult,
  VBMResult,
  FreeSurferResult,
  FreeSurfer7Result,
  FreeSurferRegressionResult,
  FMRIResult,
  FMRI32Result,
  FMRIPhantomQAResult,
  SPMGLMLevel1Result,
  SPMGLMLevel2Result,
  WMHResult,
} from 'components'
import { prepareDownloadResult } from 'utils/analyses'
import { getAuthData } from 'utils/storage'

export default class AnalysisResultSummary extends Component {
  state = {
    downloading: false,
    token: null,
  }

  static propTypes = {
    id: PropTypes.number,
    data: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      has_figures: PropTypes.bool,
      all_files: PropTypes.array,
      out_dir: PropTypes.string,
      save_path: PropTypes.string,
    }),
    dataFile: PropTypes.object,
  }

  componentDidMount() {
    this.initAccessToken()
  }

  initAccessToken = () => {
    const authData = getAuthData()
    const token = get(authData, 'token')

    this.setState({ token })
  }

  handleDownload = () => {
    const { id } = this.props

    this.setState({ downloading: true })

    /* istanbul ignore next */
    prepareDownloadResult(id)
  }

  renderSubResult = () => {
    const { id, data, dataFile } = this.props
    const { token } = this.state

    switch (data.name) {
      case 'ASL':
        return <ASLResult data={data} dataFile={dataFile} />
      case 'DTI Preprocessing':
        return <DTIResult dataFile={dataFile} data={data} token={token} />
      case 'regression':
        return <RegressionResult dataFile={dataFile} data={data} />
      case 'polyssifier':
        return <PolyssifierResult dataFile={dataFile} data={data} token={token} />
      case 'groupica':
      case 'dfnc':
      case 'MANCOVA':
        return <GiftResult data={data} id={id} token={token} />
      case 'vbm':
        return <VBMResult data={data} dataFile={dataFile} token={token} />
      case 'fMRIPreproc':
        return <FMRIResult data={data} dataFile={dataFile} token={token} />
      case 'fMRI 32-channel':
        return <FMRI32Result data={data} dataFile={dataFile} token={token} />
      case 'fMRI Phantom QA':
        return <FMRIPhantomQAResult data={data} dataFile={dataFile} token={token} />
      case 'Freesurfer':
        return <FreeSurferResult data={data} dataFile={dataFile} />
      case 'FreeSurfer7':
        return <FreeSurfer7Result data={data} dataFile={dataFile} />
      case 'Freesurfer Regression':
        return <FreeSurferRegressionResult data={data} dataFile={dataFile} />
      case 'SPM-GLM Level 1':
        return <SPMGLMLevel1Result data={data} id={id} token={token} dataFile={dataFile} />
      case 'SPM-GLM Group Level':
        return <SPMGLMLevel2Result data={data} id={id} token={token} dataFile={dataFile} />
      case 'WMH':
        return <WMHResult dataFile={dataFile} data={data} id={id} token={token} />
      default:
        return <Alert message="Your analysis is running, please check back later." type="info" showIcon banner />
    }
  }

  render() {
    const { data } = this.props
    const { downloading, token } = this.state

    if (!data) return null

    const { name, description, has_figures, all_files } = data

    return (
      <div>
        <div className="analysis-result">
          {(has_figures || all_files) && (
            <div>
              <Button
                type="default"
                icon="download"
                size="large"
                style={{ marginLeft: 10 }}
                loading={downloading}
                disabled={downloading}
                onClick={this.handleDownload}
              >
                {downloading ? "Preparing download. You will be notified when it's ready." : 'Prepare download results'}
              </Button>
            </div>
          )}
          {name && (
            <div className="analysis-result__heading">
              <div className="text-uppercase">{name}</div>
              {description && <div className="analysis-result__subheading">{description}</div>}
            </div>
          )}
        </div>
        {token && this.renderSubResult()}
      </div>
    )
  }
}
