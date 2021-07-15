import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Tabs } from 'antd'
import { FileInfo } from 'components'
import SummaryTable from './SummaryTable'

const { TabPane } = Tabs

const RegressionResult = ({ dataFile, data }) => {
  if (!data || !data.summary) {
    return null
  }

  return (
    <div className="analysis-result">
      <Tabs animated={false}>
        <TabPane tab="Metadata" key="meta-data">
          <div className="w-50">
            <FileInfo dataFile={dataFile} />
          </div>
        </TabPane>
        <TabPane tab="Regression" key="regression">
          {map(data.summary, (item, ind) => (
            <div key={ind} style={{ margin: '2rem 0' }}>
              <SummaryTable content={item} />
            </div>
          ))}
        </TabPane>
      </Tabs>
    </div>
  )
}

RegressionResult.propTypes = {
  data: PropTypes.shape({
    summary: PropTypes.any,
  }),
  dataFile: PropTypes.object,
}

export default RegressionResult
