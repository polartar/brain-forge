import React from 'react'
import PropTypes from 'prop-types'
import { withSizes } from 'react-sizes'
import { Drawer as AntDrawer } from 'antd'
import { BREAKPOINTS } from 'config/base'

export const Drawer = ({ isMobile, ...props }) => (
  <AntDrawer width={isMobile ? '100%' : 500} destroyOnClose {...props} />
)

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isMobile: width < BREAKPOINTS.LG,
})

Drawer.propTypes = {
  isMobile: PropTypes.bool,
}

export default withSizes(sizes)(Drawer)
