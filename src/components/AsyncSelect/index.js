import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { debounce, isEqual, omit, isEmpty } from 'lodash'
import { Checkbox, Spin } from 'antd'
import { Select, Option } from 'components'

const INITIAL_STATE = {
  data: [],
  search: '',
  fetching: false,
  selectAll: false,
}

class AsyncSelect extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.any,
    disabled: PropTypes.bool,
    fetchUrl: PropTypes.shape({
      base: PropTypes.string.isRequired,
      queryParams: PropTypes.object,
    }).isRequired,
    searchByDefault: PropTypes.bool,
    showSelectAll: PropTypes.bool,
    mode: PropTypes.string,
    filter: PropTypes.func,
    onChange: PropTypes.func,
    onSetData: PropTypes.func,
  }

  static defaultProps = {
    searchByDefault: false,
    disabled: false,
  }

  constructor(props) {
    super(props)

    this.state = INITIAL_STATE

    this.lastFetchId = 0
    this.fetchData = debounce(this.fetchData, 800)
  }

  componentDidMount() {
    const { searchByDefault, disabled } = this.props

    if (searchByDefault && !disabled) {
      this.fetchData('')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props.value, nextProps.value)) {
      if (!nextProps.value) {
        this.setState(nextProps.searchByDefault ? omit(INITIAL_STATE, 'data') : INITIAL_STATE)
      }
    }

    if (
      (this.props.disabled !== nextProps.disabled && !nextProps.disabled && nextProps.searchByDefault) ||
      (!isEqual(this.props.fetchUrl, nextProps.fetchUrl) && !nextProps.disabled)
    ) {
      this.fetchData('')
    }
  }

  fetchData = search => {
    const { fetchUrl } = this.props

    this.lastFetchId += 1

    const fetchId = this.lastFetchId

    this.setState({ fetching: true, search })

    const { base, queryParams } = fetchUrl

    const params = Object.assign({ ...queryParams }, search && { search })

    axios
      .get(base, { params })
      .then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }

        const data = res.data.map(({ id, name, ...other }) => ({
          key: id,
          label: name,
          ...other,
        }))

        this.setState({ data, fetching: false })

        this.props.onSetData && this.props.onSetData(data)
      })
      .catch(() => {
        this.setState({ data: [], fetching: false })
      })
  }

  handleChange = value => {
    this.setState({ fetching: false })

    this.props.onChange(value)
    if (isEmpty(value) && this.props.placeholder === 'Studies') {
      this.fetchData('')
    }
  }

  handleSelectAllChange = evt => {
    this.setState({ selectAll: evt.target.checked })

    if (evt.target.checked) {
      const allValues = this.getFilteredData().map(elem => elem.key.toString())
      this.handleChange(allValues)
    } else {
      this.handleChange([])
    }
  }

  getNotFoundContent = () => {
    const { fetching, search } = this.state

    if (fetching) {
      return <Spin size="small" />
    }

    if (!search) {
      return 'Start typing'
    }

    return 'Not Found'
  }

  getFilteredData = () => {
    const { filter } = this.props
    const { data } = this.state

    return filter ? filter(data) : data
  }

  render() {
    const { placeholder, searchByDefault, mode, value, disabled, showSelectAll } = this.props
    const { fetching, selectAll } = this.state

    const filteredData = this.getFilteredData()

    return (
      <>
        <Select
          value={value}
          placeholder={placeholder}
          mode={mode}
          notFoundContent={this.getNotFoundContent()}
          filterOption={false}
          className="w-100"
          showSearch={!searchByDefault}
          showArrow={false}
          loading={fetching}
          disabled={disabled}
          allowClear
          onSearch={this.fetchData}
          onChange={this.handleChange}
        >
          {filteredData.map(elem => (
            <Option key={elem.key}>{elem.label}</Option>
          ))}
        </Select>
        {showSelectAll && (
          <Checkbox
            checked={selectAll}
            disabled={disabled || filteredData.length === 0}
            onChange={this.handleSelectAllChange}
          >
            Select All
          </Checkbox>
        )}
      </>
    )
  }
}

export default AsyncSelect
