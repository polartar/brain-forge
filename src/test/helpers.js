import { keys } from 'lodash'

export function changeInputValue(inputWrapper, value) {
  inputWrapper.simulate('change', { target: { value } })
}

export function getInputValue(inputWrapper) {
  return inputWrapper.getDOMNode().value
}

export function updateFormValues(wrapper, data, clear = false) {
  keys(data).forEach(key => {
    changeInputValue(wrapper.find(`input[id="${key}"]`), !clear ? data[key] : '')
  })
}
