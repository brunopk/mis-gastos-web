import * as Mui from '@mui/material'
import { BOX_PADDING_IN_REM, MODAL_WIDTH } from '../../../constants'
import { TextField } from '../../styled'

// TODO: continue login implementation 

const Container = Mui.styled(Mui.Box)<Mui.BoxProps>(({ theme }) => ({
  backgroundColor: 'inherit',
  [theme.breakpoints.up('sm')]: {
    width: `${MODAL_WIDTH}px`
  },
  [theme.breakpoints.down('sm')]: {
    flex: 1
  }
}))

const FieldPaper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  padding: `${BOX_PADDING_IN_REM*2}rem 0 ${BOX_PADDING_IN_REM*2}rem 0`,
  marginTop: `${BOX_PADDING_IN_REM*2}rem`
}))

const LogoBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  justifyContent: 'center'
}))

const FieldBox = Mui.styled(Mui.Box)<Mui.BoxProps>(() => ({
  display: 'flex',
  flex: 0,
  padding: `${BOX_PADDING_IN_REM}rem`,
  marginTop: `${BOX_PADDING_IN_REM}rem`
}))

const Button = Mui.styled(Mui.Button)<Mui.ButtonProps>(() => ({
  flex: 1
}))

function Login() {
  const variant = 'standard'

  const usernameFieldProps: Mui.TextFieldProps = {
    id: 'username-textfield',
    label: 'Username',
    type: 'text',
    variant,
    slotProps: {
      inputLabel: {
        shrink: true
      }
    }
  }

  const passwordFieldProps: Mui.TextFieldProps = {
    id: 'password-textfield',
    label: 'Password',
    type: 'password',
    variant,
    slotProps: {
      inputLabel: {
        shrink: true
      }
    }
  }

  return (
    <Container>
      <LogoBox>
        <img src="icon.png" width={100} height={100}/>
      </LogoBox>
      <FieldPaper elevation={0} variant="outlined">
          <FieldBox>
            <TextField {...usernameFieldProps} />
          </FieldBox>
          <FieldBox>
            <TextField {...passwordFieldProps} />
          </FieldBox>
          <FieldBox>
            <Button variant="contained" type="submit">
              LOGIN
            </Button>
          </FieldBox>
      </FieldPaper>
    </Container>
  )
}

export default Login
