import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import axios from 'axios'
import { API_BASE_URL } from 'config/base'
import 'polyfills/localStorage'
import { store } from 'store'
import { getAuthData } from 'utils/storage'
import { toast } from 'react-toastify'
import MainApp from './MainApp'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/core.scss'

import registerServiceWorker from './registerServiceWorker'

toast.configure({
  autoClose: 8000,
  draggable: false,
})

/* Set up axios request interceptor for adding authorization header */
axios.interceptors.request.use(config => {
  const authData = getAuthData()

  if (!config) {
    config = {}
  }

  if (authData) {
    config.headers['Authorization'] = `JWT ${authData.token}`
  }

  return config
})

axios.defaults.baseURL = API_BASE_URL

ReactDOM.render(
  <Provider store={store}>
    <MainApp />
  </Provider>,
  document.getElementById('root'),
)
registerServiceWorker()
