import React, { Component, Fragment } from 'react'
import { Tabs, Collapse } from 'antd'
import { isArray, keys } from 'lodash'
import PropTypes from 'prop-types'

const { TabPane } = Tabs
const Panel = Collapse.Panel

export default class ProvenanceView extends Component {
  static propTypes = {
    meminfo: PropTypes.object,
    cpuinfo: PropTypes.object,
    mac_addr: PropTypes.string,
    python: PropTypes.object,
    platform: PropTypes.object,
    docker: PropTypes.object,
    python_packages: PropTypes.object,
    os_packages: PropTypes.object,
  }

  getReadableMem = (num, precision = 2) => {
    const mbNum = num / (1024 * 1024)
    const gbNum = mbNum / 1024

    return gbNum > 0 ? `${gbNum.toFixed(precision)} GB` : `${mbNum.toFixed(precision)} MB`
  }

  render() {
    const { meminfo, cpuinfo, mac_addr, platform, python, docker, python_packages, os_packages } = this.props

    if (keys(cpuinfo).indexOf('flags') !== -1 && isArray(cpuinfo.flags)) {
      cpuinfo.flags = cpuinfo.flags.join(', ')
    }

    return (
      <Fragment>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Overview" key="overview">
            <ul>
              <li>{cpuinfo.brand}</li>
              <li>RAM {this.getReadableMem(meminfo.total, 0)}</li>
              <li>{platform.platform}</li>
              <li>
                Python <i>{cpuinfo.python_version}</i>
              </li>
            </ul>
          </TabPane>
          <TabPane tab="CPU" key="cpuinfo">
            <ul>
              {keys(cpuinfo).map(key => (
                <li key={key}>
                  {key}: <i>{cpuinfo[key]}</i>
                </li>
              ))}
            </ul>
          </TabPane>
          <TabPane tab="Memory" key="meminfo">
            <ul>
              {keys(meminfo).map(key => (
                <li key={key}>
                  {key}: <i>{key === 'percent' ? `${meminfo[key]}%` : this.getReadableMem(meminfo[key])}</i>
                </li>
              ))}
            </ul>
          </TabPane>
          <TabPane tab="OS Platform" key="platform">
            <ul>
              {keys(platform).map(key => (
                <li key={key}>
                  {key}: <i>{platform[key]}</i>
                </li>
              ))}
              <li key={mac_addr}>
                MAC Address: <i>{mac_addr}</i>
              </li>
            </ul>
          </TabPane>
          <TabPane tab="Python" key="python">
            <ul>
              {keys(python).map(key => (
                <li key={key}>
                  {key}: <i>{python[key]}</i>
                </li>
              ))}
            </ul>
          </TabPane>
          <TabPane tab="Docker" key="docker">
            <Collapse>
              <Panel header="Configuration">
                <ul>
                  {keys(docker).map(key => (
                    <li key={key}>
                      {key}: <i>{docker[key]}</i>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel header="Python Packages">
                <ul>
                  {keys(python_packages).map(key => (
                    <li key={key}>
                      {key}: <i>{python_packages[key]}</i>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel header="OS Packages">
                <ul>
                  {keys(os_packages).map(key => (
                    <li key={key}>
                      {key}: <i>{os_packages[key]}</i>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </Fragment>
    )
  }
}
