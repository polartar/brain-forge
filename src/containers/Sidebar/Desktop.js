import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { Layout } from 'antd'
import { selectIsSidebarPinned } from 'store/modules/global'
import { selectIsSuperUser, selectIsStaff, selectVersion } from 'store/modules/auth'
import Menu from './Menu'

const { Sider } = Layout

export class DesktopSidebar extends Component {
  static propTypes = {
    isSidebarPinned: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      collapsed: !props.isSidebarPinned,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isSidebarPinned } = this.props

    if (isSidebarPinned !== nextProps.isSidebarPinned) {
      this.setState({ collapsed: isSidebarPinned })
    }
  }

  toggleCollapse = () => {
    const { collapsed } = this.state

    this.setState({ collapsed: !collapsed })
  }

  handleMouseEvent = () => {
    const { isSidebarPinned } = this.props

    !isSidebarPinned && this.toggleCollapse()
  }

  render() {
    const { collapsed } = this.state

    return (
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        onCollapse={this.toggleCollapse}
        onMouseEnter={this.handleMouseEvent}
        onMouseLeave={this.handleMouseEvent}
      >
        <Menu collapsed={collapsed} {...this.props} />
      </Sider>
    )
  }
}

const selectors = createStructuredSelector({
  version: selectVersion,
  isSuperUser: selectIsSuperUser,
  isStaff: selectIsStaff,
  isSidebarPinned: selectIsSidebarPinned,
})

export default compose(
  withRouter,
  connect(selectors),
)(DesktopSidebar)
