import { ButtonProps, Button as MuiButton, styled } from '@mui/material'
import { memo, MouseEventHandler } from 'react'
import { BUTTON_WIDTH_IN_REM } from '../../style'

const Button = styled(
  MuiButton,
  {}
)<ButtonProps>(() => ({
  width: `${BUTTON_WIDTH_IN_REM}rem`
}))

type SecondaryButtonProps = {
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

function SecondaryButton({ text, onClick }: SecondaryButtonProps) {
  return (
    <Button onClick={onClick} variant="contained" color="inherit" autoFocus>
      {text}
    </Button>
  )
}

export default memo(SecondaryButton)
