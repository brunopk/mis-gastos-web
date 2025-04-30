import * as Mui from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import useSpendFilters from '../../../../../hooks/useSpendFilters'
import { Select } from '../../../../styled'

// TODO: continue the same idea as in categories and subcategories for groups etc

// TODO: Fix to set names (strings) for subcategories  instead of numbers

const PADDING_IN_REM = 0.4

const FieldGroupStack = Mui.styled(Mui.Stack)<Mui.StackProps>(() => ({
  display: 'flex'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex'
}))

const FieldGroupPaper = Mui.styled(Mui.Paper)(() => ({
  width: '100%',
  marginTop: `${PADDING_IN_REM}rem`,
  padding: `${PADDING_IN_REM}rem`,
  flex: 0,
  backgroundColor: 'inherit'
}))

const FieldBox = Mui.styled(Mui.Box)(() => ({
  flexGrow: 1, 
  padding: `${PADDING_IN_REM}rem`
}))

const FieldGroupTitle = Mui.styled(Mui.Typography)<Mui.TypographyProps>(() => ({
  flexGrow: 1, 
  marginLeft: `${PADDING_IN_REM}rem`
}))

const FieldGroupBoxTitle = Mui.styled(Mui.Box)(() => ({
  textAlign: 'start',
  marginTop: `${PADDING_IN_REM}rem`
}))

function ListFilters() {
  const { lists, selection, functions, isOpen } = useSpendFilters()

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
    console.log('handleSubcategoriesChange')
    console.log(event)
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

  const commonMenuProps: Mui.MenuProps = {
    open: false,
    slotProps: {
      root: {
        style: {
          maxHeight: 300
        }
      }
    }
  }

  const variant = 'standard'

  const fullWidth = true

  const multiple = true

  const categorySelectLabel = 'Category'

  const categorySelectId = 'category-select'

  const subcategorySelectLabel = 'Subcategory'

  const subcategorySelectId = 'subcategory-select'

  const formControlProps: Mui.FormControlProps = {
    variant,
    fullWidth
  }

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
    value: selection.category.ids,
    disabled: lists.categories.length == 0,
    MenuProps: categoryMenuProps,
    variant,
    fullWidth,
    multiple,
    renderValue: handleCategoriesRenderValue,
    onChange: handleCategoriesChange,
    onClick: handleCategoriesClick
  }

  const subcategoryMenuProps: Mui.MenuProps = {
    ...commonMenuProps,
    open: isOpen.subcategories
  }

  const subcategorySelectProps: Mui.SelectProps = {
    id: subcategorySelectId,
    label: subcategorySelectLabel,
    value: selection.subcategory.ids,
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

  return (
    <Mui.Box>
      <FieldGroupPaper elevation={0} variant="outlined">
        <FieldGroupStack>
          <FieldGroupBoxTitle>
            <FieldGroupTitle component="span">
              Dates
            </FieldGroupTitle>
          </FieldGroupBoxTitle>
        </FieldGroupStack>
        <FieldGroupStack direction="row" spacing={1}>
          <FieldBox>
            <DatePicker />
          </FieldBox>
          <FieldBox>
            <DatePicker />
          </FieldBox>
        </FieldGroupStack>
      </FieldGroupPaper>
      <FieldGroupPaper elevation={0} variant="outlined">
        <FieldGroupStack>
          <FieldGroupBoxTitle>
            <FieldGroupTitle component="span">
              Filters
            </FieldGroupTitle>
          </FieldGroupBoxTitle>
        </FieldGroupStack>
        <FieldGroupStack direction="column" spacing={1}>
          <FieldBox>
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
          </FieldBox>
          <FieldBox>
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
                      <Mui.ListItemText primary={subcategory.id} />
                    </Mui.MenuItem>
                  ))
                ])}
              </Select>
            </Mui.FormControl>
          </FieldBox>
        </FieldGroupStack>
      </FieldGroupPaper>
    </Mui.Box>
  )
}

export default ListFilters
