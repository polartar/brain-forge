import React, { Component, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { Button, Layout } from 'antd'
import cx from 'classnames'
import { selectIsSidebarPinned } from 'store/modules/global'
import { selectIsSuperUser, selectIsStaff, selectVersion } from 'store/modules/auth'
import Menu from './Menu'

const { Sider } = Layout

export class MobileSidebar extends Component {
  state = {
    opened: false,
  }

  toggleOpened = () => {
    const { opened } = this.state
    this.setState({ opened: !opened })
  }

  render() {
    const { opened } = this.state

    return (
      <Fragment>
        <Sider width={220} trigger={null} className={cx('sidebar', { 'sidebar--opened': opened })}>
          <Button
            className="sidebar__toggler"
            icon={opened ? 'menu-fold' : 'menu-unfold'}
            type="primary"
            onClick={this.toggleOpened}
          />
          <Menu {...this.props} />
        </Sider>

        {opened && <div className="sidebar__back" onClick={() => this.toggleOpened()} />}
      </Fragment>
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
)(MobileSidebar)
