import { useNotifications } from '@toolpad/core/useNotifications'
import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import Page from './Page'

function ErrorBoundary() {
  const error = useRouteError()

  const notifications = useNotifications()

  useEffect(() => {
    if (error) {
      notifications.show(error.toString(), {
        severity: 'error'
      })
    }
  }, [error, notifications])

  return (
    <Page>
      <></>
    </Page>
  )
}

export default ErrorBoundary
