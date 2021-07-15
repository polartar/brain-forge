import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Card, Col, Radio, Row, Select } from 'antd'
import { find, get, maxBy } from 'lodash'
import { CHART_COLORS } from 'config/base'
import { getAnalysisLegend } from 'utils/analyses'
import DateChart from './DateChart'
import MetricChart from './MetricChart'

const { Option } = Select

export default class ScannerChart extends Component {
  static propTypes = {
    phantomAnalyses: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        fmri_phantom_qa_data: PropTypes.array,
        date_time_start: PropTypes.string,
        date_time_end: PropTypes.string,
      }),
    ),
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedAnalyses: [],
      chartType: 'metric',
    }
  }

  componentWillMount() {
    const { phantomAnalyses } = this.props
    const latestAnalysisId = get(maxBy(phantomAnalyses, 'anon_date'), 'id')

    this.setState({ selectedAnalyses: latestAnalysisId ? [latestAnalysisId] : [] })
  }

  handleSelectAll = () => {
    const { phantomAnalyses } = this.props

    this.setState({ selectedAnalyses: phantomAnalyses.map(analysis => analysis.id) })
  }

  handleDeselectAll = () => {
    this.setState({ selectedAnalyses: [] })
  }

  renderChart = () => {
    const { phantomAnalyses } = this.props
    const { selectedAnalyses, chartType } = this.state

    if (selectedAnalyses.length === 0) {
      return <Alert type="warning" message="Please select analysis" banner className="mt-1" />
    }

    const analyses = phantomAnalyses.filter(analysis => selectedAnalyses.includes(analysis.id))

    return chartType === 'metric' ? <MetricChart analyses={analyses} /> : <DateChart analyses={analyses} />
  }

  render() {
    const { phantomAnalyses } = this.props
    const { selectedAnalyses, chartType } = this.state

    return (
      <div>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Radio.Group
              value={chartType}
              buttonStyle="solid"
              onChange={evt => this.setState({ chartType: evt.target.value })}
            >
              <Radio.Button value="metric">By Slice</Radio.Button>
              <Radio.Button value="date">By Date</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        <Row gutter={24} className="mt-1">
          <Col xs={24}>
            <div className="analysis-selector">
              Analyses:&nbsp;
              <Select
                mode="multiple"
                placeholder="Please select"
                value={selectedAnalyses}
                style={{ width: '100%' }}
                onChange={analyses => this.setState({ selectedAnalyses: analyses })}
              >
                {phantomAnalyses.map(analysis => (
                  <Option key={analysis.id} value={analysis.id}>
                    {getAnalysisLegend(analysis)}
                  </Option>
                ))}
              </Select>
            </div>

            <Button
              className="select-all-button"
              type="primary"
              size="small"
              disabled={selectedAnalyses.length === phantomAnalyses.length}
              onClick={this.handleSelectAll}
            >
              Select All
            </Button>

            <Button
              className="deselect-all-button ml-05"
              type="primary"
              size="small"
              disabled={selectedAnalyses.length === 0}
              onClick={this.handleDeselectAll}
            >
              Deselect All
            </Button>
          </Col>
          <Col xs={24} md={{ span: 12, offset: 12 }}>
            {chartType === 'metric' && selectedAnalyses.length > 0 && (
              <Card className="analysis-legend">
                {selectedAnalyses.map((analysisId, ind) => (
                  <div key={analysisId} className="analysis-legend-item">
                    <span
                      className="analysis-legend-mark"
                      style={{ backgroundColor: CHART_COLORS[ind % (CHART_COLORS.length - 1)] }}
                    />
                    {getAnalysisLegend(find(phantomAnalyses, { id: analysisId }))}
                  </div>
                ))}
              </Card>
            )}
          </Col>
        </Row>
        {this.renderChart()}
      </div>
    )
  }
}
