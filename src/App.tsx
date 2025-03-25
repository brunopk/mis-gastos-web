import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NotFound from './components/NotFound'
import NewSpend from './components/pages/spends/sub-pages/new-spend/NewSpend'
import SpendList from './components/pages/spends/sub-pages/spend-list/SpendList'
import ROUTES from './routes'

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
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path={ROUTES.SPENDS.LIST} element={<SpendList />} />
              <Route path={ROUTES.SPENDS.NEW} element={<NewSpend />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
