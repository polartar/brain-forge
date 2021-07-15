import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import { Button, Col, Dropdown, Icon, Layout, Menu, Row, Badge } from 'antd'
import { BREAKPOINTS } from 'config/base'
import { toggleSidebarPin, selectIsSidebarPinned } from 'store/modules/global'
import { listNotification, logOut, selectLoggedInUser, selectNotifications } from 'store/modules/auth'
import { getNotificationSocket } from 'utils/sockets'

const { Header: LayoutHeader } = Layout
const { Divider: MenuDivider, Item: MenuItem } = Menu

export class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    history: PropTypes.object,
    notifications: PropTypes.array,
    isSidebarPinned: PropTypes.bool,
    isDesktop: PropTypes.bool,
    toggleSidebarPin: PropTypes.func,
    listNotification: PropTypes.func,
    logOut: PropTypes.func,
  }

  socket = null

  componentWillMount() {
    this.props.listNotification()
  }

  componentDidMount() {
    const { user } = this.props

    this.socket = getNotificationSocket(user.id)
    this.socket.onmessage = this.handleMessageReceived
  }

  handleMessageReceived = message => {
    if (message.data === 'update') {
      this.props.listNotification()
    }
  }

  renderProfileMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      <MenuItem key="/me/profile">
        <Icon type="user" /> Profile
      </MenuItem>
      <MenuDivider />
      <MenuItem key="logOut">
        <Icon type="logout" /> Log out
      </MenuItem>
    </Menu>
  )

  handleMenuClick = evt => {
    const { key } = evt

    if (key === 'logOut') {
      this.props.logOut()
      return
    }

    this.props.history.push(key)
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }

  handleNotificationClick = () => {
    this.props.history.push('/me/notification')
  }

  render() {
    const { user, notifications, isSidebarPinned, isDesktop } = this.props
    const { first_name, last_name } = user

    return (
      <LayoutHeader className="header">
        <Row type="flex" justify="space-between">
          <Col>
            {isDesktop && (
              <Button
                icon="pushpin"
                shape="circle"
                className="mr-05"
                type={isSidebarPinned ? 'primary' : 'default'}
                onClick={() => this.props.toggleSidebarPin()}
              />
            )}
            <Button icon="arrow-left" shape="circle" onClick={this.handleGoBack} />
          </Col>
          <Col>
            <Badge count={notifications.length} className="mr-1">
              <Button icon="notification" onClick={this.handleNotificationClick} />
            </Badge>
            <Dropdown overlay={this.renderProfileMenu()} trigger={['click']} placement="bottomRight">
              <Button>
                {`${first_name} ${last_name}`} <Icon type="caret-down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </LayoutHeader>
    )
  }
}

const selectors = createStructuredSelector({
  notifications: selectNotifications,
  user: selectLoggedInUser,
  isSidebarPinned: selectIsSidebarPinned,
})

const actions = {
  toggleSidebarPin,
  listNotification,
  logOut,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.XL,
})

export default compose(
  withSizes(sizes),
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(Header)
