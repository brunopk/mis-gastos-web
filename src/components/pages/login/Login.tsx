import * as Mui from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { CSSProperties, useContext, useEffect, useMemo, useRef, useState } from 'react'
import GoogleButton from 'react-google-button'
import { useLocation, useNavigate } from 'react-router-dom'
import { Api } from '../../../api/mis-gastos'
import * as constants from '../../../constants'
import { UserContext } from '../../../context/UserContext'
import { authorizeWithGoogle, generateCodeVerifier } from '../../../utils'

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

interface LoginResult {
  isError: boolean
  severity: 'error' | 'warning' | null
  message: string | null
}

function Login() {
  const { setLoginInformation } = useContext(UserContext)

  const didRunRef = useRef(false)

  const { search } = useLocation()

  const searchParams = useMemo(() => new URLSearchParams(search), [search])

  const [result, setResult] = useState<LoginResult>({
    isError: false,
    severity: null,
    message: null
  })

  const navigate = useNavigate()

  const { mutate: authCallback } = useMutation({
    mutationFn: Api.authCallback,
    onSuccess: () => {
      setLoginInformation({ isAuthenticated: true })
      navigate(constants.PATHS.SPENDS.INDEX + constants.PATHS.SPENDS.NEW)
    },
    onError: (error) => {
      if (error instanceof Api.ApiError && error.statusCode < 500) {
        setResult({ isError: true, severity: 'warning', message: error.message })
      } else {
        setResult({ isError: true, severity: 'error', message: error.message })
      }
    }
  })

  const handleLogin = () => {
    const codeVerifier = generateCodeVerifier()
    sessionStorage.setItem(constants.SESSION_STORAGE_PKCE_CODE_VERIFIER, codeVerifier)
    authorizeWithGoogle(codeVerifier)
  }

  useEffect(() => {
    // Prevents sending duplicate requests that cause race conditions on the backend, leading to multiple sessions being created
    if (didRunRef.current) return
    didRunRef.current = true

    if (searchParams.size > 0 && searchParams.has('code')) {
      const authorizationCode = searchParams.get('code')!
      const codeVerifier = sessionStorage.getItem(constants.SESSION_STORAGE_PKCE_CODE_VERIFIER)!
      authCallback({ authorizationCode, codeVerifier })
    }
  }, [searchParams, authCallback])

  const googleButtonStyle: CSSProperties = {
    width: '100%',
    marginTop: `${constants.BOX_PADDING_IN_REM}rem`
  }

  return (
    <Container>
      {result.isError && <Mui.Alert severity={result.severity!}>{result.message}</Mui.Alert>}
      <Paper elevation={1} variant="elevation">
        <LogoBox>
          <img src="icon.png" width={100} height={100} />
        </LogoBox>
      </Paper>
      <GoogleButton onClick={handleLogin} style={googleButtonStyle} />
    </Container>
  )
}

export default Login
