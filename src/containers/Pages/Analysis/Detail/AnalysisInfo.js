import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { get, find } from 'lodash'
import { Button, Descriptions, Modal, Tag } from 'antd'
import moment from 'moment'
import { TAG_COLORS } from 'config/base'
import { DELETE_ANALYSIS } from 'store/modules/analyses'
import { CheckIcon, ParamView, FilesView, ProvenanceView } from 'components'
import { prepareDownloadResult, renderErrors } from 'utils/analyses'
import { successAction } from 'utils/state-helpers'

const { Item } = Descriptions

export class AnalysisInfo extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisTypes: PropTypes.array,
    history: PropTypes.object,
    status: PropTypes.string,
    deleteAnalysis: PropTypes.func,
  }

  state = {
    paramsModal: false,
    filesModal: false,
    provenanceModal: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === successAction(DELETE_ANALYSIS)) {
      this.props.history.push('/study')
    }
  }

  toggleParamsModal = () => {
    const { paramsModal } = this.state

    this.setState({ paramsModal: !paramsModal })
  }

  toggleFilesModal = () => {
    const { filesModal } = this.state

    this.setState({ filesModal: !filesModal })
  }

  toggleProvenanceModal = () => {
    const { provenanceModal } = this.state

    this.setState({ provenanceModal: !provenanceModal })
  }

  handleDownloadResult = async () => {
    const { analysis } = this.props

    this.setState({ isDownloading: true })

    await prepareDownloadResult(analysis.id)

    /* istanbul ignore next */
    this.setState({ isDownloading: false })
  }

  handleShowError = error => {
    Modal.error({
      content: renderErrors(error),
      maskClosable: true,
      icon: null,
      okText: 'Dismiss',
      width: '80%',
    })
  }

  handleDeleteResult = () => {
    const comp = this
    const { analysis } = this.props

    Modal.confirm({
      title: `Are you sure want to delete this analysis result?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteAnalysis(analysis.id)
      },
    })
  }

  get paramViewProps() {
    const { analysis, analysisTypes } = this.props
    const { parameters } = analysis
    const label = get(find(analysisTypes, { id: get(parameters, 'analysis.analysis_type') }), 'label')

    return { ...parameters, label }
  }

  get filesViewProps() {
    const { analysis } = this.props

    return { dataFiles: get(analysis, 'parameters.analysis.options.files.value') }
  }

  get provenanceViewProps() {
    const { analysis } = this.props

    return analysis.provenance
  }

  get modalities() {
    const { analysis } = this.props
    const seriesModality = get(analysis, 'input_file.series.modality')
    const seriesProtocolModalities = get(analysis, 'input_file.series.protocol.modalities')

    if (seriesModality) {
      return [seriesModality]
    }

    if (seriesProtocolModalities && seriesProtocolModalities.length > 0) {
      return seriesProtocolModalities
    }

    return []
  }

  render() {
    const { analysisTypes, analysis } = this.props
    const { paramsModal, filesModal, provenanceModal, isDownloading } = this.state

    const {
      id,
      name,
      analysis_type,
      input_file,
      has_figures,
      date_time_start,
      date_time_end,
      status,
      error,
      provenance,
      created_by,
      parameters,
      save_path,
    } = analysis

    const completed = status === 'Complete'
    const failed = status === 'Error'

    const isDeleting = this.props.status === DELETE_ANALYSIS

    return (
      <div>
        <h2 className="text-center mb-2">Analysis Info </h2>
        <div className="w-75">
          <Descriptions size="small" bordered column={1}>
            <Item label="Name">{name}</Item>
            <Item label="Actions">
              <Button className="mr-05 param-modal-btn" size="small" onClick={this.toggleParamsModal}>
                Parameters
              </Button>
              <Button className="mr-05 files-modal-btn" size="small" onClick={this.toggleFilesModal}>
                Files
              </Button>
              {completed && (
                <Link to={`/analysis/${id}/result`}>
                  <Button className="mr-05 view-result-btn" type="default" size="small">
                    Results
                  </Button>
                </Link>
              )}
              {completed && has_figures && (
                <Button
                  className="mr-05 download-btn"
                  type="default"
                  size="small"
                  loading={isDownloading}
                  disabled={!!isDownloading}
                  onClick={this.handleDownloadResult}
                >
                  Prepare Download
                </Button>
              )}
              {failed && (
                <Button
                  className="mr-05 error-btn"
                  type="danger"
                  size="small"
                  onClick={() => this.handleShowError(error)}
                >
                  Errors
                </Button>
              )}
              {provenance && (
                <Button className="mr-05 provenance-modal-btn" size="small" onClick={this.toggleProvenanceModal}>
                  Provenance
                </Button>
              )}
              {(completed || failed) && get(parameters, 'analysis.analysis_type') && (
                <Link to={`/analysis-start/${parameters.analysis.analysis_type}?analysisId=${id}`}>
                  <Button className="mr-05" size="small">
                    Redo
                  </Button>
                </Link>
              )}
              {(completed || failed) && (
                <Button
                  className="delete-btn"
                  size="small"
                  type="danger"
                  loading={isDeleting}
                  disabled={isDeleting}
                  onClick={this.handleDeleteResult}
                >
                  Delete
                </Button>
              )}
            </Item>
            <Item label="Analysis Type">{get(find(analysisTypes, { id: analysis_type }), 'label')}</Item>
            <Item label="Series">{get(input_file, 'series_info.label', '')}</Item>
            <Item label="Session">{get(input_file, 'session_info.segment_interval')}</Item>
            <Item label="Modalities">
              {this.modalities.map(modality => (
                <Tag key={modality.id} color={TAG_COLORS[modality.id % (TAG_COLORS.length - 1)]}>
                  {modality.full_name}
                </Tag>
              ))}
            </Item>
            <Item label="Scanner">{get(input_file, 'scanner_info.full_name')}</Item>
            <Item label="PI">
              <Tag>{get(input_file, 'pi_info.username')}</Tag>
            </Item>
            <Item label="Study">{get(input_file, 'study_info.full_name')}</Item>
            <Item label="Site">{get(input_file, 'site_info.full_name')}</Item>
            <Item label="Subject">{get(input_file, 'subject_info.anon_id')}</Item>
            <Item label="Status">{status}</Item>
            <Item label="Result path">{save_path}</Item>
            <Item label="Figures">
              <CheckIcon checked={has_figures} />
            </Item>
            <Item label="Started">{date_time_start && moment(date_time_start).format('YYYY-MM-DD HH:mm:ss')}</Item>
            <Item label="Ended">{date_time_end && moment(date_time_end).format('YYYY-MM-DD HH:mm:ss')}</Item>
            <Item label="Started by">{created_by.username}</Item>
          </Descriptions>
        </div>

        <Modal
          title="Parameters"
          visible={paramsModal}
          footer={null}
          onOk={this.toggleParamsModal}
          onCancel={this.toggleParamsModal}
          width={800}
          destroyOnClose
        >
          <ParamView {...this.paramViewProps} />
        </Modal>

        <Modal
          title="Files"
          visible={filesModal}
          footer={null}
          onOk={this.toggleFilesModal}
          onCancel={this.toggleFilesModal}
          width={800}
          destroyOnClose
        >
          <FilesView {...this.filesViewProps} />
        </Modal>

        <Modal
          title="Provenance"
          visible={provenanceModal}
          footer={null}
          onOk={this.toggleProvenanceModal}
          onCancel={this.toggleProvenanceModal}
          width={800}
          destroyOnClose
        >
          <ProvenanceView {...this.provenanceViewProps} />
        </Modal>
      </div>
    )
  }
}

export default withRouter(AnalysisInfo)
