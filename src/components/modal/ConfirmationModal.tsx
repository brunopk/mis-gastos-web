import { Typography } from '@mui/material'
import { memo } from 'react'
import ModalBase from './ModalBase'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'

function ConfirmationModal({ open, text, onAccept, onCancel }: UI.ConfirmationModalProps) {
  const primaryActionButton = <PrimaryButton onClick={onAccept} text="YES" />

  const secondaryActionButton = <SecondaryButton onClick={onCancel} text="NO" />

  const modalProps: Omit<UI.ModalBaseProps, 'children'>  = {
    primaryActionButton,
    secondaryActionButton,
    open,
    onClose: () => null
  }

  return (
    <ModalBase {...modalProps}>
      <Typography>{text}</Typography>
    </ModalBase>
  )
}

export default memo(ConfirmationModal)
