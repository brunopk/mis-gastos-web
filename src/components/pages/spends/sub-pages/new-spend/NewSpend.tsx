import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import { FormEvent, memo } from 'react'
import { ApiError, createSpend } from '../../../../../api/mis-gastos'
import { constants, useSpendCreation } from '../../../../../hooks/useSpendCreation'
import { BUTTON_WIDTH_IN_REM } from '../../../../../style'
import Page from '../../../../Page'
import MainMenu from '../../MainMenu'

const UNDEFINED_SUBCATEGORY = constants.UNDEFINED_SUBCATEGORY

const UNDEFINED_GROUP = constants.UNDEFINED_GROUP

const PADDING_IN_REM = 1

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex',
  flex: 1
}))

const Box = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${PADDING_IN_REM}rem`
}))

const LastBox = Mui.styled(Mui.Box)<Mui.BoxProps>(({ theme }) => ({
  display: 'flex',
  flex: 0,
  flexDirection: 'row-reverse',
  padding: `${PADDING_IN_REM}rem`,
  [theme.breakpoints.down('sm')]: {
    flex: 1,
    flexDirection: 'column-reverse'
  }
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

const Button = Mui.styled(Mui.Button)<Mui.ButtonProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    width: `${BUTTON_WIDTH_IN_REM}rem`
  }
}))

// TODO: filter accounts based on category/subcategory/group

// TODO: investigate how to validate form fields (maybe using tanstack)

// TODO: avoid unnecessary re-renders if possible

// TODO: set maxHeight for selects lists

// TODO: set current date as default date

function NewSpend() {
  const { lists, selection, functions } = useSpendCreation()

  const notifications = useNotifications()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createSpend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spends'] })
      notifications.show('Spend added correctly', {
        severity: 'success'
      })
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode < 500) {
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
      categoryId: selection.category.id,
      subcategoryId: selection.subcategory.id,
      groupId: selection.group.id,
      accountId: selection.account.id!,
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

  const descriptionFieldProps: Mui.TextFieldProps = {
    id: 'description-textfield',
    label: 'Description',
    type: 'text',
    variant,
    slotProps: {
      inputLabel: {
        shrink: true
      }
    }
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
      <FormControl component="form" onSubmit={handleSpendCreation}>
        <Box>
          <DatePicker />
        </Box>
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
                  {subcategory.id == UNDEFINED_SUBCATEGORY.id ? (
                    <em>{subcategory.name}</em>
                  ) : (
                    subcategory.name
                  )}
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
                  {group.id == UNDEFINED_GROUP.id ? <em>{group.name}</em> : group.name}
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
          <TextField {...descriptionFieldProps} />
        </Box>
        <Box>
          <TextField {...valueFieldProps} />
        </Box>
        <LastBox>
          <Button variant="contained" type="submit" loading={isPending}>
            SEND
          </Button>
        </LastBox>
      </FormControl>
    </Page>
  )
}

export default memo(NewSpend)
