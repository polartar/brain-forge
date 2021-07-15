/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

export const { Option } = Select

export default class CustomSelect extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children, ...props } = this.props

    /* istanbul ignore next */
    return (
      <Select {...props} getPopupContainer={trigger => trigger.parentNode}>
        {children}
      </Select>
    )
  }
}
