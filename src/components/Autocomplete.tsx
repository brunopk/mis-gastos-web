import { AutocompleteRenderInputParams, TextFieldProps } from '@mui/material'
import * as Styled from './styled'
import { TextField } from './styled'
import {throttle, debounce} from 'throttle-debounce'
import { BaseSyntheticEvent, ChangeEventHandler, useMemo, useState } from 'react'

// TODO: adjust throttle and debounce params (times)

// TODO: remove console log (just notify when result.query != text )

function buildAutocompleteThrottledFunction(callback: (text: string) => void) {
  return throttle(500, callback, {noLeading: true, noTrailing: false})
}

function buildAutocompleteDebouncedFunction(callback: (text: string) => void) {
  return debounce(500, callback)
}

interface AutocompleteProps {
  query: (query: string) => Promise<Api.AutocompleteOptions>
} 

function Autocomplete({query}: AutocompleteProps) {  
  const [, setValue] = useState(() => "")

  const [options, setOptions] = useState<string[]>([])
  
  const variant = 'standard'

  const updateOptions = (text: string) => {
    query(text).then((result) => {
      // Prevent receiving results for an outdated search text
      if (result.query == text)
        setOptions(result.options)
      else {
        console.log(`Search ${text}`)
        console.log(`Result ${result.query}`)
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
