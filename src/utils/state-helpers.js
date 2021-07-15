export const successAction = action => `${action}/success`

export const failAction = action => `${action}/fail`

export const isSuccessAction = action => action.indexOf('/success') !== -1

export const isFailAction = action => action.indexOf('/fail') !== -1
