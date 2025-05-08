import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useNotifications } from '@toolpad/core'
import { Dayjs } from 'dayjs'
import { memo, useEffect } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import * as api from '../../../../../api/mis-gastos'
import { BOX_SMALL_PADDING_IN_REM } from '../../../../../constants'
import useIncomeCreation from '../../../../../hooks/useIncomeCreation'
import Page from '../../../../Page'
import * as Styled from '../../../../styled'
import MainMenu from '../../MainMenu'

const REIMBURSEMENT = 1

const DEFAULT_CATEGORY = '-'

const DEFAULT_SUBCATEGORY = '-'

const DEFAULT_GROUP = '-'

const DEFAULT_ACCOUNT = '-'

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  width: '100%'
}))

const AttributeBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${BOX_SMALL_PADDING_IN_REM / 8}rem ${BOX_SMALL_PADDING_IN_REM}rem`,
  ':first-child': {
    paddingTop: `${BOX_SMALL_PADDING_IN_REM}rem`
  },
  ':last-child': {
    paddingBottom: `${BOX_SMALL_PADDING_IN_REM}rem`
  }
}))

const Attribute = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flexGrow: 0,
  textAlign: 'end',
  paddingLeft: `${BOX_SMALL_PADDING_IN_REM}rem`
}))

const Value = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flex: 1,
  textAlign: 'end'
}))

// TODO: avoid unnecessary re-renders if possible

// TODO: set current date as default date

// TODO: remove reimbursement as option if spend is not present in useLocation state

// TODO: use new autocomplete component

function NewIncome() {
  const notifications = useNotifications()

  const apiLists = useLoaderData()

  const { state } = useLocation()

  const { spend }: { spend: Api.Spend } = state || { spend: null }

  const { isError, error, lists, functions, selection } = useIncomeCreation({
    defaultIncomeTypeId: spend ? REIMBURSEMENT : undefined
  })

  let spendCategoryName
  try {
    const category = api.utils.findCategory(spend.categoryId!, apiLists.categories)
    spendCategoryName = category.name
  } catch {
    spendCategoryName = DEFAULT_CATEGORY
  }

  let spendSubcategoryName
  try {
    const subcategory = api.utils.findSubcategory(spend.subcategoryId!, apiLists.subcategories)
    spendSubcategoryName = subcategory.name
  } catch {
    spendSubcategoryName = DEFAULT_SUBCATEGORY
  }

  let spendGroupName
  try {
    const group = api.utils.findGroup(spend.groupId!, apiLists.groups)
    spendGroupName = group.name
  } catch {
    spendGroupName = DEFAULT_GROUP
  }

  let spendAccountName
  try {
    const account = api.utils.findAccount(spend.accountId, apiLists.accounts)
    spendGroupName = account.name
  } catch {
    spendGroupName = DEFAULT_ACCOUNT
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

  const dateFormat = 'DD/MM/YYYY'

  const datePickerProps: Partial<XDatePickers.DatePickerFieldProps<Dayjs>> = {
    value: selection.date,
    format: dateFormat,
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
                <Value>{spend.date}</Value>
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
          <Styled.TextField {...descriptionFieldProps} />
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
