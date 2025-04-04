import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import SnackBar from './components/SnackBar'
import { SnackBarProvider } from './context/SnackBarContext'
import { router } from './Routes'

const queryClient = new QueryClient()

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackBarProvider>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <SnackBar />
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
            <RouterProvider router={router(queryClient)} />
          </QueryClientProvider>
        </SnackBarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
