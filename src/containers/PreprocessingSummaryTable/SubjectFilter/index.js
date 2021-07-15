import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

import SubjectSearchForm from '../SubjectSearchForm'

export default class SubjectFilter extends Component {
  static propTypes = {
    studyLabel: PropTypes.string,
    value: PropTypes.string,
    onFilter: PropTypes.func,
  }

  state = {
    showForm: false,
  }

  toggleShowForm = () => {
    const { showForm } = this.state

    this.setState({ showForm: !showForm })
  }

  handleSubmit = value => {
    this.props.onFilter(value)
    this.toggleShowForm()
  }

  render() {
    const { value, studyLabel } = this.props
    const { showForm } = this.state

    return (
      <div className="subject-filter">
        <Button
          shape="circle"
          icon="search"
          size="small"
          type={value ? 'primary' : 'default'}
          onClick={this.toggleShowForm}
        />
        <SubjectSearchForm
          visible={showForm}
          studyLabel={studyLabel}
          onSubmit={this.handleSubmit}
          onToggle={this.toggleShowForm}
        />
        {showForm && <div className="subject-filter-backdrop" role="button" onClick={this.toggleShowForm} />}
      </div>
    )
  }
}
