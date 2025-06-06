import * as Mui from '@mui/material'
import { useNotifications } from '@toolpad/core'
import { BaseSyntheticEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { debounce, throttle } from 'throttle-debounce'
import * as Styled from './styled'
import { TextField } from './styled'
import { VALUE_WARNING_MSG } from '../constants'

// TODO: adjust throttle and debounce params (times)

function buildThrottledFunction(callback: (text: string) => void) {
  return throttle(500, callback, { noLeading: true, noTrailing: false })
}

function buildDebouncedFunction(callback: (text: string) => void) {
  return debounce(500, callback)
}

function Autocomplete({ reset, queryFn, onChange }: UI.AutocompleteProps) {
  const notifications = useNotifications()

  const [value, setValue] = useState(() => '')

  const [options, setOptions] = useState<string[]>([])

  const variant = 'standard'

  const updateOptions = useCallback(
    (text: string) => {
      queryFn(text).then(
        (result) => {
          // Prevent receiving results for an outdated search text
          if (result.query == text) {
            setOptions(result.options)
          } else {
            notifications.show(
              `Received autocomplete query from API (${result.query}) do not match expected autocomplete query (${text})`,
              {
                severity: 'warning'
              }
            )
          }
        },
        (error: Error) => {
          console.error(error)
        }
      )
    },
    [queryFn, notifications]
  )

  const throttleAutocompletion = useMemo(
    () => buildThrottledFunction(updateOptions),
    [updateOptions]
  )

  const debounceAutocompletion = useMemo(
    () => buildDebouncedFunction(updateOptions),
    [updateOptions]
  )

  const debounceOnChange = useMemo(() => buildDebouncedFunction(onChange), [onChange])

  const handleAutocompleteChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (
    event: BaseSyntheticEvent
  ) => {
    setValue((prevValue) => {
      const currentValue = event.target.value
      if (prevValue.length > 1 && prevValue.length < 10) {
        throttleAutocompletion(prevValue)
      } else if (prevValue.length > 1) {
        debounceAutocompletion(prevValue)
      }
      debounceOnChange(currentValue)
      return currentValue
    })
  }

  const descriptionFieldPropsBuilder: (
    params: Mui.AutocompleteRenderInputParams
  ) => Mui.TextFieldProps = (params) => ({
    ...params,
    id: 'description-textfield',
    label: 'Description',
    variant,
    slotProps: {
      input: {
        type: 'search',
        ...params.InputProps
      },
      inputLabel: {
        shrink: true
      }
    },
    onChange: handleAutocompleteChange
  })

  const descriptionAutocompleteProps: Mui.AutocompleteProps<string, false, true, true> = {
    id: 'description-autocomplete',
    freeSolo: true,
    disableClearable: true, 
    value,
    options,
    renderInput: (params: Mui.AutocompleteRenderInputParams) => (
      <TextField {...descriptionFieldPropsBuilder(params)} />
    )
  }

  useEffect(() => {
    if (reset) setValue('')
  }, [reset, setValue])

  return <Styled.Autocomplete {...descriptionAutocompleteProps} />
}

export default Autocomplete
