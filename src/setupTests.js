import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({
  adapter: new Adapter(),
})

global.console.warn = jest.fn()

global.console.error = jest.fn()

global.window.scrollTo = jest.fn()
