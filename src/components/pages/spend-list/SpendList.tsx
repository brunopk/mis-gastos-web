import * as Mui from '@mui/material'
import { Box } from '@mui/material'
import * as XDatePickers from '@mui/x-date-pickers'
import { useState } from 'react'
import Page from '../../Page'
import {
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'


const Stack = Mui.styled(Mui.Stack)<Mui.StackProps>(() => ({
  display: 'flex'
}))

const DatePicker = Mui.styled(XDatePickers.DatePicker)(() => ({
  display: 'flex'
}))

const Accordion = Mui.styled(Mui.Accordion)(() => ({
  p: 1, 
  width: '100%', 
  marginTop: '1rem',
  flex: 0
}))

const Main = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  marginTop: '1rem',
  flex: 1
}))

const AccordionSummary = Mui.styled((props: Mui.AccordionSummaryProps) => (
  <Mui.AccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

function SpendList() {
  const [age, setAge] = useState('')

  const handleChange = (event: Mui.SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  return (
    <Page>
      <Accordion elevation={0} variant='outlined'>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Mui.Typography component="span" sx={{paddingLeft: '1rem'}}>Dates</Mui.Typography>
        </AccordionSummary>
        <Mui.AccordionDetails>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <DatePicker />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <DatePicker />
          </Box>
        </Stack>
        </Mui.AccordionDetails>
      </Accordion>

      <Accordion elevation={0} variant='outlined'>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Mui.Typography component="span" sx={{paddingLeft: '1rem'}}>Filters</Mui.Typography>
        </AccordionSummary>
        <Mui.AccordionDetails>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <Mui.FormControl fullWidth>
              <Mui.InputLabel id="demo-simple-select-label">Category</Mui.InputLabel>
              <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Category"
                onChange={handleChange}
              >
                <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
                <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
                <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
              </Mui.Select>
            </Mui.FormControl>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Mui.FormControl fullWidth>
              <Mui.InputLabel id="demo-simple-select-label">Subcategory</Mui.InputLabel>
              <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Subcategory"
                onChange={handleChange}
              >
                <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
                <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
                <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
              </Mui.Select>
            </Mui.FormControl>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Mui.FormControl fullWidth>
              <Mui.InputLabel id="demo-simple-select-label">Group</Mui.InputLabel>
              <Mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Group"
                onChange={handleChange}
              >
                <Mui.MenuItem value={10}>Ten</Mui.MenuItem>
                <Mui.MenuItem value={20}>Twenty</Mui.MenuItem>
                <Mui.MenuItem value={30}>Thirty</Mui.MenuItem>
              </Mui.Select>
            </Mui.FormControl>
          </Box>
        </Stack>
        </Mui.AccordionDetails>
      </Accordion>

      <Main variant='outlined'>
      </Main>
    </Page>
  )
}

export default SpendList
