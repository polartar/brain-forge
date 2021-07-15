import React from 'react'
import PropTypes from 'prop-types'
import { withSizes } from 'react-sizes'
import { Tabs as AntTabs } from 'antd'
import { BREAKPOINTS } from 'config/base'

export const ResponsiveTabs = ({ isMobile, ...props }) => (
  <AntTabs tabPosition={isMobile ? 'top' : 'left'} animated={false} {...props} />
)

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isMobile: width < BREAKPOINTS.LG,
})

ResponsiveTabs.propTypes = {
  isMobile: PropTypes.bool,
}

export const Tabs = withSizes(sizes)(ResponsiveTabs)
export const TabPane = AntTabs.TabPane
