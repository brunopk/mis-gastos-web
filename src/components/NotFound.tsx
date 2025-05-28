import { styled, Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material'
import Page from './Page'

const Typography = styled(MuiTypography)<MuiTypographyProps>(() => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem'
}))

function NotFound() {
  return (
    <Page>
      <Typography variant="h6">⚠️ Not found</Typography>
    </Page>
  )
}

export default NotFound