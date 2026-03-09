import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { getTheme } from './theme'
import type { ThemeType } from './theme'

interface ThemeContextType {
  themeType: ThemeType
  setTheme: (type: ThemeType) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('app-theme')
    return (saved as ThemeType) || 'default'
  })

  useEffect(() => {
    localStorage.setItem('app-theme', themeType)
  }, [themeType])

  const theme = useMemo(() => getTheme(themeType), [themeType])

  const contextValue = useMemo(() => ({
    themeType,
    setTheme: (type: ThemeType) => setThemeType(type)
  }), [themeType])

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useAppTheme must be used within a CustomThemeProvider')
  }
  return context
}
