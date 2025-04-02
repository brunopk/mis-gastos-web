import * as Mui from '@mui/material'
import { memo, useEffect, useState } from 'react'
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

// TODO: filter accounts based on category/subcategory/group

// TODO: investigate how to validate form fields (maybe using tanstack)

// TODO: investigate why tanstack some queries got stuck, maybe its the backend not the frontend, to reproduce it is just reloading the page two or three times

// TODO: avoid unnecessary re-renders maybe removing (not using) useStaticApiLists at all

function defaultListItem(list: Api.ListItem[]): string {
  return list.length > 0 ? list[0].id.toString() : ''
}

function NewSpend() {
  const apiLists = useStaticApiLists()

  const [categories, setCategories] = useState<Api.Category[]>([])

  const [subcategories, setSubcategories] = useState<Api.Subcategory[]>([])

  const [groups, setGroups] = useState<Api.Group[]>([])

  const [accounts, setAccounts] = useState<Api.Account[]>([])
  
  const [category, setCategory] = useState<string>('')

  const [subcategory, setSubcategory] = useState<string>('')

  const [group, setGroup] = useState<string>('')

  const [account, setAccount] = useState<string>('')

  const handleCategoryChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const categoryId = parseInt(event.target.value as string)
    const subcategories = apiLists.filterSubcategories(categoryId)
    const defaultSubcategory = defaultListItem(subcategories)
    setCategory(event.target.value as string)
    setSubcategory(defaultSubcategory)
    setSubcategories(subcategories)
  }

  const handleSubcategoryChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const subcategoryId = parseInt(event.target.value as string)
    const groups = apiLists.filterGroups(subcategoryId)
    const defaultGroup = defaultListItem(groups)
    setSubcategory(event.target.value as string)
    setGroup(defaultGroup)
    setGroups(groups)
  }

  const handleGroupChange = (event: Mui.SelectChangeEvent<unknown>) => {
    setGroup(event.target.value as string)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    setAccount(event.target.value as string)
  }

  useEffect(() => {
    setCategories(apiLists.categories)
    setSubcategories(apiLists.subcategories)
    setGroups(apiLists.groups)
    setAccounts(apiLists.accounts)
  }, [apiLists])

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
    value: category,
    disabled: categories.length === 0,
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
    value: subcategory,
    disabled: subcategories.length == 0,
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
    value: group,
    disabled: groups.length == 0,
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
    value: account,
    disabled: accounts.length == 0,
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
                {categories.map((category) => (
                  <Mui.MenuItem value={category.id} key={category.id}>
                    {category.name}
                  </Mui.MenuItem>
                ))}
              </Select>
            </Mui.FormControl>
          </Box>
          <Box>
            <Mui.FormControl {...formControlProps}>
              <Mui.InputLabel {...subcategoryInputLabelProps}>{subcategorySelectLabel}</Mui.InputLabel>
              <Select {...subcategorySelectProps}>
                {subcategories.map((subcategory) => (
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
                {groups.map((group) => (
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
                {accounts.map((account) => (
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
