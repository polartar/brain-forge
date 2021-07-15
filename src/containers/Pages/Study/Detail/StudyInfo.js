import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Descriptions } from 'antd'
import { get } from 'lodash'
import { CheckIcon, Drawer, StudyForm } from 'components'
import { UPDATE_STUDY } from 'store/modules/sites'
import { successAction } from 'utils/state-helpers'

const { Item } = Descriptions

class StudyInfo extends Component {
  static propTypes = {
    user: PropTypes.object,
    sites: PropTypes.array,
    study: PropTypes.object,
    editable: PropTypes.bool,
    status: PropTypes.string,
    updateStudy: PropTypes.func,
  }

  state = {
    showDrawer: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(UPDATE_STUDY)) {
      this.setState({ showDrawer: false })
    }
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state

    this.setState({ showDrawer: !showDrawer })
  }

  handleSubmit = values => {
    const { id, data } = values

    this.props.updateStudy({ id, data })
  }

  get loading() {
    const { status } = this.props

    return status === UPDATE_STUDY
  }

  render() {
    const { sites, study, editable, user } = this.props
    const { full_name, label, site, principal_investigator, is_managed } = study

    const { showDrawer } = this.state

    return (
      <div>
        <div className="app-page__subheading">
          Study Info {/*editable && <Button shape="circle" size="small" icon="edit" onClick={this.toggleDrawer} />*/}
        </div>

        <div className="w-75">
          <Descriptions bordered column={1} size="small">
            <Item label="Name">{full_name}</Item>
            <Item label="Label">{label}</Item>
            <Item label="Site">{get(site, 'full_name', 'No Site')}</Item>
            <Item label="Principal Investigator">
              {get(principal_investigator, 'username', 'No Principal Investigator')}
            </Item>
            <Item label="Managed">
              <CheckIcon checked={is_managed} />
            </Item>
          </Descriptions>
        </div>

        {editable && (
          <Drawer title="Update Study" visible={showDrawer} onClose={this.toggleDrawer}>
            <StudyForm
              sites={sites}
              user={user}
              study={study}
              submitting={this.loading}
              onSubmit={this.handleSubmit}
              onCancel={this.toggleDrawer}
            />
          </Drawer>
        )}
      </div>
    )
  }
}

export default StudyInfo
