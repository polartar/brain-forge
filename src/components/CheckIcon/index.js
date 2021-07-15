import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

const CheckIcon = ({ checked }) => (
  <Icon
    type={`${checked ? 'check-circle' : 'close-circle'}`}
    theme="outlined"
    style={{ color: `${checked ? '#52c41a' : '#f5222d'}` }}
  />
)

CheckIcon.propTypes = {
  checked: PropTypes.bool,
}

export default CheckIcon
