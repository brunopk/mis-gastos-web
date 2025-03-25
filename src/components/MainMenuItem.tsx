import * as Mui from '@mui/material'
import { ReactNode, useCallback } from 'react'
import { ICONS_MARGIN_IN_REM } from '../style'

const ListItem = Mui.styled(
  Mui.ListItem,
  {}
)<Mui.ListItemProps & {selected: boolean}>(({ theme }) => ({
  transition: theme.transitions.create('background-color'),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        backgroundColor: theme.palette.action.selected,
        '&:hover': {
          backgroundColor: theme.palette.action.selected
        }
      }
    }
  ]
}))

const Typography = Mui.styled(
  Mui.Typography,
  {}
)<Mui.TypographyProps>(() => ({
  marginLeft: `${ICONS_MARGIN_IN_REM}rem`
}))

type MainMenuItemProps = {
  text: string
  icon: ReactNode
  selected: boolean,
  onClick: () => void
}

function MainMenuItem({ text, icon, selected, onClick }: MainMenuItemProps) {  
  const handleListItemClick = useCallback(() => {
    onClick()
  }, [onClick])

  return (
    <ListItem onClick={handleListItemClick} selected={selected}>
      <Mui.Box />
      {icon}
      <Typography>{text}</Typography>
    </ListItem>
  )
}

export default MainMenuItem
