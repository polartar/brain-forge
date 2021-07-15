import React from 'react'
import { Spin } from 'antd'

const Loader = props => <Spin size="large" {...props} />

Loader.defaultProps = {
  className: 'pos-center',
}

export default Loader
