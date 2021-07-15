import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'react-highcharts'
import { Card, Col, Row } from 'antd'
import { first, get, keys, map, omit, reduce, toUpper } from 'lodash'
import { getAnalysisLegend } from 'utils/analyses'

export default class MetricChart extends Component {
  static propTypes = {
    analyses: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        fmri_phantom_qa_data: PropTypes.array,
        date_time_start: PropTypes.string,
        date_time_end: PropTypes.string,
      }),
    ),
  }

  getChartData = () => {
    const { analyses } = this.props

    const analysisKeys = keys(omit(get(first(analyses), 'fmri_phantom_qa_data.0'), 'slice'))

    const chartData = reduce(
      analysisKeys,
      (acc, key) => {
        acc[key] = map(analyses, analysis => ({
          name: getAnalysisLegend(analysis),
          data: analysis.fmri_phantom_qa_data.map(elem => elem[key]),
        }))

        return acc
      },
      {},
    )

    return chartData
  }

  getConfig = (data, key) => {
    return {
      chart: {
        type: 'line',
      },
      title: {
        text: toUpper(key),
      },
      xAxis: {
        title: {
          text: 'Slice',
        },
        allowDecimals: false,
      },
      yAxis: {
        title: {
          text: key === 'signal_p2p' || key === 'ghost' ? 'Percent (%)' : null,
        },
      },
      plotOptions: {
        line: {
          tooltip: {
            headerFormat: '<b>Slice: {point.x}</b><br>',
          },
        },
      },
      series: data,
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
    }
  }

  render() {
    const chartData = this.getChartData()

    return (
      <Row gutter={24}>
        {keys(chartData).map(key => (
          <Col key={key} md={12}>
            <Card className="mt-1">
              <Highcharts config={this.getConfig(chartData[key], key)} />
            </Card>
          </Col>
        ))}
      </Row>
    )
  }
}
