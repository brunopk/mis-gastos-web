import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { memo } from 'react'
import { BUTTON_WIDTH_IN_REM, FIELD_BOX_PADDING_IN_REM } from '../../../../../style'
import Page from '../../../../Page'
import MainMenu from '../../MainMenu'

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex',
  flex: 1
}))

const Box = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${FIELD_BOX_PADDING_IN_REM}rem`
}))

const LastBox = Mui.styled(Mui.Box)<Mui.BoxProps>(({ theme }) => ({
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

// TODO: investigate how to validate form fields (maybe using tanstack)

// TODO: avoid unnecessary re-renders if possible

// TODO: set maxHeight for selects lists

// TODO: set current date as default date

// TODO: use FIELD_BOX_PADDING_IN_REM in src/components/pages/spends/sub-pages/new-spend/NewSpend.tsx

// TODO: CONTINUE

function NewIncome() {
  const handleIncomeTypeChange = (event: Mui.SelectChangeEvent<unknown>) => {
    // const incomeTypeId = parseInt(event.target.value as string)
    console.log(event)
    throw new Error(`Not implemented`)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    // const incomeTypeId = parseInt(event.target.value as string)
    console.log(event)
    throw new Error(`Not implemented`)
  }


  const variant = 'standard'

  const fullWidth = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const incomeTypeSelectId = 'income-type-select'

  const incomeTypeSelectLabel = 'Income type'

  const incomeTypeSelectLabelId = 'income-type-select-label'

  const accountSelectLabel = 'Account'

  const accountSelectLabelId = 'account-select-label'

  const incomeTypeSelectProps: Mui.SelectProps = {
    id: incomeTypeSelectId,
    label: incomeTypeSelectLabel,
    labelId: incomeTypeSelectLabelId,
    value: 0,
    variant,
    fullWidth,
    onChange: handleIncomeTypeChange
  }

  const incomeTypeInputLabelProps: Mui.InputLabelProps = {
    id: incomeTypeSelectLabelId
  }

  const accountSelectProps: Mui.SelectProps = {
    id: 'group-select',
    label: accountSelectLabel,
    labelId: accountSelectLabelId,
    value: 0,
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
  }

  const valueFieldProps: Mui.TextFieldProps = {
    id: 'value-textfield',
    label: 'Value',
    defaultValue: '0',
    type: 'number',
    variant,
  }

  return (
    <Page mainMenu={<MainMenu />}>
      <FormControl>
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
          <Button variant="contained">SEND</Button>
        </LastBox>
      </FormControl>
    </Page>
  )
}

export default memo(NewIncome)
