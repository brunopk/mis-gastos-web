import * as Mui from '@mui/material'
import { useState } from 'react'
import useStaticApiLists from '../../../../../hooks/useStaticApiLists'
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

const Select = Mui.styled(Mui.Select)<Mui.SelectProps>(() => ({
  textAlign: 'justify'
}))

const TextField = Mui.styled(Mui.TextField)<Mui.TextFieldProps>(() => ({
  flex: 1
}))

function NewSpend() {
  const [age, setAge] = useState('')

  const [group, setGroup] = useState<string>()

  const { categories } = useStaticApiLists()

  const [category, setCategory] = useState<string>(
    categories.length > 0 ? categories[0].id.toString() : ''
  )

  const handleChange = () => {
    alert('Not implemented')
  }

  const handleGroupChange = (event: Mui.SelectChangeEvent) => {
    setGroup(event.target.value)
  }

  const handleCategoryChange = (event: Mui.SelectChangeEvent<unknown>) => {
    setCategory(event.target.value as string)
  }

  const selectVariant = 'standard'

  const selectFullWidth = true

  const categorySelectLabel = 'Category'

  const categorySelectLabelId = 'category-select-label'

  const categorySelectProps: Mui.SelectProps = {
    id: 'category-select',
    label: categorySelectLabel,
    labelId: categorySelectLabelId,
    value: category,
    variant: selectVariant,
    fullWidth: selectFullWidth,
    onChange: handleCategoryChange
  }

  const categoryInputLabelProps: Mui.InputLabelProps = {
    id: categorySelectLabelId
  }

  return (
    <Page mainMenu={<MainMenu />}>
      {categories.length > 0 && (
        <FormControl>
          <Box>
            <Mui.FormControl variant="standard" fullWidth>
              <Mui.InputLabel {...categoryInputLabelProps}>{categorySelectLabel}</Mui.InputLabel>
              <Select {...categorySelectProps}>
                {categories.map((category) => (
                  <Mui.MenuItem value={category.id} key={category.id}>
                    {category.name}
                  </Mui.MenuItem>
                ))}
              </Select>
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
        </FormControl>
      )}
    </Page>
  )
}

export default NewSpend
