import { Global, Interpolation, Theme } from '@emotion/react'
import { Skeleton, SwipeableDrawer, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'

const DRAWER_BLEEDING = 56

const Root = styled('div')(() => ({
  height: '100%'
}))

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[800]
  })
}))

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900]
  })
}))

type SecondaryDrawerMobileProps = {
  open: boolean
  onToggle: (newOpen: boolean) => void
}

function SecondaryDrawerMobile({ open, onToggle }: SecondaryDrawerMobileProps) {
  const handleToggle = (newOpen: boolean) => () => {
    onToggle(newOpen)
  }

  const globalStyles: Interpolation<Theme> = {
    '.MuiDrawer-root > .MuiPaper-root': {
      overflow: 'visible',
      height: `calc(50% - ${DRAWER_BLEEDING}px)`
    }
  }

  return (
    <Root>
      <Global styles={globalStyles} />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleToggle(false)}
        onOpen={handleToggle(true)}
        swipeAreaWidth={DRAWER_BLEEDING}
        disableSwipeToOpen={false}
        keepMounted
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -DRAWER_BLEEDING,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>51 results</Typography>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          <Skeleton variant="rectangular" height="100%" />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  )
}

export default SecondaryDrawerMobile
