import { useEffect, useState } from 'react'

import * as themes from '../themes'

export interface ThemeContextInterface {
  theme: object
  setTheme: Function
  changeTheme: Function
}

const useTheme = (defaultTheme): ThemeContextInterface => {
  const [_theme, _setTheme] = useState(defaultTheme || 'theme1')

  const changeTheme = theme => {
    const _themeData = themes[theme]

    if (_themeData) {
      for (const [key, value] of Object.entries(_themeData)) {
        const stringValue = value as string | null
        const root = document.documentElement
        root?.style.setProperty(key, stringValue)
        
      }
    }
  }

  useEffect(() => {
    if (_theme) {
      changeTheme(_theme)
    }
  }, [_theme])

  return {
    changeTheme,
    theme: _theme,
    setTheme: _setTheme,
  }
}

export default useTheme
