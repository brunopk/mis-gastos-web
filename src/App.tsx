import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NotFound from './components/NotFound'

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark'
    },
    components: {
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: 'none'
            },
            '&:focus': {
              outline: 'none'
            }
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: 'none'
            },
            '&:focus': {
              outline: 'none'
            }
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
