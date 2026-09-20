import * as Mui from '@mui/material'
import * as constants from '../../../constants'
import { CSSProperties } from 'react'
import GoogleButton from 'react-google-button'

/**************************************************************************************************/
/*                                            CONSTANTS                                           */
/**************************************************************************************************/

const Container = Mui.styled(Mui.Box)<Mui.BoxProps>(({ theme }) => ({
  backgroundColor: 'inherit',
  [theme.breakpoints.up('sm')]: {
    width: `${constants.MODAL_WIDTH / 1.25}px`
  },
  [theme.breakpoints.down('sm')]: {
    flex: 1
  }
}))

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  padding: `${constants.BOX_PADDING_IN_REM * 2}rem 0 ${constants.BOX_PADDING_IN_REM * 2}rem 0`,
  marginTop: `${constants.BOX_PADDING_IN_REM}rem`
}))

const LogoBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'center'
}))

/**************************************************************************************************/
/*                                         MAIN COMPONENT                                         */
/**************************************************************************************************/

function Login() {
  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_MIS_GASTOS_OAUTH2_GOOGLE_AUTH_URL
  }

  const googleButtonStyle: CSSProperties = {
    width: '100%',
    marginTop: `${constants.BOX_PADDING_IN_REM}rem`
  }

  return (
    <Container>
      <Paper elevation={1} variant="elevation">
        <LogoBox>
          <img src="icon.png" width={100} height={100} />
        </LogoBox>
      </Paper>
      <GoogleButton onClick={handleLogin} style={googleButtonStyle} />
    </Container>
  )
}

/**************************************************************************************************/
/*                                           EXPORTS                                              */
/**************************************************************************************************/

export default Login
