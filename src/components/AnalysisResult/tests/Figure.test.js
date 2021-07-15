import React from 'react'
import { mount } from 'enzyme'
import { toBase64Image } from 'utils/common'
import { FigureMock } from 'test/mocks'
import Figure from '../Figure'

const figures = FigureMock(5)

describe('Figure', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<Figure figures={figures} />)
  })

  it('should render figures', () => {
    const firstFigure = wrapper.find('img').first()

    expect(wrapper.find('img').length).toBe(figures.length)
    expect(firstFigure.prop('src')).toBe(toBase64Image(figures[0]))
  })

  it('should render without figures', () => {
    wrapper.setProps({ figures: null })
    expect(wrapper.exists('img')).toBeFalsy()
  })
})
