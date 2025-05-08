import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useNotifications } from '@toolpad/core/useNotifications'
import { Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { BOX_SMALL_PADDING_IN_REM } from '../../../../../constants'
import useSpendFilters from '../../../../../hooks/useSpendFilters'
import ModalBase from '../../../../modal/ModalBase'
import { Button, Select, SmallFieldBox } from '../../../../styled'

// TODO: set "Sin definir" when there is no option checked

const FieldGroupStack = Mui.styled(Mui.Stack)<Mui.StackProps>(() => ({
  display: 'flex'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex'
}))

const FieldGroupPaper = Mui.styled(Mui.Paper)(() => ({
  width: '100%',
  marginTop: `${BOX_SMALL_PADDING_IN_REM}rem`,
  padding: `${BOX_SMALL_PADDING_IN_REM}rem`,
  flex: 0,
  backgroundColor: 'inherit'
}))

const FieldGroupTitle = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flexGrow: 1,
  marginLeft: `${BOX_SMALL_PADDING_IN_REM}rem`
}))

const FieldGroupBoxTitle = Mui.styled(Mui.Box)(() => ({
  textAlign: 'start',
  marginTop: `${BOX_SMALL_PADDING_IN_REM}rem`
}))

function SpendFilters({ isModalOpen, filters, onModalClose, onFiltersSet }: UI.SpendFilterProps) {
  const notifications = useNotifications()

  // TODO: fix startDate and finalDate type error

  const { error, lists, selection, functions, isOpen, isError } = useSpendFilters({ filters })

  const handlePrimaryButtonClick = () => {
    onFiltersSet(
      selection.startDate!,
      selection.finalDate!,
      selection.categoryIds,
      selection.subcategoryIds,
      selection.groupIds,
      selection.accountIds
    )
  }

  const handleSecondaryButtonClick = () => {
    onModalClose()
  }

  const handleStartDateChange = (date: Dayjs | null) => {
    if (!date)
      notifications.show('Start date is null', {
        severity: 'warning'
      })
    else functions.startDate.select(date)
  }

  const handleFinalDateChange = (date: Dayjs | null) => {
    if (!date)
      notifications.show('Final date is null', {
        severity: 'warning'
      })
    else functions.startDate.select(date)
  }

  const handleCategoriesChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const {
      target: { value }
    } = event
    functions.categories.select(
      typeof value === 'string'
        ? value.split(',').map((value) => parseInt(value))
        : (value as number[])
    )
  }

  const handleCategoriesClick = () => {
    functions.categories.toggle()
  }

  const handleCategoriesRenderValue = (selected: unknown) => {
    return <Mui.Typography>{functions.categories.getNames(selected)}</Mui.Typography>
  }

  const handleSubcategoriesChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const {
      target: { value }
    } = event
    functions.subcategories.select(
      typeof value === 'string'
        ? value.split(',').map((value) => parseInt(value))
        : (value as number[])
    )
  }

  const handleSubcategoriesClick = () => {
    functions.subcategories.toggle()
  }

  const handleSubcategoriesRenderValue = (selected: unknown) => {
    return <Mui.Typography>{functions.subcategories.getNames(selected)}</Mui.Typography>
  }

  const handleGroupsChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const {
      target: { value }
    } = event
    functions.groups.select(
      typeof value === 'string'
        ? value.split(',').map((value) => parseInt(value))
        : (value as number[])
    )
  }

  const handleGroupsClick = () => {
    functions.groups.toggle()
  }

  const handleGroupsRenderValue = (selected: unknown) => {
    return <Mui.Typography>{functions.groups.getNames(selected)}</Mui.Typography>
  }

  const handleAccountsChange = (event: Mui.SelectChangeEvent<unknown>) => {
    const {
      target: { value }
    } = event
    functions.accounts.select(
      typeof value === 'string'
        ? value.split(',').map((value) => parseInt(value))
        : (value as number[])
    )
  }

  const handleAccountsClick = () => {
    functions.accounts.toggle()
  }

  const handleAccountsRenderValue = (selected: unknown) => {
    return <Mui.Typography>{functions.accounts.getNames(selected)}</Mui.Typography>
  }

  useEffect(() => {
    if (isError) {
      notifications.show(error!, {
        severity: 'warning'
      })
    }
  }, [error, isError, notifications])

  const primaryActionButton = (
    <Button onClick={handlePrimaryButtonClick} color="primary" autoFocus>
      APPLY
    </Button>
  )

  const secondaryActionButton = (
    <Button onClick={handleSecondaryButtonClick} color="primary">
      Cancel
    </Button>
  )

  const modalBaseProps: Omit<ModalBaseProps, 'children'> = {
    title: '',
    primaryActionButton,
    secondaryActionButton,
    open: isModalOpen,
    onClose: () => alert('Not implemented')
  }

  // TODO: set date format as constant

  const dateFormat = 'DD/MM/YYYY'

  const startDateProps: Partial<XDatePickers.DatePickerFieldProps<Dayjs>> = {
    value: selection.startDate,
    format: dateFormat,
    onChange: handleStartDateChange
  }

  const finalDateProps: Partial<XDatePickers.DatePickerFieldProps<Dayjs>> = {
    value: selection.finalDate,
    format: dateFormat,
    onChange: handleFinalDateChange
  }

  const commonMenuProps: Mui.MenuProps = {
    open: false,
  }

  const variant = 'standard'

  const fullWidth = true

  const multiple = true

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

  const categorySelectLabel = 'Category'

  const categorySelectId = 'category-select'

  const categoryInputLabelProps: Mui.InputLabelProps = {
    htmlFor: categorySelectId
  }

  const categoryMenuProps: Mui.MenuProps = {
    ...commonMenuProps,
    open: isOpen.categories
  }

  const categorySelectProps: Mui.SelectProps = {
    id: categorySelectId,
    label: categorySelectLabel,
    value: selection.categoryIds,
    disabled: lists.categories.length == 0,
    MenuProps: categoryMenuProps,
    variant,
    fullWidth,
    multiple,
    renderValue: handleCategoriesRenderValue,
    onChange: handleCategoriesChange,
    onClick: handleCategoriesClick
  }

  const subcategorySelectLabel = 'Subcategory'

  const subcategorySelectId = 'subcategory-select'

  const subcategoryMenuProps: Mui.MenuProps = {
    ...commonMenuProps,
    open: isOpen.subcategories
  }

  const subcategorySelectProps: Mui.SelectProps = {
    id: subcategorySelectId,
    label: subcategorySelectLabel,
    value: selection.subcategoryIds,
    disabled: lists.subcategories.length == 0,
    MenuProps: subcategoryMenuProps,
    variant,
    fullWidth,
    multiple,
    renderValue: handleSubcategoriesRenderValue,
    onChange: handleSubcategoriesChange,
    onClick: handleSubcategoriesClick
  }

  const subcategoryInputLabelProps: Mui.InputLabelProps = {
    htmlFor: subcategorySelectId
  }

  const groupSelectLabel = 'Group'

  const groupSelectId = 'group-select'

  const groupMenuProps: Mui.MenuProps = {
    ...commonMenuProps,
    open: isOpen.groups
  }

  const groupSelectProps: Mui.SelectProps = {
    id: groupSelectId,
    label: groupSelectLabel,
    value: selection.groupIds,
    disabled: lists.groups.length == 0,
    MenuProps: groupMenuProps,
    variant,
    fullWidth,
    multiple,
    renderValue: handleGroupsRenderValue,
    onChange: handleGroupsChange,
    onClick: handleGroupsClick
  }

  const groupInputLabelProps: Mui.InputLabelProps = {
    htmlFor: groupSelectId
  }

  const accountSelectLabel = 'Account'

  const accountSelectId = 'account-select'

  const accountMenuProps: Mui.MenuProps = {
    ...commonMenuProps,
    open: isOpen.accounts
  }

  const accountSelectProps: Mui.SelectProps = {
    id: accountSelectId,
    label: accountSelectLabel,
    value: selection.accountIds,
    disabled: lists.accounts.length == 0,
    MenuProps: accountMenuProps,
    variant,
    fullWidth,
    multiple,
    renderValue: handleAccountsRenderValue,
    onChange: handleAccountsChange,
    onClick: handleAccountsClick
  }

  const accountInputLabelProps: Mui.InputLabelProps = {
    htmlFor: accountSelectId
  }

  return (
    <ModalBase {...modalBaseProps}>
      <Mui.Box>
        <FieldGroupPaper elevation={0} variant="outlined">
          <FieldGroupStack>
            <FieldGroupBoxTitle>
              <FieldGroupTitle component="span">Dates</FieldGroupTitle>
            </FieldGroupBoxTitle>
          </FieldGroupStack>
          <FieldGroupStack direction="row" spacing={1}>
            <SmallFieldBox>
              <DatePicker {...startDateProps} />
            </SmallFieldBox>
            <SmallFieldBox>
              <DatePicker {...finalDateProps} />
            </SmallFieldBox>
          </FieldGroupStack>
        </FieldGroupPaper>
        <FieldGroupPaper elevation={0} variant="outlined">
          <FieldGroupStack>
            <FieldGroupBoxTitle>
              <FieldGroupTitle component="span">Filters</FieldGroupTitle>
            </FieldGroupBoxTitle>
          </FieldGroupStack>
          <FieldGroupStack direction="column" spacing={1}>
            <SmallFieldBox>
              <Mui.FormControl {...formControlProps}>
                <Mui.InputLabel {...categoryInputLabelProps}>{categorySelectLabel}</Mui.InputLabel>
                <Select {...categorySelectProps}>
                  {lists.categories.map((category) => (
                    <Mui.MenuItem key={category.id} value={category.id}>
                      <Mui.Checkbox checked={category.checked} />
                      <Mui.ListItemText primary={category.name} />
                    </Mui.MenuItem>
                  ))}
                </Select>
              </Mui.FormControl>
            </SmallFieldBox>
            <SmallFieldBox>
              <Mui.FormControl {...formControlProps}>
                <Mui.InputLabel {...subcategoryInputLabelProps}>
                  {subcategorySelectLabel}
                </Mui.InputLabel>
                <Select {...subcategorySelectProps}>
                  {lists.subcategories.flatMap((list, index) => [
                    <Mui.ListSubheader key={`header-${index}`}>
                      {functions.subcategories.getParentName(list[0].parentId!)}
                    </Mui.ListSubheader>,
                    ...list.map((subcategory) => (
                      <Mui.MenuItem key={subcategory.id} value={subcategory.id}>
                        <Mui.Checkbox checked={subcategory.checked} />
                        <Mui.ListItemText primary={subcategory.name} />
                      </Mui.MenuItem>
                    ))
                  ])}
                </Select>
              </Mui.FormControl>
            </SmallFieldBox>
            <SmallFieldBox>
              <Mui.FormControl {...formControlProps}>
                <Mui.InputLabel {...groupInputLabelProps}>{groupSelectLabel}</Mui.InputLabel>
                <Select {...groupSelectProps}>
                  {lists.groups.flatMap((subList, index) => [
                    <Mui.ListSubheader key={`header-${index}`}>
                      {functions.groups.getParentName(subList[0].parentId!)}
                    </Mui.ListSubheader>,
                    ...subList.map((group) => (
                      <Mui.MenuItem key={group.id} value={group.id}>
                        <Mui.Checkbox checked={group.checked} />
                        <Mui.ListItemText primary={group.name} />
                      </Mui.MenuItem>
                    ))
                  ])}
                </Select>
              </Mui.FormControl>
            </SmallFieldBox>
            <SmallFieldBox>
              <Mui.FormControl {...formControlProps}>
                <Mui.InputLabel {...accountInputLabelProps}>{accountSelectLabel}</Mui.InputLabel>
                <Select {...accountSelectProps}>
                  {lists.accounts.flatMap((account) => [
                    <Mui.MenuItem key={account.id} value={account.id}>
                      <Mui.Checkbox checked={account.checked} />
                      <Mui.ListItemText primary={account.name} />
                    </Mui.MenuItem>
                  ])}
                </Select>
              </Mui.FormControl>
            </SmallFieldBox>
          </FieldGroupStack>
        </FieldGroupPaper>
      </Mui.Box>
    </ModalBase>
  )
}

export default SpendFilters
