import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useNotifications } from '@toolpad/core'
import { Dayjs } from 'dayjs'
import { memo, useEffect } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import * as api from '../../../../../api/mis-gastos'
import * as constants from '../../../../../constants'
import useIncomeCreation from '../../../../../hooks/useIncomeCreation'
import { buildDateFormatter } from '../../../../../utils'
import Autocomplete from '../../../../Autocomplete'
import Page from '../../../../Page'
import * as Styled from '../../../../styled'
import MainMenu from '../../MainMenu'

// TODO: use mutation to send data (take into account that any warning or error in hook must prevent mutating data)

// TODO: add value, description, and all missing fields to custom hook

// TODO: reset all values after posting data

// TODO: allow nullable income type

const formatDate = buildDateFormatter()

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  width: '100%'
}))

const AttributeBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${constants.BOX_SMALL_PADDING_IN_REM / 8}rem ${constants.BOX_SMALL_PADDING_IN_REM}rem`,
  ':first-child': {
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

function NewIncome() {
  const notifications = useNotifications()

  const apiLists = useLoaderData()

  const { state } = useLocation()

  const { spend }: { spend: Api.Spend } = state || { spend: null }

  const { isError, error, lists, functions, selection } = useIncomeCreation({
    defaultIncomeTypeId: spend ? constants.REIMBURSEMENT : undefined
  })

  let spendCategoryName
  try {
    const category = api.utils.findCategory(spend.categoryId!, apiLists.categories)
    spendCategoryName = category.name
  } catch {
    spendCategoryName = constants.UNKNOWN_CATEGORY
  }

  let spendSubcategoryName
  try {
    const subcategory = api.utils.findSubcategory(spend.subcategoryId!, apiLists.subcategories)
    spendSubcategoryName = subcategory.name
  } catch {
    spendSubcategoryName = constants.UNKNOWN_SUBCATEGORY
  }

  let spendGroupName
  try {
    const group = api.utils.findGroup(spend.groupId!, apiLists.groups)
    spendGroupName = group.name
  } catch {
    spendGroupName = constants.UNKNOWN_GROUP
  }

  let spendAccountName
  try {
    const account = api.utils.findAccount(spend.accountId, apiLists.accounts)
    spendGroupName = account.name
  } catch {
    spendGroupName = constants.UNKNOWN_ACCOUNT
  }

  const handleDateChange = (date: Dayjs | null) => {
    if (!date)
      notifications.show('Date is null', {
        severity: 'warning'
      })
    else functions.selectDate(date)
  }

  const handleIncomeTypeChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const incomeTypeId = parseInt(event.target.value as string)
    functions.selectIncomeType(incomeTypeId)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const accountId = parseInt(event.target.value as string)
    functions.selectAccount(accountId)
  }

  useEffect(() => {
    if (isError) {
      notifications.show(error!, {
        severity: 'warning'
      })
    }
  }, [error, isError, notifications])

  const datePickerProps: Partial<XDatePickers.DatePickerFieldProps<Dayjs>> = {
    value: selection.date,
    format: constants.DATE_FORMAT,
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

  const incomeTypeSelectProps: Mui.SelectProps = {
    id: 'income-type-select',
    label: incomeTypeSelectLabel,
    labelId: incomeTypeSelectLabelId,
    value: selection.incomeTypeId ? selection.incomeTypeId : '',
    disabled: lists.incomeTypes.length == 1,
    variant,
    fullWidth,
    onChange: handleIncomeTypeChange
  }

  const incomeTypeInputLabelProps: Mui.InputLabelProps = {
    id: incomeTypeSelectLabelId
  }

  const accountSelectLabelId = 'account-select-label'

  const accountSelectLabel = 'Account'

  const accountSelectProps: Mui.SelectProps = {
    id: 'account-select',
    label: accountSelectLabel,
    labelId: accountSelectLabelId,
    value: selection.accountId ? selection.accountId : '',
    disabled: lists.accounts.length == 1,
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
      <Styled.FormControl>
        <Styled.FieldBox>
          <Styled.DatePicker {...datePickerProps} />
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...incomeTypeInputLabelProps}>{incomeTypeSelectLabel}</Mui.InputLabel>
            <Styled.Select {...incomeTypeSelectProps}>
              {lists.incomeTypes.map((incomeType) => (
                <Mui.MenuItem value={incomeType.id} key={incomeType.id}>
                  {incomeType.name}
                </Mui.MenuItem>
              ))}
            </Styled.Select>
          </Mui.FormControl>
        </Styled.FieldBox>
        {spend && (
          <Styled.SmallFieldBox>
            <Paper variant="outlined">
              <AttributeBox>
                <Attribute>ID</Attribute>
                <Value>{spend.id}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Date</Attribute>
                <Value>{formatDate(spend.date)}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Category</Attribute>
                <Value>{spendCategoryName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Subcategory</Attribute>
                <Value>{spendSubcategoryName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Group</Attribute>
                <Value>{spendGroupName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Account</Attribute>
                <Value>{spendAccountName}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Description</Attribute>
                <Value>{spend.description}</Value>
              </AttributeBox>
              <AttributeBox>
                <Attribute>Value</Attribute>
                <Value>{spend.value}</Value>
              </AttributeBox>
            </Paper>
          </Styled.SmallFieldBox>
        )}
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
          <Autocomplete query={api.getAutocompleteOptionsForIncomeDescription} />
        </Styled.FieldBox>
        <Styled.FieldBox>
          <Styled.TextField {...valueFieldProps} />
        </Styled.FieldBox>
        <Styled.ButtonBox>
          <Styled.Button variant="contained">SEND</Styled.Button>
        </Styled.ButtonBox>
      </Styled.FormControl>
    </Page>
  )
}

export default memo(NewIncome)
