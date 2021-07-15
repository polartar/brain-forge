import React from 'react'
import { mount } from 'enzyme'
import { GiftResult } from 'components'

const initialProps = {
  id: 1,
  data: {
    out_dir: 'media/output/v000/123+456/',
    save_path: 'media/output/v000/123+456/',
  },
}

describe('GiftResult', () => {
  it('should render component', () => {
    mount(<GiftResult {...initialProps} />)
  })
})
