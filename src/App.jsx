import './App.css'
import View from "./View"
import store from './store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <View />
    </Provider>
  )
}

export default App
