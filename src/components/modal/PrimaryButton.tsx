import { ButtonProps, Button as MuiButton, styled } from '@mui/material'
import { memo, MouseEventHandler } from 'react'
import { BUTTON_WIDTH_IN_REM } from '../../style'

// TODO: create a folder for styled components like Button 

const Button = styled(
  MuiButton,
  {}
)<ButtonProps>(() => ({
  width: `${BUTTON_WIDTH_IN_REM}rem`
}))

type PrimaryButtonProps = {
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

function PrimaryButton({ text, onClick }: PrimaryButtonProps) {
  return (
    <Button onClick={onClick} variant="contained" color="primary" autoFocus>
      {text}
    </Button>
  )
}

export default memo(PrimaryButton)
