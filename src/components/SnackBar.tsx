import * as Mui from '@mui/material'
import { useEffect, useState } from 'react'
import useSnackBar from '../hooks/useSnackBar'

const Alert = Mui.styled(Mui.Alert)<Mui.AlertProps>(() => ({
  width: '100%'
}))

function SnackBar() {
  const { currentSnackBarMessage } = useSnackBar()

  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState<string | undefined>()

  const [severity, setSeverity] = useState<UI.SnackBarSeverity | undefined>()

  useEffect(() => {
    if (typeof currentSnackBarMessage !== 'undefined') {
      setOpen(true)
      setMessage(currentSnackBarMessage.text)
      setSeverity(currentSnackBarMessage.severity)
    } else {
      setOpen(false)
      setSeverity(undefined)
      setMessage(undefined)
    }
  }, [currentSnackBarMessage])

  const handleClose = () => {
    setOpen(false)
  }

  const snackBarProps = (message?: string): Mui.SnackbarProps => ({
    open,
    message,
    autoHideDuration: 5000,
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
    onClose: handleClose
  })

  const alertProps = (severity: UI.SnackBarSeverity): Mui.AlertProps => ({
    onClose: handleClose,
    severity,
    variant: 'filled'
  })

  return severity ? (
    <Mui.Snackbar {...snackBarProps()}>
      <Alert {...alertProps(severity)}>{message}</Alert>
    </Mui.Snackbar>
  ) : (
    <Mui.Snackbar {...snackBarProps(message)} />
  )
}

export default SnackBar
