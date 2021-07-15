import { LANGUAGE } from 'config/base'

export default {
  email: {
    rules: [{ required: true, message: LANGUAGE.required }, { type: 'email', message: LANGUAGE.email.invalid }],
  },
  username: {
    rules: [{ required: true, message: LANGUAGE.required, whitespace: true }],
  },
  password: {
    rules: [
      { required: true, message: LANGUAGE.required },
      { min: 8, message: 'Password must be minimum 8 characters.' }
    ],
  },
  first_name: {
    rules: [{ required: true, message: LANGUAGE.required, whitespace: true }],
  },
  last_name: {
    rules: [{ required: true, message: LANGUAGE.required, whitespace: true }],
  },
}
