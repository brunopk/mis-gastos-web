import * as Mui from '@mui/material'
import { Fragment, memo} from 'react'

const WIDTH = 500

const PADDING_IN_REM = 0.25

const DialogTitle = Mui.styled(
  Mui.DialogTitle,
  {}
)<Mui.DialogTitleProps>(() => ({
  padding: `${PADDING_IN_REM * 4}rem ${PADDING_IN_REM * 6}rem ${PADDING_IN_REM * 6}rem ${PADDING_IN_REM * 6}rem`
}))

const DialogContent = Mui.styled(
  Mui.DialogContent,
  {}
)<Mui.DialogContentProps>(({theme}) => ({
  padding: `inherit ${PADDING_IN_REM * 6}rem`,
  [theme.breakpoints.up('sm')]: {
    width: `${WIDTH}px`
  },
}))

const DialogActions = Mui.styled(
  Mui.DialogActions,
  {}
)<Mui.DialogActionsProps>(() => ({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',
  padding: `${PADDING_IN_REM * 4}rem ${PADDING_IN_REM * 6}rem`
}))


function ModalBase({
  children,
  open,
  title,
  primaryActionButton,
  secondaryActionButton,
  onClose
}: ModalBaseProps) {
  const handleModalClose = () => {
    onClose()
  }

  const theme = Mui.useTheme()

  const isSmallScreen = Mui.useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Fragment>
      <Mui.Dialog
        open={open}
        onClose={handleModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={isSmallScreen}
      >
          <DialogTitle id="alert-dialog-title" variant="h5">
            {title}
          </DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {primaryActionButton}
            {secondaryActionButton}
          </DialogActions>
      </Mui.Dialog>
    </Fragment>
  )
}

export default memo(ModalBase)
