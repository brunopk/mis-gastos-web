import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { memo, MouseEventHandler, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useIncomeCreation from '../../../../../hooks/useIncomeCreation'
import { BUTTON_WIDTH_IN_REM, FIELD_BOX_PADDING_IN_REM } from '../../../../../style'
import ConfirmationModal from '../../../../modal/ConfirmationModal'
import Page from '../../../../Page'
import MainMenu from '../../MainMenu'

const DEFAULT_INCOME_SOURCE_ID = 1

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

// TODO: CONTINUE change modal text to show spend (reimbursement for spend)

// TODO: implement reimbursement list

function NewIncome() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { state } = useLocation()

  const { spend } = state || { spend: null }

  const isReimbursement = spend != null

  const { lists, functions, selection } = useIncomeCreation(
    isReimbursement ? DEFAULT_INCOME_SOURCE_ID : undefined
  )

  const handleIncomeSourceChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const incomeSourceId = parseInt(event.target.value as string)
    functions.selectIncomeSource(incomeSourceId)
  }

  const handleAccountChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const accountId = parseInt(event.target.value as string)
    functions.selectAccount(accountId)
  }

  const handleSendClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (isReimbursement) setIsModalOpen(true)
    else sendIncome()
  }

  const handleModalCancellation = () => setIsModalOpen(false)

  const handleModalAccept = () => {
    setIsModalOpen(false)
    sendIncome()
  }

  const sendIncome = () => {
    throw new Error('Not implemented')
  }

  const variant = 'standard'

  const fullWidth = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const incomeSourceSelectLabel = 'Account'

  const incomeSourceSelectLabelId = 'income-source-select-label'

  const incomeSourceSelectProps: Mui.SelectProps = {
    id: 'income-source-select',
    label: incomeSourceSelectLabel,
    labelId: incomeSourceSelectLabelId,
    value: selection.incomeSource.id ? selection.incomeSource.id : '',
    disabled: lists.incomeSources.length == 1,
    variant,
    fullWidth,
    onChange: handleIncomeSourceChange
  }

  const incomeSourceInputLabelProps: Mui.InputLabelProps = {
    id: incomeSourceSelectLabelId
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

  const confirmationModalProps: UI.ConfirmationModalProps = {
    open: isModalOpen,
    text: 'Are you sure you want to add an income associated to this spend ?',
    onCancel: handleModalCancellation,
    onAccept: handleModalAccept
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
              {lists.incomeSources.map((incomeSource) => (
                <Mui.MenuItem value={incomeSource.id} key={incomeSource.id}>
                  {incomeSource.name}
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
          <Button variant="contained" onClick={handleSendClick}>
            SEND
          </Button>
        </LastBox>
      </FormControl>
      <ConfirmationModal {...confirmationModalProps} />
    </Page>
  )
}

export default memo(NewIncome)
