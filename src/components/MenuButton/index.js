import React from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Menu } from 'antd'

const MenuButton = ({ buttonName, buttonProps, items, placement, onClick }) => {
  function renderMenu() {
    return (
      <Menu onClick={onClick}>
        {items.map(analysisType => (
          <Menu.Item key={analysisType.label}>{analysisType.name}</Menu.Item>
        ))}
      </Menu>
    )
  }

  return (
    <Dropdown overlay={renderMenu()} trigger={['click']} placement={placement}>
      <Button icon="plus" type="primary" {...buttonProps}>
        {buttonName}
      </Button>
    </Dropdown>
  )
}

MenuButton.propTypes = {
  buttonName: PropTypes.string,
  buttonProps: PropTypes.any,
  items: PropTypes.array,
  placement: PropTypes.string,
  onClick: PropTypes.func,
}

MenuButton.defaultProps = {
  placement: 'bottomRight',
}

export default MenuButton
