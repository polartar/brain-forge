import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Tabs } from 'antd'
import { FileInfo } from 'components'
import { encodePathURL } from 'utils/analyses'
import SummaryTable from './SummaryTable'

const { TabPane } = Tabs

export default class PolyssifierResult extends Component {
  static propTypes = {
    token: PropTypes.string,
    data: PropTypes.shape({
      test_summary: PropTypes.any,
      train_summary: PropTypes.any,
      confusions: PropTypes.any,
      figures: PropTypes.array,
      save_path: PropTypes.string,
    }),
    dataFile: PropTypes.object,
  }

  renderTable = summary => {
    if (!summary) {
      return null
    }

    return (
      <div>
        {map(summary, (item, ind) => (
          <div key={ind}>
            <SummaryTable content={item} />
          </div>
        ))}
      </div>
    )
  }

  render() {
    const { dataFile, data, token } = this.props

    if (!data) return null

    const { test_summary, train_summary, confusions, figures, save_path } = data

    return (
      <div className="analysis-result">
        <Tabs animated={false}>
          <TabPane tab="Metadata" key="meta-data">
            <div className="w-50">
              <FileInfo dataFile={dataFile} />
            </div>
          </TabPane>

          <TabPane tab="Test Results" key="test-results">
            {this.renderTable(test_summary)}
          </TabPane>

          <TabPane tab="Train Results" key="train-results">
            {this.renderTable(train_summary)}
          </TabPane>

          <TabPane tab="Confusion Matrix" key="confusion-matrix">
            {confusions &&
              map(confusions, (item, ind) => (
                <div key={ind} style={{ marginTop: '1rem' }}>
                  <div className="analysis-result__subheading">{ind}</div>
                  <SummaryTable content={item} />
                </div>
              ))}
          </TabPane>

          <TabPane tab="Figures" key="figures">
            {figures &&
              map(figures, (item, ind) => (
                <div key={ind} style={{ marginTop: '2.5rem' }}>
                  <img id={ind} alt={ind} src={encodePathURL(save_path, item, token)} />
                </div>
              ))}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
