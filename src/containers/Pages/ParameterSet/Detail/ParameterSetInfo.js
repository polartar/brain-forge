import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { isEqual } from 'lodash'
import { ParameterSetForm } from 'components'
import { getAnalysisLabel } from 'utils/analyses'
import { UPDATE_PARAMETER_SET } from 'store/modules/datafiles'
import { successAction } from 'utils/state-helpers'

class ParameterSetInfo extends Component {
  static propTypes = {
    analysisTypes: PropTypes.array,
    parameterSet: PropTypes.object,
    user: PropTypes.object,
    editable: PropTypes.bool,
    status: PropTypes.string,
  }

  state = {
    parameterSet: null,
    readOnly: true,
  }

  componentWillMount() {
    this.intializeState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { parameterSet, status } = this.props

    if (!isEqual(parameterSet, nextProps.parameterSet)) {
      this.intializeState(nextProps)
    }

    if (status !== nextProps.status && nextProps.status === successAction(UPDATE_PARAMETER_SET)) {
      this.setState({ readOnly: true })
    }
  }

  intializeState(props) {
    this.setState({ parameterSet: props.parameterSet })
  }

  toggleEdit = () => {
    const { readOnly } = this.state
    this.setState({ readOnly: !readOnly })
  }

  render() {
    const { analysisTypes, user, editable } = this.props
    const { parameterSet, readOnly } = this.state

    return (
      <div>
        <h2 className="text-center mb-1">
          {getAnalysisLabel(analysisTypes, parameterSet)} Parameter Set{' '}
          {readOnly && editable && <Button icon="edit" shape="circle" size="small" onClick={this.toggleEdit} />}
        </h2>
        <ParameterSetForm
          user={user}
          readOnly={readOnly}
          analysisTypes={analysisTypes}
          parameterSet={parameterSet}
          onCancel={this.toggleEdit}
        />
      </div>
    )
  }
}

export default ParameterSetInfo
