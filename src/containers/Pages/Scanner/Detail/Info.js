import React from 'react'
import PropTypes from 'prop-types'
import { Descriptions } from 'antd'
import { CheckIcon } from 'components'

const { Item } = Descriptions

const ScannerInfo = ({ scanner, user }) => (
  <div>
    <div className="app-page__subheading">Scanner Info</div>

    <div className="w-50">
      <Descriptions bordered column={1} size="small">
        <Item label="Name">{scanner.full_name}</Item>
        <Item label="Label">{scanner.label}</Item>
        <Item label="Manufacturer">{scanner.manufacturer}</Item>
        <Item label="Model">{scanner.model}</Item>
        <Item label="Field Strength">{scanner.field_strength}</Item>
        <Item label="Managed">
          <CheckIcon checked={scanner.is_managed} />
        </Item>
        <Item label="Shared">
          <CheckIcon checked={scanner.created_by.id !== user.id} />
        </Item>
      </Descriptions>
    </div>
  </div>
)

ScannerInfo.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  scanner: PropTypes.shape({
    full_name: PropTypes.string,
    label: PropTypes.string,
    manufacturer: PropTypes.string,
    model: PropTypes.string,
    field_strength: PropTypes.number,
    is_managed: PropTypes.bool,
    created_by: PropTypes.number,
  }),
}

export default ScannerInfo
