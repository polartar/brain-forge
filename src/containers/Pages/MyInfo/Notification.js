import moment from 'moment'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Alert, Empty, Button } from 'antd'
import { Loader } from 'components'

import {
  listNotification,
  deleteNotification,
  selectNotifications,
  selectAuthStatus,
  LIST_NOTIFICATION,
} from 'store/modules/auth'
import { selectLoggedInUser } from 'store/modules/auth'
import { downloadResult } from 'utils/analyses'
import { getNotificationSocket } from 'utils/sockets'
import { NOTIFICATION_TYPES } from 'config/base'

export class MyNotification extends Component {
  static propTypes = {
    notifications: PropTypes.array,
    status: PropTypes.string,
    listNotification: PropTypes.func,
    deleteNotification: PropTypes.func,
    user: PropTypes.object,
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

  /**
   * Handle download process for a download notification.
   * @param {Integer} id: Notification ID.
   * @param {string} download_url: file path to download.
   */
  handleDownload = (id, download_url) => {
    downloadResult(download_url)
    this.props.deleteNotification(id)
  }

  renderNotifications() {
    const { notifications, status } = this.props

    if (status === LIST_NOTIFICATION) {
      return <Loader />
    }

    if (notifications && notifications.length) {
      return notifications.map(({ id, message, date_time, type, download_url }) => {
        switch (NOTIFICATION_TYPES[type]) {
          case 'download':
            return (
              <Alert
                key={id}
                type="info"
                className="mb-1"
                message={
                  <div className="d-flex justify-content-between px-05">
                    <div>{message}</div>
                    <div>
                      <Button style={{ marginRight: '20px' }} onClick={() => this.handleDownload(id, download_url)}>
                        Download
                      </Button>
                      <span>{moment(date_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
                  </div>
                }
                showIcon
                closable
                banner
                onClose={() => this.props.deleteNotification(id)}
              />
            )
          default:
            return (
              <Alert
                key={id}
                className="mb-1"
                message={
                  <div className="d-flex justify-content-between px-05">
                    <div>{message}</div>
                    <div>{moment(date_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
                }
                showIcon
                closable
                banner
                onClose={() => this.props.deleteNotification(id)}
              />
            )
        }
      })
    }

    return <Empty description="No Notifications" />
  }

  render() {
    return (
      <div>
        <div className="app-page__subheading">Notifications</div>
        {this.renderNotifications()}
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  status: selectAuthStatus,
  user: selectLoggedInUser,
  notifications: selectNotifications,
})

const actions = {
  deleteNotification,
  listNotification,
}

export default connect(
  selectors,
  actions,
)(MyNotification)
