import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { cloneDeep, filter, fill, find, get, isEmpty, last, map, sumBy } from 'lodash'
import { Button, Row } from 'antd'
import { selectAnalyses, selectAnalysisOptions, setAnalysisOption } from 'store/modules/analyses'
import { trimFileExt } from 'utils/analyses'

import SingleRunOptionEditor from './SingleRunOptionEditor'

const INPUT_SEPARATOR = ','

export const EMPTY_RUN_OPTION = {
  Func_Runs: null,
  onsets: [null],
  Event_name: [null],
  durations: [],
  regressor_names: [],
  regressors: null,
}

export class RunsOptionEditor extends Component {
  static propTypes = {
    analyses: PropTypes.object,
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
    setNumOnSets: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  componentWillMount() {
    this.props.setNumOnSets(this.getNumOnsets(get(this.props, 'analysisOptions.Runs.value', [])))
  }

  getNumOnsets = runOptions => {
    return sumBy(runOptions, run => filter(run.onsets).length)
  }

  getDataFile = params => {
    if (params.id) {
      const url = `/data-file/${params.id}/`

      return axios.get(url)
    } else {
      const url = `/run-analysis-data/datafile/`
      const config = { params }

      return axios.get(url, config)
    }
  }

  getCompatibleParam(index, value) {
    const indexRegex = new RegExp(index + '$')

    return value.match(indexRegex) && value.replace(indexRegex, index + 1)
  }

  handleAddRun = () => {
    const { analysisOptions } = this.props

    let runOptions = analysisOptions.Runs.value
    let newRun = cloneDeep(EMPTY_RUN_OPTION)

    if (!isEmpty(runOptions)) {
      const runIndex = runOptions.length
      const lastRun = last(runOptions)
      const numOnsets = lastRun['onsets'].length

      // Initialize fields with the right value and length.
      newRun['durations'] = cloneDeep(lastRun['durations'])
      newRun['onsets'] = fill(Array(numOnsets), null)
      newRun['Event_name'] = fill(Array(numOnsets), null)

      // Auto create regressor name with the right RunIndex.
      if (!isEmpty(get(lastRun, 'regressor_names'))) {
        const regressorNames = lastRun['regressor_names'].split(INPUT_SEPARATOR)
        const newRegressorNames = map(regressorNames, name => this.getCompatibleParam(runIndex, name))

        newRun['regressor_names'] = newRegressorNames.join(INPUT_SEPARATOR)
      }

      // Search for compatible onsets and Event_name with the new run based on previous run.
      lastRun.onsets.forEach((onset, onsetIndex) => {
        const fileName = get(onset, 'name') && trimFileExt(onset.name)
        const compFileName = fileName && this.getCompatibleParam(runIndex, fileName)

        if (compFileName) {
          this.getDataFile({ files: compFileName }).then(res => {
            const compOnset =
              find(res.data, ot => ot.series_info.label === onset.series_info.label) ||
              find(res.data, ot => ot.session_info.segment_interval === onset.session_info.segment_interval) ||
              find(res.data, ot => ot.subject_info.anon_id === onset.subject_info.anon_id)

            if (compOnset) {
              newRun.onsets[onsetIndex] = compOnset.id
              newRun.Event_name[onsetIndex] = trimFileExt(compOnset.name)
              runOptions[runIndex] = newRun

              this.handleSetOption(runOptions)
            }
          })
        }
      })
    }

    runOptions.push(newRun)

    this.handleSetOption(runOptions)
  }

  handleRemoveRun = index => {
    const { analysisOptions } = this.props

    let runOptions = analysisOptions.Runs.value
    runOptions.splice(index, 1)

    this.handleSetOption(runOptions)
  }

  handleSetOption = runOptions => {
    this.props.setAnalysisOption({
      name: 'Runs',
      option: { value: runOptions },
    })
    this.props.setNumOnSets(this.getNumOnsets(runOptions))
  }

  handleSetRunOption = (index, optionName, value) => {
    const { analysisOptions } = this.props
    let runOptions = analysisOptions.Runs.value

    // Assign a new value to the option.
    runOptions[index][optionName] = value
    this.handleSetOption(runOptions)
  }

  render() {
    const { analyses, analysisOptions, readOnly } = this.props
    const runOptions = get(analysisOptions, 'Runs.value', [])

    return (
      <React.Fragment>
        <Row>{!readOnly && <Button onClick={this.handleAddRun}>Add Run</Button>}</Row>
        <Row>
          {map(runOptions, (runOption, index) => (
            <SingleRunOptionEditor
              analyses={get(analyses, 'results', [])}
              readOnly={readOnly}
              runOption={runOption}
              index={index}
              key={index}
              setRunOption={(optionName, value) => this.handleSetRunOption(index, optionName, value)}
              handleRemoveRun={() => this.handleRemoveRun(index)}
            />
          ))}
        </Row>
      </React.Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysisOptions: selectAnalysisOptions,
  analyses: selectAnalyses,
})

const actions = {
  setAnalysisOption,
}

export default connect(
  selectors,
  actions,
)(RunsOptionEditor)
