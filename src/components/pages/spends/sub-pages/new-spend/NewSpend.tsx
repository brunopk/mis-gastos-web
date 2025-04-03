import * as Mui from '@mui/material'
import { memo } from 'react'
import useApiLists from '../../../../../hooks/useApiLists'
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

// TODO: filter accounts based on category/subcategory/group

// TODO: investigate how to validate form fields (maybe using tanstack)

// TODO: avoid unnecessary re-renders if possible


function NewSpend() {
  const {lists, selection, functions } = useApiLists()

  const handleCategoryChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const categoryId = parseInt(event.target.value as string)
    functions.selectCategory(categoryId)
  }

  const handleSubcategoryChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const subcategoryId = parseInt(event.target.value as string)
    functions.selectSubcategory(subcategoryId)
  }

  const handleGroupChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const groupId = parseInt(event.target.value as string)
    functions.selectGroup(groupId)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const accountId = parseInt(event.target.value as string)
    functions.selectAccount(accountId)
  }

  const variant = 'standard'

  const fullWidth = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const categorySelectLabel = 'Category'

  const categorySelectLabelId = 'category-select-label'

  const subcategorySelectLabel = 'Subcategory'

  const subcategorySelectLabelId = 'subcategory-select-label'

  const groupSelectLabel = 'Group'

  const groupSelectLabelId = 'group-select-label'

  const accountSelectLabel = 'Account'

  const accountSelectLabelId = 'account-select-label'

  const categorySelectProps: Mui.SelectProps = {
    id: 'category-select',
    label: categorySelectLabel,
    labelId: categorySelectLabelId,
    value: selection.category.id ? selection.category.id : '',
    disabled: lists.categories.length == 0,
    variant,
    fullWidth,
    onChange: handleCategoryChange
  }

  const categoryInputLabelProps: Mui.InputLabelProps = {
    id: categorySelectLabelId
  }

  const subcategorySelectProps: Mui.SelectProps = {
    id: 'subcategory-select',
    label: subcategorySelectLabel,
    labelId: subcategorySelectLabelId,
    value: selection.subcategory.id ? selection.subcategory.id : '',
    disabled: lists.subcategories.length == 0,
    variant,
    fullWidth,
    onChange: handleSubcategoryChange
  }

  const subcategoryInputLabelProps: Mui.InputLabelProps = {
    id: subcategorySelectLabelId
  }

  const groupSelectProps: Mui.SelectProps = {
    id: 'group-select',
    label: groupSelectLabel,
    labelId: groupSelectLabelId,
    value: selection.group.id ? selection.group.id : '',
    disabled: lists.groups.length == 0,
    variant,
    fullWidth,
    onChange: handleGroupChange
  }

  const groupInputLabelProps: Mui.InputLabelProps = {
    id: groupSelectLabelId
  }

  const accountSelectProps: Mui.SelectProps = {
    id: 'group-select',
    label: accountSelectLabel,
    labelId: accountSelectLabelId,
    value: selection.account.id ? selection.account.id : '',
    disabled: lists.accounts.length == 0,
    variant,
    fullWidth,
    onChange: handleAccountChange
  }

  const accountInputLabelProps: Mui.InputLabelProps = {
    id: accountSelectLabelId
  }

  return (
    <Page mainMenu={<MainMenu />}>
      <FormControl>
        <Box>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...categoryInputLabelProps}>{categorySelectLabel}</Mui.InputLabel>
            <Select {...categorySelectProps}>
              {lists.categories.map((category) => (
                <Mui.MenuItem value={category.id} key={category.id}>
                  {category.name}
                </Mui.MenuItem>
              ))}
            </Select>
          </Mui.FormControl>
        </Box>
        <Box>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...subcategoryInputLabelProps}>
              {subcategorySelectLabel}
            </Mui.InputLabel>
            <Select {...subcategorySelectProps}>
              {lists.subcategories.map((subcategory) => (
                <Mui.MenuItem value={subcategory.id} key={subcategory.id}>
                  {subcategory.name}
                </Mui.MenuItem>
              ))}
            </Select>
          </Mui.FormControl>
        </Box>
        <Box>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...groupInputLabelProps}>{groupSelectLabel}</Mui.InputLabel>
            <Select {...groupSelectProps}>
              {lists.groups.map((group) => (
                <Mui.MenuItem value={group.id} key={group.id}>
                  {group.name}
                </Mui.MenuItem>
              ))}
            </Select>
          </Mui.FormControl>
        </Box>
        <Box>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...accountInputLabelProps}>{accountSelectLabel}</Mui.InputLabel>
            <Select {...accountSelectProps}>
              {lists.accounts.map((account) => (
                <Mui.MenuItem value={account.id} key={account.id}>
                  {account.name}
                </Mui.MenuItem>
              ))}
            </Select>
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
    </Page>
  )
}

export default memo(NewSpend)
