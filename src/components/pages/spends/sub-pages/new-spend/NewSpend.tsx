import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import { Dayjs } from 'dayjs'
import { FormEvent, memo, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import * as api from '../../../../../api/mis-gastos'
import * as constants from '../../../../../constants'
import { useSpendCreation } from '../../../../../hooks/useSpendCreation'
import { toDate } from '../../../../../utils'
import Autocomplete from '../../../../Autocomplete'
import Page from '../../../../Page'
import * as Styled from '../../../../styled'
import MainMenu from '../../MainMenu'

function buildUseSpendCreationHookParams(
  searchParams: URLSearchParams
): UI.Hooks.UseSpendCreation.Params {
  const categoryId = searchParams.get('categoryId')
    ? parseInt(searchParams.get('categoryId')!)
    : null
  const subcategoryId = searchParams.get('subcategoryId')
    ? parseInt(searchParams.get('subcategoryId')!)
    : null
  const groupId = searchParams.get('groupId') ? parseInt(searchParams.get('groupId')!) : null
  const accountId = searchParams.get('accountId') ? parseInt(searchParams.get('accountId')!) : null

  return {
    defaultCategoryId: categoryId && !isNaN(categoryId) ? categoryId : null,
    defaultSubcategoryId: subcategoryId && !isNaN(subcategoryId) ? subcategoryId : null,
    defaultGroupId: groupId && !isNaN(groupId) ? groupId : null,
    defaultAccountId: accountId && !isNaN(accountId) ? accountId : null
  }
}

function NewSpend() {
  const { search } = useLocation()

  const searchParams = useMemo(() => new URLSearchParams(search), [search])

  const spendCreationHookParams = useMemo(
    () => buildUseSpendCreationHookParams(searchParams),
    [searchParams]
  )

  const { lists, values, functions, message, isValidated, isWarning } =
    useSpendCreation(spendCreationHookParams)

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

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) {
      notifications.show('Date is null', {
        severity: 'warning'
      })
    } else {
      const newDate = toDate(date)
      functions.setDate(newDate)
    }
  }

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

  const handleDescriptionChange = (value: string) => {
    functions.setDescription(value)
  }

  const handleValueChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const value = parseInt(event.target.value as string)
    functions.setValue(value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    functions.validate()
  }

  useEffect(() => {
    if (isValidated && !isWarning) {
      functions.reset()
      mutate({
        date: values.date!,
        categoryId: values.category!.id,
        subcategoryId: values.subcategory!.id,
        groupId: values.group!.id,
        accountId: values.account!.id,
        value: values.value! as number
      })
    } else if (isWarning) {
      notifications.show(message, {
        severity: 'warning'
      })
    }
  }, [notifications, message, mutate, functions, values, isWarning, isValidated])

  const variant = 'standard'

  const fullWidth = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const datePickerProps: Partial<XDatePickers.DatePickerFieldProps<Dayjs>> = {
    value: values.date,
    format: constants.DATE_FORMAT,
    onChange: handleDateChange
  }

  const categorySelectLabel = 'Category'

  const categorySelectLabelId = 'category-select-label'

  const categorySelectProps: Mui.SelectProps = {
    id: 'category-select',
    label: categorySelectLabel,
    labelId: categorySelectLabelId,
    value: values.category ? values.category.id : '',
    disabled: lists.categories.length == 0,
    variant,
    fullWidth,
    onChange: handleCategoryChange
  }

  const categoryInputLabelProps: Mui.InputLabelProps = {
    id: categorySelectLabelId
  }

  const subcategorySelectLabel = 'Subcategory'

  const subcategorySelectLabelId = 'subcategory-select-label'

  const subcategorySelectProps: Mui.SelectProps = {
    id: 'subcategory-select',
    label: subcategorySelectLabel,
    labelId: subcategorySelectLabelId,
    value: values.subcategory ? values.subcategory.id : '',
    disabled: lists.subcategories.length == 0,
    variant,
    fullWidth,
    onChange: handleSubcategoryChange
  }

  const subcategoryInputLabelProps: Mui.InputLabelProps = {
    id: subcategorySelectLabelId
  }

  const groupSelectLabel = 'Group'

  const groupSelectLabelId = 'group-select-label'

  const groupSelectProps: Mui.SelectProps = {
    id: 'group-select',
    label: groupSelectLabel,
    labelId: groupSelectLabelId,
    value: values.group ? values.group.id : '',
    disabled: lists.groups.length == 0,
    variant,
    fullWidth,
    onChange: handleGroupChange
  }

  const groupInputLabelProps: Mui.InputLabelProps = {
    id: groupSelectLabelId
  }

  const accountSelectLabel = 'Account'

  const accountSelectLabelId = 'account-select-label'

  const accountSelectProps: Mui.SelectProps = {
    id: 'group-select',
    label: accountSelectLabel,
    labelId: accountSelectLabelId,
    value: values.account ? values.account.id : '',
    disabled: lists.accounts.length == 0,
    variant,
    fullWidth,
    onChange: handleAccountChange
  }

  const accountInputLabelProps: Mui.InputLabelProps = {
    id: accountSelectLabelId
  }

  const descriptionAutocompleteProps: UI.AutocompleteProps = {
    query: api.getAutocompleteOptionsForSpendDescription,
    onChange: handleDescriptionChange
  }

  // TODO: set the correct type for handleValueChange
  
  const valueFieldProps: Mui.TextFieldProps = {
    id: 'value-textfield',
    label: 'Value',
    type: 'number',
    value: values.value,
    variant,
    slotProps: {
      inputLabel: {
        shrink: true
      }
    },
    onChange: handleValueChange
  }

  return (
    <Page mainMenu={<MainMenu />}>
      <Styled.FormControl component="form" onSubmit={handleSubmit}>
        <Styled.FieldBox>
          <Styled.DatePicker {...datePickerProps} />
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
                  {subcategory.id == constants.UNDEFINED_SUBCATEGORY.id ? (
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
                  {group.id == constants.UNDEFINED_GROUP.id ? <em>{group.name}</em> : group.name}
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
          <Autocomplete {...descriptionAutocompleteProps} />
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
