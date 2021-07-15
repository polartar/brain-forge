import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Select, Tag } from 'antd'

const { Option } = Select

export default class TagEditor extends Component {
  static propTypes = {
    tags: PropTypes.array,
    selectedTags: PropTypes.array,
    editable: PropTypes.bool,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    selectedTags: [],
  }

  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      selected: props.selectedTags.map(tag => tag.id),
    }
  }

  handleStartEditing = () => {
    this.setState({ isEditing: true })
  }

  handleCancelEditing = () => {
    const { selectedTags } = this.props
    this.setState({ isEditing: false, selected: selectedTags.map(tag => tag.id) })
  }

  handleSelectChange = selected => {
    this.setState({ selected })
  }

  handleSubmit = () => {
    const { selected } = this.state
    this.setState({ isEditing: false })
    this.props.onChange(selected)
  }

  render() {
    const { tags, selectedTags, editable, isLoading } = this.props
    const { isEditing, selected } = this.state

    if (isEditing) {
      return (
        <div className="d-flex align-items-center">
          <Select
            mode="multiple"
            style={{ width: 200 }}
            placeholder="Select tags"
            value={selected}
            className="mr-02"
            onChange={this.handleSelectChange}
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>
                {tag.label}
              </Option>
            ))}
          </Select>
          <Button
            className="m-02"
            shape="circle"
            icon="check"
            size="small"
            disabled={isLoading}
            onClick={this.handleSubmit}
          />
          <Button
            className="m-02"
            shape="circle"
            icon="close"
            size="small"
            disabled={isLoading}
            onClick={this.handleCancelEditing}
          />
        </div>
      )
    }

    return (
      <div className="d-flex align-items-center">
        {selectedTags.map(tag => (
          <Tag key={tag.id} color={tag.color} className="my-02">
            {tag.label}
          </Tag>
        ))}
        {editable && (
          <Button shape="circle" icon="edit" size="small" disabled={isLoading} onClick={this.handleStartEditing} />
        )}
      </div>
    )
  }
}
