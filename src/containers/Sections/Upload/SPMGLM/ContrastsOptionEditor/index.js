import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, each, filter, get, last, map, zipWith } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAnalysisOptions, setAnalysisOption } from 'store/modules/analyses'
import { Button, Col, Divider, Row } from 'antd'
import SingleContrastOptionEditor from './SingleContrastOptionEditor'

const DUAL_RUN_NUM = 2

export class ContrastsOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
    numOnsets: PropTypes.number,
  }

  static defaultProps = {
    readOnly: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      numContrasts: get(props, 'analysisOptions.Contrasts.value.length', 0),
    }
  }

  handleAddContrast = () => {
    const { analysisOptions } = this.props
    let contrasts = analysisOptions.Contrasts.value
    const newContrast = contrasts.length ? last(contrasts) : {}
    contrasts.push(cloneDeep(newContrast))
    this.handleSetOption(contrasts)
    this.setState({ numContrasts: contrasts.length })
  }

  handleRemoveContrast = index => {
    const { analysisOptions } = this.props
    let contrasts = analysisOptions.Contrasts.value
    contrasts.splice(index, 1)
    this.handleSetOption(contrasts)
    this.setState({ numContrasts: contrasts.length })
  }

  handleSetOption = contrasts => {
    this.props.setAnalysisOption({ name: 'Contrasts', option: { value: contrasts } })
  }

  handleSetContrastOption = (index, optionName, value) => {
    const { analysisOptions } = this.props
    let contrasts = analysisOptions.Contrasts.value
    contrasts[index][optionName] = value
    this.handleSetOption(contrasts)
    this.setState({ numContrasts: contrasts.length })
  }

  getNoExtName(fileName) {
    return fileName
      .split('.')
      .slice(0, -1)
      .join('.')
  }
  /**
   * Generate contrasts from runs configuration
   * by pairing event and onset in the same order.
   */
  generateContrasts = () => {
    const { analysisOptions } = this.props
    const validRunOptions = filter(analysisOptions.Runs.value, run => run.Event_name && run.onsets)
    let contrasts = analysisOptions.Contrasts.value
    // Generate contrasts for Weight [1]
    each(validRunOptions, run => {
      zipWith(run.Event_name, run.onsets, (eventName, onset) => {
        if (eventName && onset) {
          contrasts.push({
            Contrast_Name: eventName,
            Contrast_Type: 'T',
            Contrast_Events: eventName,
            Contrast_Weights: '[1]',
          })
        }
      })
    })
    // Generate contrasts for Weight [0.5, 0.5]
    if (validRunOptions.length === DUAL_RUN_NUM) {
      const run1 = validRunOptions[0]
      const run2 = validRunOptions[1]
      zipWith(run1.Event_name, run2.Event_name, run1.onsets, run2.onsets, (r1Evt, r2Evt, r1Onset, r2Onset) => {
        contrasts.push({
          Contrast_Name: `${r1Evt}_run2`,
          Contrast_Type: 'T',
          Contrast_Events: [r1Evt, r2Evt].join(', '),
          Contrast_Weights: '[0.5, 0.5]',
        })
      })
    }
    this.handleSetOption(contrasts)
    this.setState({ numContrasts: contrasts.length })
  }

  get canGenerateContrasts() {
    const { numOnsets, readOnly } = this.props
    return !readOnly && this.state.numContrasts === 0 && numOnsets > 0
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const contrasts = get(analysisOptions, 'Contrasts.value', [])
    return (
      <React.Fragment>
        {this.canGenerateContrasts && <Button onClick={this.generateContrasts}>Generate Contrasts from Runs</Button>}
        <Row>{!readOnly && <Button onClick={this.handleAddContrast}>Add Contrast</Button>}</Row>
        <Row>
          {map(contrasts, (contrast, index) => (
            <Col key={`contrast_${index}`} md={11} offset={index % 2}>
              <SingleContrastOptionEditor
                analysisOptions={analysisOptions}
                contrast={contrast}
                index={index}
                readOnly={readOnly}
                setContrastOption={(optionName, value) => this.handleSetContrastOption(index, optionName, value)}
                handleRemoveContrast={() => this.handleRemoveContrast(index)}
              />
              <Divider dashed />
            </Col>
          ))}
        </Row>
      </React.Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysisOptions: selectAnalysisOptions,
})

const actions = {
  setAnalysisOption,
}

export default connect(
  selectors,
  actions,
)(ContrastsOptionEditor)
