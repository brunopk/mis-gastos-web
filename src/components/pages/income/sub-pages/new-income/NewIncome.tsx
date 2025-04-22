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

// TODO: CONTINUE (use useIncomeCreation hook)

function NewIncome() {
  const handleIncomeSourceChange = (event: Mui.SelectChangeEvent<unknown>) => {
    // const incomeSourceId = parseInt(event.target.value as string)
    console.log(event)
    throw new Error(`Not implemented`)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    // const incomeSourceId = parseInt(event.target.value as string)
    console.log(event)
    throw new Error(`Not implemented`)
  }

  const variant = 'standard'

  const fullWidth = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const incomeSourceSelectId = 'income-source-select'

  const incomeSourceSelectLabel = 'Source'

  const incomeSourceSelectLabelId = 'income-source-select-label'

  const accountSelectLabel = 'Account'

  const accountSelectLabelId = 'account-select-label'

  const incomeSourceSelectProps: Mui.SelectProps = {
    id: incomeSourceSelectId,
    label: incomeSourceSelectLabel,
    labelId: incomeSourceSelectLabelId,
    value: 0,
    variant,
    fullWidth,
    onChange: handleIncomeSourceChange
  }

  const incomeSourceInputLabelProps: Mui.InputLabelProps = {
    id: incomeSourceSelectLabelId
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
    variant
  }

  const valueFieldProps: Mui.TextFieldProps = {
    id: 'value-textfield',
    label: 'Value',
    defaultValue: '0',
    type: 'number',
    variant
  }

  return (
    <Page mainMenu={<MainMenu />}>
      <FormControl>
        <Box>
          <DatePicker />
        </Box>
        <Box>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...incomeSourceInputLabelProps}>
              {incomeSourceSelectLabel}
            </Mui.InputLabel>
            <Select {...incomeSourceSelectProps}>
              {[].map((category) => (
                <Mui.MenuItem value={0} key={0}>
                  {category}
                </Mui.MenuItem>
              ))}
            </Select>
          </Mui.FormControl>
        </Box>
        <Box>
          <Mui.FormControl {...formControlProps}>
            <Mui.InputLabel {...accountInputLabelProps}>{accountSelectLabel}</Mui.InputLabel>
            <Select {...accountSelectProps}>
              {[].map((account) => (
                <Mui.MenuItem value={0} key={0}>
                  {account}
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
