import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core'
import dayjs, { Dayjs } from 'dayjs'
import { ChangeEvent, FormEvent, memo, useEffect, useMemo } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import * as api from '../../../../../api/mis-gastos'
import * as constants from '../../../../../constants'
import useIncomeCreation from '../../../../../hooks/useIncomeCreation'
import { buildDateFormatter, toDate } from '../../../../../utils'
import Autocomplete from '../../../../Autocomplete'
import Page from '../../../../Page'
import * as Styled from '../../../../styled'
import MainMenu from '../../MainMenu'

const formatDate = buildDateFormatter()

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  width: '100%'
}))

const AttributeBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${constants.BOX_SMALL_PADDING_IN_REM / 8}rem ${constants.BOX_SMALL_PADDING_IN_REM}rem`,
  ':first-of-type': {
    paddingTop: `${constants.BOX_SMALL_PADDING_IN_REM}rem`
  },
  ':last-child': {
    paddingBottom: `${constants.BOX_SMALL_PADDING_IN_REM}rem`
  }
}))

const Attribute = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flexGrow: 0,
  textAlign: 'end',
  paddingLeft: `${constants.BOX_SMALL_PADDING_IN_REM}rem`
}))

const Value = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flex: 1,
  textAlign: 'end'
}))

const FormControl = Styled.FormControl

const FieldBox = Styled.FieldBox

const SmallFieldBox = Styled.SmallFieldBox

const DatePicker = Styled.DatePicker

const Button = Styled.Button

const ButtonBox = Styled.ButtonBox

const TextField = Styled.TextField

const Select = Styled.Select

interface ReimbursedSpend {
  id: string
  date: string
  categoryName: string
  subcategoryName: string
  groupName: string
  accountName: string
  description: string
  value: string
}

interface ApiLists {
  categories: Api.ListItem[]
  subcategories: Api.Subcategory[]
  groups: Api.Group[]
  accounts: Api.ListItem[]
}

function loadReimbursedSpend(spend: Api.Spend, apiLists: ApiLists): ReimbursedSpend {
  if (!spend) {
    return {
      id: constants.UNKNOWN_STRING,
      date: constants.UNKNOWN_STRING,
      categoryName: constants.UNKNOWN_STRING,
      subcategoryName: constants.UNKNOWN_STRING,
      groupName: constants.UNKNOWN_STRING,
      accountName: constants.UNKNOWN_STRING,
      description: constants.UNKNOWN_STRING,
      value: constants.UNKNOWN_STRING
    }
  }

  let categoryName
  try {
    const category = api.utils.findCategory(spend.categoryId!, apiLists.categories)
    categoryName = category.name
  } catch {
    categoryName = constants.UNKNOWN_STRING
  }

  let subcategoryName
  try {
    const subcategory = api.utils.findSubcategory(spend.subcategoryId!, apiLists.subcategories)
    subcategoryName = subcategory.name
  } catch {
    subcategoryName = constants.UNKNOWN_STRING
  }

  let groupName
  try {
    const group = api.utils.findGroup(spend.groupId!, apiLists.groups)
    groupName = group.name
  } catch {
    groupName = constants.UNKNOWN_STRING
  }

  let accountName
  try {
    const account = api.utils.findAccount(spend.accountId, apiLists.accounts)
    accountName = account.name
  } catch {
    accountName = constants.UNKNOWN_STRING
  }

  const id = spend.id!.toString()

  const date = formatDate(spend.date)

  const value = spend.value.toString()

  const description =
    typeof spend.description == 'undefined' || !spend.description
      ? constants.UNKNOWN_STRING
      : spend.description

  return {
    id,
    date,
    categoryName,
    subcategoryName,
    groupName,
    accountName,
    description,
    value
  }
}

function NewIncome() {
  const notifications = useNotifications()

  const apiLists = useLoaderData()

  const { state } = useLocation()

  const { spend }: { spend: Api.Spend } = state || { spend: null }

  const reimbursedSpend = loadReimbursedSpend(spend, apiLists)

  const hookParams: UI.Hooks.UseIncomeCreation.Params = useMemo(
    () => ({
      defaultIncomeTypeId: spend ? constants.REIMBURSEMENT : null,
      excludedIncomeTypeIds: spend ? [] : [constants.REIMBURSEMENT]
    }),
    [spend]
  )

  const { lists, values, functions, warning, isValidated, isWarning } =
    useIncomeCreation(hookParams)

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: api.createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      notifications.show('Income added correctly', {
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

  const handleIncomeTypeChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const incomeTypeId = parseInt(event.target.value as string)
    functions.selectIncomeType(incomeTypeId)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const accountId = parseInt(event.target.value as string)
    functions.selectAccount(accountId)
  }

  const handleDescriptionChange = (value: string) => {
    functions.setDescription(value)
  }

  const handleValueChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseInt(event.target.value as string)
    functions.setValue(value)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    functions.validate()
  }

  const datePickerProps: Partial<XDatePickers.DatePickerFieldProps<Dayjs>> = {
    value: values.date,
    format: constants.DATE_PICKER_FORMAT,
    onChange: handleDateChange
  }

  const variant = 'standard'

  const fullWidth = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const incomeTypeSelectLabel = 'Type'

  const incomeTypeSelectLabelId = 'income-type-select-label'

  const accountSelectLabelId = 'account-select-label'

  const accountSelectLabel = 'Account'

  const incomeTypeSelectProps: Mui.SelectProps = {
    id: 'income-type-select',
    label: incomeTypeSelectLabel,
    labelId: incomeTypeSelectLabelId,
    value: values.incomeType ? values.incomeType.id : '',
    disabled: lists.incomeTypes.length == 1,
    variant,
    fullWidth,
    onChange: handleIncomeTypeChange
  }

  const incomeTypeInputLabelProps: Mui.InputLabelProps = {
    id: incomeTypeSelectLabelId
  }

  const accountSelectProps: Mui.SelectProps = {
    id: 'account-select',
    label: accountSelectLabel,
    labelId: accountSelectLabelId,
    value: values.account ? values.account.id : '',
    disabled: lists.accounts.length == 1,
    variant,
    fullWidth,
    onChange: handleAccountChange
  }

  const accountInputLabelProps: Mui.InputLabelProps = {
    id: accountSelectLabelId
  }

  const descriptionAutocompleteProps: UI.AutocompleteProps = {
    reset: !values.description,
    queryFn: api.getAutocompleteOptionsForIncomeDescription,
    onChange: handleDescriptionChange,
  }

  const valueFieldProps: Mui.TextFieldProps = {
    id: 'value-textfield',
    label: 'Value',
    type: 'number',
    value: values.value ? values.value : '',
    variant,
    onChange: handleValueChange,
    slotProps: {
      inputLabel: {
        shrink: true
      }
    }
  }

  useEffect(() => {
    if (isValidated && !isWarning) {
      functions.reset()
      mutate({
        date: values.date!,
        incomeTypeId: values.incomeType!.id,
        accountId: values.account!.id,
        description: values.description ? values.description : undefined,
        value: values.value!,
        spend: spend ? { 
          id: spend.id!,
          date: dayjs(),
          categoryId: 0,
          subcategoryId: null,
          groupId: null,
          accountId: 0,
          value: 0
        } : undefined
      })
    } else if (isWarning) {
      notifications.show(warning, {
        severity: 'warning'
      })
    }
  }, [mutate, spend, notifications, warning, functions, values, isWarning, isValidated])

  return (
    <Page mainMenu={<MainMenu />}>
      <FormControl component="form" onSubmit={handleSubmit}>
        <FieldBox>
          <DatePicker {...datePickerProps} />
        </FieldBox>
        <FieldBox>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...incomeTypeInputLabelProps}>{incomeTypeSelectLabel}</Mui.InputLabel>
            <Select {...incomeTypeSelectProps}>
              {lists.incomeTypes.map((incomeType) => (
                <Mui.MenuItem value={incomeType.id} key={incomeType.id}>
                  {incomeType.name}
                </Mui.MenuItem>
              ))}
            </Select>
          </Mui.FormControl>
        </FieldBox>
        {spend && (
          <SmallFieldBox>
            <Paper variant="outlined">
              <AttributeBox>
                <Attribute>ID</Attribute>
                <Value>{reimbursedSpend.id}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Date</Attribute>
                <Value>{reimbursedSpend.date}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Category</Attribute>
                <Value>{reimbursedSpend.categoryName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Subcategory</Attribute>
                <Value>{reimbursedSpend.subcategoryName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Group</Attribute>
                <Value>{reimbursedSpend.groupName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Account</Attribute>
                <Value>{reimbursedSpend.accountName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Description</Attribute>
                <Value>{reimbursedSpend.description}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Value</Attribute>
                <Value>{reimbursedSpend.value}</Value>
              </AttributeBox>
            </Paper>
          </SmallFieldBox>
        )}
        <FieldBox>
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
        </FieldBox>
        <FieldBox>
          <Autocomplete {...descriptionAutocompleteProps} />
        </FieldBox>
        <FieldBox>
          <TextField {...valueFieldProps} />
        </FieldBox>
        <ButtonBox>
          <Button variant="contained" type="submit" loading={isPending}>
            SEND
          </Button>
        </ButtonBox>
      </FormControl>
    </Page>
  )
}

export default memo(NewIncome)
