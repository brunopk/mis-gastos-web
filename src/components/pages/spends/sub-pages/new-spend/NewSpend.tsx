import * as Mui from '@mui/material'
import { useState } from 'react'
import Page from '../../../../Page'
import MainMenu from '../../MainMenu'

const Box = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: '1rem'
}))

const FormControl = Mui.styled(Mui.FormControl)<Mui.FormControlProps>(() => ({
  flex: 1,
  width: '100%'
}))

const TextField = Mui.styled(Mui.TextField)<Mui.TextFieldProps>(() => ({
  flex: 1
}))

function NewSpend() {
  const [age, setAge] = useState('')

  const [group, setGroup] = useState<string>()

  const handleChange = () => {
    alert('Not implemented')
  }

  const handleGroupChange = (event: Mui.SelectChangeEvent) => {
    setGroup(event.target.value)
  }

  return (
    <Page mainMenu={<MainMenu />}>
      <FormControl>
        <Box>
          <Mui.FormControl variant="standard" fullWidth>
            <Mui.InputLabel id="category-select-label" >Category</Mui.InputLabel>
            <Mui.Select
              labelId="category-select-label"
              id="demo-simple-select"
              value={age}
              label="Category"
              onChange={handleChange}
              variant='standard'
              fullWidth
            >
              <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
              <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
              <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
            </Mui.Select>
          </Mui.FormControl>
        </Box>
        <Box>
          <Mui.FormControl variant="standard" fullWidth>
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
        <Box>
          <Mui.FormControl variant="standard" fullWidth>
            <Mui.InputLabel id="demo-simple-select-label">Group</Mui.InputLabel>
            <Mui.Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Group"
              onChange={handleGroupChange}
            >
              <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
              <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
              <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
            </Mui.Select>
          </Mui.FormControl>
        </Box>
        <Box>
          <Mui.FormControl variant="standard" fullWidth>
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
        </Box>
        <Box>
          <TextField
            id="timeout-textfield"
            label="Value"
            defaultValue="0"
            variant="filled"
            type="number"
          />
        </Box>
        <Mui.Typography>Work in progress 🚧</Mui.Typography>
      </FormControl>
    </Page>
  )
}

export default NewSpend
