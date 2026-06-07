import { ComponentType } from 'react'
import Taro from '@tarojs/taro'

import './app.scss'

function App({ children }: { children: React.ReactNode }) {
  Taro.useLaunch(() => {
    console.log('App launched.')
  })

  return children
}

export default App as ComponentType
