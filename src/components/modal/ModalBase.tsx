import * as Mui from '@mui/material'
import { Fragment, memo, ReactElement, ReactNode } from 'react'
import { MODAL_WIDTH } from '../../constants'

/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/

interface ModalBaseProps {
  children: ReactNode
  title: string
  open: boolean
  primaryActionButton: ReactElement
  secondaryActionButton: ReactElement
  onClose: () => void
}

/**************************************************************************************************/
/*                                            CONSTANTS                                           */
/**************************************************************************************************/

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
)<Mui.DialogContentProps>(({ theme }) => ({
  padding: `inherit ${PADDING_IN_REM * 6}rem`,
  [theme.breakpoints.up('sm')]: {
    width: `${MODAL_WIDTH}px`
  }
}))

const DialogActions = Mui.styled(
  Mui.DialogActions,
  {}
)<Mui.DialogActionsProps>(() => ({
  display: 'flex',
  flexGrow: 1,
  padding: `${PADDING_IN_REM * 4}rem ${PADDING_IN_REM * 6}rem`
}))

/**************************************************************************************************/
/*                                         MAIN COMPONENT                                         */
/**************************************************************************************************/

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

  const isSmallScreen = Mui.useMediaQuery(theme.breakpoints.down('sm'))

  const modalDialogProps: Mui.DialogProps = {
    open,
    fullWidth: isSmallScreen,
    'aria-labelledby': 'alert-dialog-title',
    'aria-describedby': 'alert-dialog-description',
    onClose: handleModalClose
  }

  return (
    <Fragment>
      <Mui.Dialog {...modalDialogProps}>
        <DialogTitle id="alert-dialog-title" variant="h5">
          {title}
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          {secondaryActionButton}
          {primaryActionButton}
        </DialogActions>
      </Mui.Dialog>
    </Fragment>
  )
}

/**************************************************************************************************/
/*                                           EXPORTS                                              */
/**************************************************************************************************/

export type {ModalBaseProps}

export default memo(ModalBase)
