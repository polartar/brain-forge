/* eslint-disable react/no-this-in-sfc */

import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Row, Select } from 'antd'
import { find, first, get, keys, map, max, min, omit, orderBy, reduce, sum, sumBy, toUpper, uniq, values } from 'lodash'
import moment from 'moment'
import Highcharts from 'react-highcharts'
import Summary from './Summary'

const { Option } = Select

const DateChart = ({ analyses }) => {
  const [currentSlice, setCurrentSlice] = useState(0)
  const [slices, setSlices] = useState([])

  useEffect(() => {
    const analysesSlices = get(first(analyses), 'fmri_phantom_qa_data').map(elem => elem.slice)

    setSlices(analysesSlices)
    setCurrentSlice(first(analysesSlices))
  }, [analyses])

  const summary = useMemo(() => {
    const analysesData = analyses.map(analysis =>
      omit(find(analysis.fmri_phantom_qa_data, { slice: currentSlice }), 'slice'),
    )

    const analysisKeys = keys(first(analysesData))

    const res = analysisKeys.reduce((acc, key) => {
      const values = analysesData.map(data => data[key])
      const analysesCount = values.length
      const mean = sum(values) / analysesCount
      const std = Math.sqrt(sumBy(values, value => Math.pow(value - mean, 2)) / analysesCount)

      acc[key] = {
        Metric: toUpper(key),
        Mean: mean,
        STD: std,
      }

      return acc
    }, {})

    return values(res)
  }, [analyses, currentSlice])

  const chartData = useMemo(() => {
    const analysisKeys = keys(omit(get(first(analyses), 'fmri_phantom_qa_data.0'), 'slice'))

    const res = reduce(
      analysisKeys,
      (acc, key) => {
        acc[key] = {
          name: toUpper(key),
          data: [],
        }

        acc[key]['data'] = orderBy(
          map(analyses, analysis => {
            const date = Number(moment(analysis.anon_date, moment.ISO_8601))
            const value = get(find(analysis.fmri_phantom_qa_data, { slice: currentSlice }), key)

            return [date, value]
          }),
          elem => elem[0],
          ['asc'],
        )

        return acc
      },
      {},
    )

    return res
  }, [analyses, currentSlice])

  function getConfig(data, key) {
    const dates = uniq(analyses.map(analysis => analysis.anon_date))

    const minDate = moment(min(dates))
    const maxDate = moment(max(dates))

    const diffs = maxDate.diff(minDate, 'days')

    const dateFormat = diffs <= 1 ? 'DD-MM-YYYY' : 'DD-MM-YYYY h:mm:ss'
    const xPos = diffs > 1 ? 0 : 35

    return {
      chart: {
        type: 'line',
        zoomType: 'xy',
      },
      title: {
        text: toUpper(key),
      },
      subtitle: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
        },
        labels: {
          rotation: -45,
          x: xPos,
          formatter: function() {
            return moment(this.value, 'x').format(dateFormat)
          },
        },
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.series.name}</b><br/><b>Date: </b>${moment(this.x).format(dateFormat)}<br/><b>Value: </b> ${
            this.y
          }`
        },
      },
      yAxis: {
        title: {
          text: key === 'signal_p2p' || key === 'ghost' ? 'Percent (%)' : null,
        },
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
          },
        },
      },
      series: [data],
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
    }
  }

  return (
    <Row gutter={24} className="mt-1">
      <Col md={12}>
        Slice:{'  '}
        <Select value={currentSlice} style={{ width: 120 }} onChange={value => setCurrentSlice(value)}>
          {slices.map(slice => (
            <Option key={slice} value={slice}>
              {slice}
            </Option>
          ))}
        </Select>
      </Col>
      <Col md={12}>
        <Summary summary={summary} />
      </Col>
      {keys(chartData).map(key => (
        <Col key={key} md={12}>
          <Card className="mt-1">
            <Highcharts config={getConfig(chartData[key], key)} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

DateChart.propTypes = {
  analyses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      fmri_phantom_qa_data: PropTypes.array,
      date_time_start: PropTypes.string,
      date_time_end: PropTypes.string,
    }),
  ),
}

export default DateChart
