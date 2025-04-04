import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import useSnackBar from '../hooks/useSnackBar'
import Page from './Page'

function ErrorBoundary() {
  const error = useRouteError()

  const { pushSnackBarMessage } = useSnackBar()

  useEffect(() => {
    if (error) {
      pushSnackBarMessage({ text: error.toString(), severity: 'error' })
    }
  }, [error, pushSnackBarMessage])

  return (
    <Page>
      <></>
    </Page>
  )
}

export default ErrorBoundary
