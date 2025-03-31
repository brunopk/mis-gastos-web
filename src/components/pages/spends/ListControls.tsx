import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {getCategories} from '../../../api/mis-gastos'

const Stack = Mui.styled(Mui.Stack)<Mui.StackProps>(() => ({
  display: 'flex'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex',
}))

const Paper = Mui.styled(Mui.Paper)(() => ({
  width: '100%',
  marginTop: '0.4rem',
  padding: '0.4rem',
  flex: 0,
  backgroundColor: 'inherit'
}))

function ListControls() {
  const [age, setAge] = useState('')

  const [group, setGroup] = useState<string>()

  const query = useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity})

  const handleChange = (event: Mui.SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  const handleGroupChange = (event: Mui.SelectChangeEvent) => {
    setGroup(event.target.value)
  }

  return (
    <Mui.Box>
      <Paper elevation={0} variant="outlined">
        <Stack>
          <Mui.Box sx={{ textAlign: 'start' }}>
            <Mui.Typography component="span" sx={{ flexGrow: 1, marginLeft: '0.4rem'}}>
              Dates
            </Mui.Typography>
          </Mui.Box>
        </Stack>

        <Stack direction='row' spacing={1} sx={{marginTop: '0.4rem'}}>
          <Mui.Box sx={{ flexGrow: 1 }}>
            <DatePicker/>
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 1 }}>
            <DatePicker />
          </Mui.Box>
        </Stack>
      </Paper>

      <Paper elevation={0} variant="outlined">
        <Stack>
          <Mui.Box sx={{ textAlign: 'start' }}>
            <Mui.Typography component="span" sx={{flexGrow: 1, marginLeft: '0.4rem'}}>
              Filters
            </Mui.Typography>
          </Mui.Box>
        </Stack>

        <Stack direction='column' spacing={1} sx={{marginTop: '0.4rem'}}>
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
                onChange={handleGroupChange}
              >
                 {typeof query.data === 'function' && query.data?.map((group) => (
                  <Mui.MenuItem value={group.id} key={group.id}>{group.name}</Mui.MenuItem>
                ))}
              </Mui.Select>
            </Mui.FormControl>
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 1 }}>
            <Mui.FormControl fullWidth>
              <Mui.InputLabel id="demo-simple-select-label">Account</Mui.InputLabel>
              <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Account"
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

      <Paper elevation={0} variant="outlined">
        <Stack>
          <Mui.Box sx={{ textAlign: 'start'}}>
            <Mui.Typography component="span" sx={{ flexGrow: 1, marginLeft: '0.4rem' }}>
              Columns
            </Mui.Typography>
          </Mui.Box>
        </Stack>
        <Stack direction='column' spacing={1} sx={{marginTop: '0.4rem'}}>
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
                <Mui.MenuItem value={40}>Forty</Mui.MenuItem>
              </Mui.Select>
            </Mui.FormControl>
          </Mui.Box>
        </Stack>
      </Paper>
   
    </Mui.Box>
  )
}

export default ListControls
