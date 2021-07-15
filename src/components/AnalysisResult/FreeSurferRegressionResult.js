import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withSizes } from 'react-sizes'
import { compact, first, map } from 'lodash'
import { Button, Input, Row, Select, Tabs, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { BREAKPOINTS } from 'config/base'
import { FileInfo } from 'components'
import SummaryTable from './SummaryTable'

const { TabPane } = Tabs
const { Option } = Select

class FreeSurferRegressionResult extends Component {
  static propTypes = {
    data: PropTypes.shape({
      results_by_measure: PropTypes.array,
      results_by_predictor: PropTypes.array,
      all_files: PropTypes.array,
      has_figures: PropTypes.bool,
      out_dir: PropTypes.string,
      result_files: PropTypes.array,
      save_path: PropTypes.string,
      description: PropTypes.string,
    }),
    dataFile: PropTypes.object,
    isMobile: PropTypes.bool,
  }

  state = {
    measureOptions: this.createOptions(this.props.data.results_by_measure),
    predictorOptions: this.createOptions(this.props.data.results_by_predictor),
    measureOptionsLookup: this.createMeasureOptionsLookup(this.props.data.results_by_measure),
    predictorOptionsLookup: this.createPredictorOptionsLookup(this.props.data.results_by_predictor),
    measureSelection: this.getInitialSelection(this.props.data.results_by_measure),
    predictorSelection: this.getInitialSelection(this.props.data.results_by_predictor),
    searchText: '',
    searchedColumn: '',
  }

  getInitialSelection(results) {
    return first(results)
  }

  createOptions(optionData) {
    return map(optionData, (item, index) => {
      return (
        <Option value={item.name} key={index}>
          {item.name}
        </Option>
      )
    })
  }

  createMeasureOptionsLookup(optionData) {
    return optionData.reduce((acc, elem) => {
      acc[elem.name] = elem
      return acc
    }, {})
  }

  createPredictorOptionsLookup(optionData) {
    return optionData.reduce((acc, elem) => {
      acc[elem.name] = elem
      return acc
    }, {})
  }

  onMeasureChange = val => {
    this.setState({ measureSelection: this.state.measureOptionsLookup[val] })
  }

  onPredictorChange = val => {
    this.setState({ predictorSelection: this.state.predictorOptionsLookup[val] })
  }

  formatResults(results) {
    return map(results, (item, index) => {
      item['key'] = index
      return item
    })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          className="searchTxt"
          placeholder={`Search ${dataIndex}`}
          value={first(selectedKeys)}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          name="searchBtn"
          className="searchBtn"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="searchoutlined"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button name="resetBtn" onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100)
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: first(selectedKeys),
      searchedColumn: dataIndex,
    })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  get columns() {
    const columns = [
      {
        title: 'Measure',
        dataIndex: 'Measure',
        key: 'measure',
        ...this.getColumnSearchProps('Measure'),
      },
      {
        title: 'Beta',
        dataIndex: 'Beta',
        key: 'beta',
      },
      {
        title: 'Std Err',
        dataIndex: 'Std Err',
        key: 'stderr',
      },
      {
        title: 't-value',
        dataIndex: 't-value',
        key: 'tvalue',
      },
      {
        title: 'p-value',
        dataIndex: 'p-value',
        key: 'pvalue',
      },
      {
        title: 'sign(t) x abs(log(p))',
        dataIndex: 'sign(t) x abs(log(p))',
        key: 'signt_logp',
      },
    ]
    return compact(columns)
  }

  render() {
    const { dataFile, data, isMobile } = this.props
    if (!data) {
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
          <TabPane tab="Results by Measure" key="measures">
            <div>
              <Row>Select measure to display results</Row>
              <Row>
                <Select
                  className="w-33"
                  defaultValue={this.state.measureSelection.name}
                  showSearch
                  onChange={this.onMeasureChange}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.measureOptions}
                </Select>
              </Row>
              {map(this.state.measureSelection.results, (item, ind) => (
                <div key={ind} style={{ margin: '2rem 0' }}>
                  <SummaryTable content={item} />
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Results by Predictor" key="predictors">
            <div>
              <Row>Select predictor to display results</Row>
              <Row>
                <Select
                  className="w-33"
                  defaultValue={this.state.predictorSelection.name}
                  showSearch
                  onChange={this.onPredictorChange}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.predictorOptions}
                </Select>
              </Row>
              <Table
                columns={this.columns}
                dataSource={this.formatResults(this.state.predictorSelection.results)}
                bordered
                rowKey="Measure"
                size="middle"
                scroll={{ x: isMobile }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.MD,
  isMobile: width < BREAKPOINTS.SM,
})

export default compose(withSizes(sizes))(FreeSurferRegressionResult)
