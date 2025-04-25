import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { memo } from 'react'
import { useLoaderData, useLocation } from 'react-router-dom'
import * as apiUtils from '../../../../../api/utils'
import useIncomeCreation from '../../../../../hooks/useIncomeCreation'
import { BUTTON_WIDTH_IN_REM, FIELD_BOX_PADDING_IN_REM } from '../../../../../style'
import Page from '../../../../Page'
import MainMenu from '../../MainMenu'

const REIMBURSEMENT = 1

const DEFAULT_CATEGORY = '-'

const DEFAULT_SUBCATEGORY = '-'

const DEFAULT_GROUP = '-'

const DEFAULT_ACCOUNT = '-'

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  width: '100%'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex',
  flex: 1
}))

const AttributeBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${FIELD_BOX_PADDING_IN_REM / 8}rem ${FIELD_BOX_PADDING_IN_REM}rem`,
  ':first-child': {
    paddingTop: `${FIELD_BOX_PADDING_IN_REM}rem`
  },
  ':last-child': {
    paddingBottom: `${FIELD_BOX_PADDING_IN_REM}rem`
  }
}))

const FieldBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${FIELD_BOX_PADDING_IN_REM}rem`
}))

const ButtonBox = Mui.styled(Mui.Box)<Mui.BoxProps>(({ theme }) => ({
  display: 'flex',
  flex: 0,
  flexDirection: 'row-reverse',
  padding: `${FIELD_BOX_PADDING_IN_REM}rem`,
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

const Attribute = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flexGrow: 0,
  textAlign: 'end',
  paddingLeft: `${FIELD_BOX_PADDING_IN_REM}rem`
}))

const Value = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flex: 1,
  textAlign: 'end'
}))

// TODO: investigate how to validate form fields (maybe using tanstack)

// TODO: avoid unnecessary re-renders if possible

// TODO: set maxHeight for selects lists

// TODO: set current date as default date

// TODO: remove reimbursement as option if spend is not present in useLocation state

function NewIncome() {
  const apiLists = useLoaderData()

  const { state } = useLocation()

  const { spend }: { spend: Api.Spend } = state || { spend: null }

  const { lists, functions, selection } = useIncomeCreation(spend ? REIMBURSEMENT : undefined)

  let spendCategoryName
  try {
    const categoryName = apiUtils.findCategoryName(spend.categoryId!, apiLists.categories)
    spendCategoryName = categoryName
  } catch {
    spendCategoryName = DEFAULT_CATEGORY
  }

  let spendSubcategoryName
  try {
    const subcategoryName = apiUtils.findSubcategoryName(
      spend.subcategoryId!,
      apiLists.subcategories
    )
    spendSubcategoryName = subcategoryName
  } catch {
    spendSubcategoryName = DEFAULT_SUBCATEGORY
  }

  let spendGroupName
  try {
    const groupName = apiUtils.findGroupName(spend.groupId!, apiLists.groups)
    spendGroupName = groupName
  } catch {
    spendGroupName = DEFAULT_GROUP
  }

  let spendAccountName
  try {
    const accountName = apiUtils.findAccountName(spend.accountId, apiLists.accounts)
    spendGroupName = accountName
  } catch {
    spendGroupName = DEFAULT_ACCOUNT
  }

  const handleIncomeTypeChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const incomeTypeId = parseInt(event.target.value as string)
    functions.selectIncomeType(incomeTypeId)
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

  const incomeTypeSelectLabel = 'Type'

  const incomeTypeSelectLabelId = 'income-type-select-label'

  const incomeTypeSelectProps: Mui.SelectProps = {
    id: 'income-type-select',
    label: incomeTypeSelectLabel,
    labelId: incomeTypeSelectLabelId,
    value: selection.incomeType.id ? selection.incomeType.id : '',
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
    value: selection.account.id ? selection.account.id : '',
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
      <FormControl>
        <FieldBox>
          <DatePicker />
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
          <FieldBox>
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
          </FieldBox>
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
          <TextField {...descriptionFieldProps} />
        </FieldBox>
        <FieldBox>
          <TextField {...valueFieldProps} />
        </FieldBox>
        <ButtonBox>
          <Button variant="contained">SEND</Button>
        </ButtonBox>
      </FormControl>
    </Page>
  )
}

export default memo(NewIncome)
