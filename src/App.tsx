import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NotificationsProvider, NotificationsProviderSlotProps } from '@toolpad/core/useNotifications'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes'

const queryClient = new QueryClient()

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark'
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '#root': {
            padding: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          },
        },
      },
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

  const slotsProps: NotificationsProviderSlotProps = {
    snackbar: {
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    },
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <NotificationsProvider slotProps={slotsProps}>
            <CssBaseline />
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
            <RouterProvider router={router(queryClient)} />
          </NotificationsProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
