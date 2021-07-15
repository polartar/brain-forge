import React from 'react'
import PropTypes from 'prop-types'
import { withSizes } from 'react-sizes'
import { BREAKPOINTS } from 'config/base'
import DesktopSidebar from './Desktop'
import MobileSidebar from './Mobile'

export const Sidebar = ({ isDesktop }) => {
  /* istanbul ignore next */
  return isDesktop ? <DesktopSidebar /> : <MobileSidebar />
}

Sidebar.propTypes = {
  isDesktop: PropTypes.bool,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width >= BREAKPOINTS.XL,
})

export default withSizes(sizes)(Sidebar)
