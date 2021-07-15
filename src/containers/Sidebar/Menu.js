import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Icon, Menu as AntMenu, Tooltip } from 'antd'

const { Item: MenuItem } = AntMenu

export default class Menu extends Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    version: PropTypes.string,
    isSuperUser: PropTypes.bool,
    isStaff: PropTypes.bool,
    location: PropTypes.object,
    history: PropTypes.object,
  }

  static defaultProps = {
    collapsed: false,
  }

  handleMenuClick = ({ key }) => {
    this.props.history.push(key)
  }

  render() {
    const { collapsed, isSuperUser, isStaff, location, version } = this.props

    return (
      <Fragment>
        <div
          className="sidebar__logo"
          onClick={() => {
            this.handleMenuClick({ key: '/study' })
          }}
        >
          {collapsed ? (
            <Fragment>
              <img src="/logos/brainforge_brain_icon.svg" alt="BrainForge!" />
              <img src="/logos/brainforge_text.svg" alt="BrainForge!" />
            </Fragment>
          ) : (
            <img src="/logos/brainforge_logo.svg" alt="BrainForge!" />
          )}
        </div>
        <AntMenu theme="dark" mode="inline" selectedKeys={[location.pathname]} onClick={this.handleMenuClick}>
          <MenuItem key="/study">
            <Icon type="book" />
            <span>Studies</span>
          </MenuItem>
          <MenuItem key="/analysis-run">
            <Icon type="play-square" />
            <span>Run Analysis</span>
          </MenuItem>
          <MenuItem key="/status">
            <Icon type="dashboard" />
            <span>Status</span>
          </MenuItem>
          <MenuItem key="/data-directory">
            <Icon type="audit" />
            <span>Data Directory</span>
          </MenuItem>
          <MenuItem key="/protocol-mapping">
            <Icon type="snippets" />
            <span>Set Protocol Mapping</span>
          </MenuItem>
          <MenuItem key="/parameter-set">
            <Icon type="ordered-list" />
            <span>Parameter Sets</span>
          </MenuItem>
          <MenuItem key="/analysis-plans">
            <Icon type="select" />
            <span>Analysis Plans</span>
          </MenuItem>
          {isSuperUser && (
            <MenuItem key="/site">
              <Icon type="appstore" />
              <span>Sites</span>
            </MenuItem>
          )}
          {!isSuperUser && (
            <MenuItem key="/my-site">
              <Icon type="appstore" />
              <span>My Site</span>
            </MenuItem>
          )}
          <MenuItem key="/scanner">
            <Icon type="scan" />
            <span>Scanners</span>
          </MenuItem>
          <MenuItem key="/data/new">
            <Icon type="database" />
            <span>Upload Data</span>
          </MenuItem>
          {isSuperUser && (
            <MenuItem key="/tag">
              <Icon type="tag" />
              <span>Tags</span>
            </MenuItem>
          )}
          {(isSuperUser || isStaff) && (
            <MenuItem key="/users">
              <Icon type="user" />
              <span>Users</span>
            </MenuItem>
          )}
          <MenuItem key="/cli-download">
            <Tooltip title={version} placement="topRight">
              <Icon type="code" />
              <span>CLI</span>
            </Tooltip>
          </MenuItem>
          <MenuItem key="/about">
            <Tooltip title={version} placement="topRight">
              <Icon type="clock-circle" />
              <span>About</span>
            </Tooltip>
          </MenuItem>
        </AntMenu>
      </Fragment>
    )
  }
}
