import * as Mui from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import { FormEvent, memo } from 'react'
import * as api from '../../../../../api/mis-gastos'
import { useSpendCreation } from '../../../../../hooks/useSpendCreation'
import Autocomplete from '../../../../Autocomplete'
import Page from '../../../../Page'
import * as Styled from '../../../../styled'
import MainMenu from '../../MainMenu'

const UNDEFINED_SUBCATEGORY = api.constants.UNDEFINED_SUBCATEGORY

const UNDEFINED_GROUP = api.constants.UNDEFINED_GROUP

// TODO: avoid unnecessary re-renders if possible

// TODO: set current date as default date

function NewSpend() {
  const { lists, selection, functions } = useSpendCreation()

  const notifications = useNotifications()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: api.createSpend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spends'] })
      notifications.show('Spend added correctly', {
        severity: 'success'
      })
    },
    onError: (error) => {
      if (error instanceof api.ApiError && error.statusCode < 500) {
        notifications.show(error.message, {
          severity: 'warning'
        })
      } else {
        notifications.show(error.message, {
          severity: 'error'
        })
      }
    }
  })

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

  // TODO: set the correct date

  // TODO: set the correct description

  // TODO: set the correct value (field value)

  const handleSpendCreation = (event: FormEvent) => {
    event.preventDefault()
    mutate({
      date: new Date().toISOString(),
      categoryId: selection.category!.id,
      subcategoryId: selection.subcategory!.id,
      groupId: selection.group!.id,
      accountId: selection.account!.id,
      value: 10
    })
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
    value: selection.category ? selection.category.id : '',
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
    value: selection.subcategory ? selection.subcategory.id : '',
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
    value: selection.group ? selection.group.id : '',
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
    value: selection.account ? selection.account.id : '',
    disabled: lists.accounts.length == 0,
    variant,
    fullWidth,
    onChange: handleAccountChange
  }

  const accountInputLabelProps: Mui.InputLabelProps = {
    id: accountSelectLabelId
  }

  const valueFieldProps: Mui.TextFieldProps = {
    id: 'value-textfield',
    label: 'Value',
    type: 'number',
    variant,
    slotProps: {
      inputLabel: {
        shrink: true
      }
    }
  }

  return (
    <Page mainMenu={<MainMenu />}>
      <Styled.FormControl component="form" onSubmit={handleSpendCreation}>
        <Styled.FieldBox>
          <Styled.DatePicker />
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...categoryInputLabelProps}>{categorySelectLabel}</Mui.InputLabel>
            <Styled.Select {...categorySelectProps}>
              {lists.categories.map((category) => (
                <Mui.MenuItem value={category.id} key={category.id}>
                  {category.name}
                </Mui.MenuItem>
              ))}
            </Styled.Select>
          </Mui.FormControl>
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...subcategoryInputLabelProps}>
              {subcategorySelectLabel}
            </Mui.InputLabel>
            <Styled.Select {...subcategorySelectProps}>
              {lists.subcategories.map((subcategory) => (
                <Mui.MenuItem value={subcategory.id} key={subcategory.id}>
                  {subcategory.id == UNDEFINED_SUBCATEGORY.id ? (
                    <em>{subcategory.name}</em>
                  ) : (
                    subcategory.name
                  )}
                </Mui.MenuItem>
              ))}
            </Styled.Select>
          </Mui.FormControl>
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...groupInputLabelProps}>{groupSelectLabel}</Mui.InputLabel>
            <Styled.Select {...groupSelectProps}>
              {lists.groups.map((group) => (
                <Mui.MenuItem value={group.id} key={group.id}>
                  {group.id == UNDEFINED_GROUP.id ? <em>{group.name}</em> : group.name}
                </Mui.MenuItem>
              ))}
            </Styled.Select>
          </Mui.FormControl>
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...accountInputLabelProps}>{accountSelectLabel}</Mui.InputLabel>
            <Styled.Select {...accountSelectProps}>
              {lists.accounts.map((account) => (
                <Mui.MenuItem value={account.id} key={account.id}>
                  {account.name}
                </Mui.MenuItem>
              ))}
            </Styled.Select>
          </Mui.FormControl>
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Autocomplete />
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Styled.TextField {...valueFieldProps} />
        </Styled.FieldBox>
        <Styled.ButtonBox>
          <Styled.Button variant="contained" type="submit" loading={isPending}>
            SEND
          </Styled.Button>
        </Styled.ButtonBox>
      </Styled.FormControl>
    </Page>
  )
}

export default memo(NewSpend)
