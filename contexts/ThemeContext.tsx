import { createContext } from 'react'

import { ThemeContextInterface } from '../hooks/useTheme'

const ThemeContext = createContext<ThemeContextInterface>(null)

export default ThemeContext
