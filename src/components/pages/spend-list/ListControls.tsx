import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useState } from 'react'

const Stack = Mui.styled(Mui.Stack)<Mui.StackProps>(() => ({
  display: 'flex'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex'
}))

const Paper = Mui.styled(Mui.Paper)(({ theme }) => ({
  width: '100%',
  marginTop: '1rem',
  padding: '1rem',
  flex: 0,
  [theme.breakpoints.between('xs', 'sm')]: {
    backgroundColor: 'inherit'
  }
}))

function ListControls() {
  const [age, setAge] = useState('')

  const handleChange = (event: Mui.SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  return (
    <Mui.Box>
      <Paper elevation={0} variant="outlined">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Mui.Box sx={{ textAlign: 'start', paddingBottom: '1rem' }}>
            <Mui.Typography component="span" sx={{ alignContent: 'flex-start', flexGrow: 1 }}>
              Dates
            </Mui.Typography>
          </Mui.Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Mui.Box sx={{ flexGrow: 1 }}>
            <DatePicker />
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 1 }}>
            <DatePicker />
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 1 }}>
            <DatePicker />
          </Mui.Box>
        </Stack>
      </Paper>

      <Paper elevation={0} variant="outlined">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Mui.Box sx={{ textAlign: 'start', paddingBottom: '1rem' }}>
            <Mui.Typography component="span" sx={{ alignContent: 'flex-start', flexGrow: 1 }}>
              Filters
            </Mui.Typography>
          </Mui.Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Mui.Box sx={{ flexGrow: 1 }}>
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
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 1 }}>
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
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 1 }}>
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
          </Mui.Box>
        </Stack>
      </Paper>
    </Mui.Box>
  )
}

export default ListControls
