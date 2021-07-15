import swal from 'sweetalert'
import { toast } from 'react-toastify'
import { some } from 'lodash'

export const swalCreator = (success, successTitle, successText, errorTitle, errorText, other) => {
  swal({
    title: success ? successTitle : errorTitle,
    text: success ? successText : errorText,
    icon: success ? 'success' : 'error',
    ...other,
  })
}

export const toBase64Image = string => `data:image/jpeg;base64, ${string}`

export const getFilename = fullPath => fullPath.replace(/^.*[\\\/]/, '') //eslint-disable-line

export const openToastr = (type, message, config) => {
  toast[type](message, config)
}

const defaultErrorToastConfig = {
  position: 'bottom-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
}

export const showErrorToast = (message, config = defaultErrorToastConfig) => {
  /* istanbul ignore next */
  openToastr('error', message, config)
}

export const getEditableSites = (sites, user) => {
  let res

  if (user.is_superuser) {
    res = sites
  } else if (user.site) {
    res = sites.filter(site => site.id === user.site)
  } else {
    res = []
  }

  return res
}

export const isSharedData = (shared_users, user) => some(shared_users, { id: user.id })

export const getFullname = user => `${user.first_name} ${user.last_name}`

export const getParameterLayouts = fullWidth => {
  return {
    formLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: fullWidth ? 4 : 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: fullWidth ? 20 : 16 },
      },
    },
    gridLayout: fullWidth ? { md: 24 } : { md: 24, lg: 12 },
  }
}

export const arrayMove = (arr, fromIndex, toIndex) => {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
  return arr
}

export const runPromisesAsync = () => {
  return new Promise(resolve => {
    setTimeout(function() {
      setImmediate(() => {
        resolve()
      })
    }, 0)
  })
}
