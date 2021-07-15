import {
  getNames,
  getLeftHandTerm,
  getLinearSum,
  getQuadraticSum,
  constant,
  linear,
  twoWayInteraction,
  threeWayInteraction,
  pureQuadratic,
  fullQuadratic,
  custom,
  generateFormula,
} from '../formulas'

describe('Formula utils', () => {
  let fields = [
    { name: 'c1', variable_role: 'x', transformation: 'log', selected: false },
    { name: 'c2', variable_role: 'x', transformation: 'sqrt', selected: true },
    { name: 'c3', variable_role: 'x', transformation: 'log', selected: true },
    { name: 'c4', variable_role: 'x', selected: true },
    { name: 'y', variable_role: 'y', selected: true },
  ]

  let res = { x: ['np.sqrt(c2)', 'np.log(c3)', 'c4'], y: ['y'] }

  let noSelectedFields = [
    { name: 'c1', variable_role: 'x', transformation: 'log', selected: false },
    { name: 'c2', variable_role: 'x', transformation: 'sqrt', selected: false },
    { name: 'c3', variable_role: 'x', transformation: 'log', selected: false },
    { name: 'c4', variable_role: 'x', selected: false },
    { name: 'y', variable_role: 'y', selected: true },
  ]

  it('getNames', () => {
    expect(getNames(fields)).toEqual(res)
  })

  it('getLeftHandTerm', () => {
    expect(getLeftHandTerm([])).toBe('')
    expect(getLeftHandTerm(['a'])).toBe('a')
  })

  it('getLinearSum', () => {
    const x = ['c1', 'c2']
    expect(getLinearSum(x)).toBe('c1 + c2')
  })

  it('getQuadraticSum', () => {
    const x = ['c1', 'c2']
    expect(getQuadraticSum(x)).toBe('I(c1**2) + I(c2**2)')
  })

  it('constant', () => {
    expect(constant(fields)).toBe(`${res.y} ~ 1`)
  })

  it('linear', () => {
    expect(linear(fields)).toBe(`${res.y} ~ ${getLinearSum(res.x)}`)
  })

  it('twoWayInteraction', () => {
    expect(twoWayInteraction(fields)).toBe(`${res.y} ~ (${getLinearSum(res.x)})**2`)
    expect(twoWayInteraction(noSelectedFields)).toBe(`${res.y} ~ `)
  })

  it('threeWayInteraction', () => {
    expect(threeWayInteraction(fields)).toBe(`${res.y} ~ (${getLinearSum(res.x)})**3`)
    expect(threeWayInteraction(noSelectedFields)).toBe(`${res.y} ~ `)
  })

  it('pureQuadratic', () => {
    expect(pureQuadratic(fields)).toBe(`${res.y} ~ ${getLinearSum(res.x)} + ${getQuadraticSum(res.x)}`)
    expect(pureQuadratic(noSelectedFields)).toBe(`${res.y} ~ `)
  })

  it('fullQuadratic', () => {
    expect(fullQuadratic(fields)).toBe(`${res.y} ~ (${getLinearSum(res.x)})**2 + ${getQuadraticSum(res.x)}`)
    expect(fullQuadratic(noSelectedFields)).toBe(`${res.y} ~ `)
  })

  it('custom', () => {
    expect(custom()).toBeUndefined()
  })

  it('generateFormula', () => {
    expect(generateFormula('custom', custom, fields)).toBe(custom)
    expect(generateFormula('constant', constant, fields)).toEqual(constant(fields))
  })
})
