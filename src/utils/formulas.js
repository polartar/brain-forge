import { map, reduce } from 'lodash'
import { TRANSFORMATION_TYPES } from 'config/base'

export const getNames = fields =>
  reduce(
    fields,
    (result, field) => {
      const { name, variable_role, transformation, selected } = field
      if (!selected) {
        return result
      }
      let variable = name
      if (variable_role === 'x' && transformation) {
        variable = `${TRANSFORMATION_TYPES[transformation].code}(${variable})`
      }
      result[variable_role].push(`${variable}`)
      return result
    },
    { x: [], y: [] },
  )

// Utility functions to build each set of terms
export const getLeftHandTerm = y => y[0] || ''
export const getLinearSum = x => x.join(' + ')
export const getQuadraticSum = x => map(x, variable => `I(${variable}**2)`).join(' + ')

// Formular builders
export const constant = fields => {
  const { y } = getNames(fields)
  return `${getLeftHandTerm(y)} ~ 1`
}

export const linear = fields => {
  const { x, y } = getNames(fields)
  return `${getLeftHandTerm(y)} ~ ${getLinearSum(x)}`
}

export const twoWayInteraction = fields => {
  const { x, y } = getNames(fields)
  const rightHandTerm = x.length > 0 ? `(${getLinearSum(x)})**2` : ''
  return `${getLeftHandTerm(y)} ~ ${rightHandTerm}`
}

export const threeWayInteraction = fields => {
  const { x, y } = getNames(fields)
  const rightHandTerm = x.length > 0 ? `(${getLinearSum(x)})**3` : ''
  return `${getLeftHandTerm(y)} ~ ${rightHandTerm}`
}

export const pureQuadratic = fields => {
  const { x, y } = getNames(fields)
  const rightHandTerm = x.length > 0 ? `${getLinearSum(x)} + ${getQuadraticSum(x)}` : ''
  return `${getLeftHandTerm(y)} ~ ${rightHandTerm}`
}

export const fullQuadratic = fields => {
  const { x, y } = getNames(fields)
  const rightHandTerm = x.length > 0 ? `(${getLinearSum(x)})**2 + ${getQuadraticSum(x)}` : ''
  return `${getLeftHandTerm(y)} ~ ${rightHandTerm}`
}

export const custom = () => undefined

export const FORMULA_FUNCTIONS = {
  constant: { label: 'constant', fn: constant },
  linear: { label: 'linear', fn: linear },
  '2-way interaction': { label: '2-way interaction', fn: twoWayInteraction },
  '3-way interaction': { label: '3-way interaction', fn: threeWayInteraction },
  'pure quadratic': { label: 'pure quadratic', fn: pureQuadratic },
  'full quadratic': { label: 'full quadratic', fn: fullQuadratic },
  custom: { label: 'custom', fn: custom },
}

export const generateFormula = (formulaType, customFormula, fields) =>
  formulaType === 'custom' ? customFormula : FORMULA_FUNCTIONS[formulaType].fn(fields)
