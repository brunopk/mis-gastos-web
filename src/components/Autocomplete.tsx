import { AutocompleteProps, AutocompleteRenderInputParams, TextFieldProps } from '@mui/material'
import * as Styled from './styled'
import { TextField } from './styled'
import {throttle, debounce} from 'throttle-debounce'
import {getDescriptionAutocompleteOptions} from '../api/mis-gastos'
import { BaseSyntheticEvent, ChangeEventHandler, useMemo, useState } from 'react'

function buildAutocompleteThrottledFunction(callback: (text: string) => void) {
  return throttle(500, callback, {noLeading: true, noTrailing: false})
}

function buildAutocompleteDebouncedFunction(callback: (text: string) => void) {
  return debounce(500, callback)
}

// debounce(500, autocompleteSearch)
// this.autocompleteSearchThrottled = throttle(500, autocompleteSearch)

 
function Autocomplete() {  
  const [, setValue] = useState(() => "")

  const [options, setOptions] = useState<string[]>([])
  
  const variant = 'standard'

  const updateOptions = (text: string) => {
    getDescriptionAutocompleteOptions(text).then((result) => {
      // Prevent receiving results for an outdated search text
      if (result.search == text)
        setOptions(result.options)
      else {
        console.log(`Search ${text}`)
        console.log(`Result ${result.search}`)
      }
    }, (error: Error) => { console.error(error)})
  }

  const throttle = useMemo(() => buildAutocompleteThrottledFunction(updateOptions), [])

  const debounce = useMemo(() => buildAutocompleteDebouncedFunction(updateOptions), [])

  const handleAutocompleteChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event: BaseSyntheticEvent) => {
    setValue((prevValue) => {
      console.log(`Prev value : ${prevValue}`)
      if (prevValue.length > 1 && prevValue.length < 10) {
        throttle(prevValue)
      } else if (prevValue.length > 1) {
        debounce(prevValue)
      }
      return event.target.value
    })
  }

  const descriptionFieldPropsBuilder: (params: AutocompleteRenderInputParams) => TextFieldProps = (
    params
  ) => ({
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

  const descriptionAutocompleteProps: AutocompleteProps<string, false, true, true> = {
    id: 'description-autocomplete',
    freeSolo: true,
    disableClearable: true,
    options,
    renderInput: (params) => <TextField {...descriptionFieldPropsBuilder(params)} />
  }

  return <Styled.Autocomplete {...descriptionAutocompleteProps} />
}

export default Autocomplete
