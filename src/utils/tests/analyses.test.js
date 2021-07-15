import { DATA_TYPES, DEFAULT_FORMULA_TYPE, VARIABLE_TYPES, ANALYSIS_STATES } from 'config/base'
import { FileMock, AllAnalysisTypesMock, ParameterSetMock } from 'test/mocks'
import {
  prepareAnalysis,
  prepareField,
  prepareFields,
  prepareFieldNames,
  normalizeFileFields,
  validateFileFields,
  makeId,
  getAnalysisDefaultSorter,
  getOrderingParam,
  parseOrderingParam,
  getAnalysisLabel,
  trimFileExt,
  shortenFilename,
} from '../analyses'

describe('Analyses utils', () => {
  it('prepareAnalysis', () => {
    const analysis = {
      type: 'analysis',
    }

    const result = {
      ...analysis,
      options: { dropMissing: true, formula: undefined, formulaType: DEFAULT_FORMULA_TYPE },
    }

    expect(prepareAnalysis(analysis)).toEqual(result)
  })

  it('prepareField', () => {
    const field = { index: 1, name: 'field1', variable_role: 'role', effect: 'effect' }

    const result = {
      ...field,
      data_type: DATA_TYPES.numeric.code,
      selected: false,
      variable_type: VARIABLE_TYPES.continuous.code,
      transformation: undefined,
    }

    expect(prepareField(field)).toEqual(result)
  })

  it('prepareFields', () => {
    let fields = [
      { index: 1, variable_role: 'role', effect: 'effect' },
      { index: 2, variable_type: 'type', transformation: 'transformation' },
    ]

    fields = prepareFields(fields)

    expect(fields[0].name).toBe(0)
    expect(fields[1].name).toBe(1)
  })

  it('prepareFieldNames', () => {
    const fieldNames = ['c1', 'c2']
    const result = {
      '0': prepareField({ index: 0, name: 'c1' }),
      '1': prepareField({ index: 1, name: 'c2' }),
    }

    expect(prepareFieldNames(fieldNames)).toEqual(result)
  })

  it('normalizeFileFields', () => {
    const file = {
      fields: [{ index: 1 }, { index: 2 }],
    }

    const result = {
      fields: {
        '1': {
          index: 1,
          name: 0,
          data_type: 'numeric',
          selected: false,
          variable_role: 'x',
          variable_type: 'continuous',
          transformation: undefined,
          effect: 'fixed',
        },
        '2': {
          index: 2,
          name: 1,
          data_type: 'numeric',
          selected: false,
          variable_role: 'x',
          variable_type: 'continuous',
          transformation: undefined,
          effect: 'fixed',
        },
      },
    }

    expect(normalizeFileFields(file)).toEqual(result)
  })

  it('validateFileFields', () => {
    let file = FileMock()
    expect(validateFileFields(file)).toBeUndefined()

    file.number_of_rows = 2
    file.fields[0].selected = true
    file.fields[1].selected = true
    expect(validateFileFields(file)).not.toBeUndefined()
  })

  it('makeId', () => {
    const id = makeId()

    expect(id.length).toBe(5)
  })

  it('getAnalysisDefaultSorter', () => {
    expect(getAnalysisDefaultSorter('completed', false)).toEqual(ANALYSIS_STATES.completed.defaultSorter)
    expect(getAnalysisDefaultSorter('completed')).toBe(getOrderingParam(ANALYSIS_STATES.completed.defaultSorter))
  })

  it('getOrderingParam', () => {
    expect(getOrderingParam({ field: 'id', order: 'descend' })).toBe('-id')
    expect(getOrderingParam({ field: 'name', order: 'ascend' })).toBe('name')
    expect(getOrderingParam({ field: 'name' })).toBeUndefined()
  })

  it('parseOrderingParam', () => {
    expect(parseOrderingParam()).toEqual({})
    expect(parseOrderingParam('-session')).toEqual({ order: 'descend', field: 'session', columnKey: 'session' })
    expect(parseOrderingParam('study')).toEqual({ order: 'ascend', field: 'study', columnKey: 'study' })
  })

  it('getAnalysisLabel', () => {
    expect(getAnalysisLabel(AllAnalysisTypesMock(), ParameterSetMock())).toBe('Regression')
  })

  it('trimFileExt', () => {
    expect(trimFileExt('study.test.nii')).toBe('study.test')
  })

  it('shortenFilename', () => {
    expect(shortenFilename('/home/user/test/1.csv')).toBe('user/test/1.csv')
  })
})
