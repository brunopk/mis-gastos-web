import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import * as Mui from '@mui/material'
import { Box } from '@mui/material'
import { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import * as XDatePickers from '@mui/x-date-pickers'
import { useState } from 'react'
import Page from '../../Page'

const Stack = Mui.styled(Mui.Stack)<Mui.StackProps>(() => ({
  display: 'flex'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex'
}))

const Accordion = Mui.styled(Mui.Accordion)(() => ({
  p: 1,
  width: '100%',
  marginTop: '1rem',
  flex: 0
}))

const TableContainer = Mui.styled(Mui.TableContainer)(({ theme }) => ({
  maxHeight: '90%',
  [theme.breakpoints.up('sm')]: {
    maxHeight: '100%'
  }
}))

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  marginTop: '1rem',
  overflow: 'hidden',
  flex: 1
}))

const AccordionSummary = Mui.styled((props: Mui.AccordionSummaryProps) => (
  <Mui.AccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)'
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  }
}))

interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density' | 'button'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

interface Data {
  name: string
  code: string
  population: number
  size: number
  density: number
}

function createData(name: string, code: string, population: number, size: number): Data {
  const density = population / size
  return { name, code, population, size, density }
}

function SpendList() {
  const [age, setAge] = useState('')

  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChange = (event: Mui.SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const columns: readonly Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
      id: 'population',
      label: 'Population',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US')
    },
    {
      id: 'size',
      label: 'Size\u00a0(km\u00b2)',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US')
    },
    {
      id: 'density',
      label: 'Density',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toFixed(2)
    },
    {
      id: 'button',
      label: 'Button',
      minWidth: 170,
      align: 'right'
    }
  ]

  const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
    createData('Brazil', 'BR', 210147125, 8515767),
    createData('Brazil', 'BR', 210147125, 8515767),
    createData('Brazil', 'BR', 210147125, 8515767),
    createData('Brazil', 'BR', 210147125, 8515767),
    createData('Brazil', 'BR', 210147125, 8515767)
  ]

  return (
    <Page>
      <Accordion elevation={0} variant="outlined">
        <AccordionSummary aria-controls="panel1-content" id="panel1-header">
          <Mui.Typography component="span" sx={{ paddingLeft: '1rem' }}>
            Dates
          </Mui.Typography>
        </AccordionSummary>
        <Mui.AccordionDetails>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Box sx={{ flexGrow: 1 }}>
              <DatePicker />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <DatePicker />
            </Box>
          </Stack>
        </Mui.AccordionDetails>
      </Accordion>

      <Accordion elevation={0} variant="outlined">
        <AccordionSummary aria-controls="panel1-content" id="panel1-header">
          <Mui.Typography component="span" sx={{ paddingLeft: '1rem' }}>
            Filters
          </Mui.Typography>
        </AccordionSummary>
        <Mui.AccordionDetails>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Box sx={{ flexGrow: 1 }}>
              <Mui.FormControl fullWidth>
                <Mui.InputLabel id="demo-simple-select-label">Category</Mui.InputLabel>
                <Mui.Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Category"
                  onChange={handleChange}
                >
                  <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
                  <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
                  <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
                </Mui.Select>
              </Mui.FormControl>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Mui.FormControl fullWidth>
                <Mui.InputLabel id="demo-simple-select-label">Subcategory</Mui.InputLabel>
                <Mui.Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Subcategory"
                  onChange={handleChange}
                >
                  <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
                  <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
                  <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
                </Mui.Select>
              </Mui.FormControl>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Mui.FormControl fullWidth>
                <Mui.InputLabel id="demo-simple-select-label">Group</Mui.InputLabel>
                <Mui.Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Group"
                  onChange={handleChange}
                >
                  <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
                  <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
                  <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
                </Mui.Select>
              </Mui.FormControl>
            </Box>
          </Stack>
        </Mui.AccordionDetails>
      </Accordion>

      <Paper variant="outlined">
        <TableContainer>
          <Mui.Table stickyHeader aria-label="sticky table">
            <Mui.TableHead>
              <Mui.TableRow>
                {columns.map((column) => (
                  <Mui.TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </Mui.TableCell>
                ))}
              </Mui.TableRow>
            </Mui.TableHead>
            <Mui.TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <Mui.TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      if (column.id !== 'button') {
                        const value = row[column.id]
                        return (
                          <Mui.TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </Mui.TableCell>
                        )
                      } else {
                        return (
                          <Mui.TableCell key={column.id} align={column.align}>
                            <Mui.Button>{`Button ${row.code}`}</Mui.Button>
                          </Mui.TableCell>
                        )
                      }
                    })}
                  </Mui.TableRow>
                )
              })}
            </Mui.TableBody>
          </Mui.Table>
        </TableContainer>
        <Mui.TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Page>
  )
}

export default SpendList
