import * as Mui from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { getSpends } from '../../../../../api/mis-gastos'
import useSnackBar from '../../../../../hooks/useSnackBar'
import { BUTTON_WIDTH_IN_REM } from '../../../../../style'
import ModalBase from '../../../../modal/ModalBase'
import Page from '../../../../Page'
import MainMenu from '../../MainMenu'
import ListControls from './ListControls'

// TODO: verify if timezone is ok (in DB, after retrieving dates in backend and after retrieving them in frontend)

// TODO: implement button to redirect to "reimbursement"

// TODO: remove TanStack as dependency (use just fetch)

// TODO: filter data based on filters

const Button = Mui.styled(Mui.Button)<Mui.ButtonProps>(() => ({
  width: `${BUTTON_WIDTH_IN_REM}rem`
}))

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

const TableContainer = Mui.styled(Mui.TableContainer)(() => ({
  maxHeight: '90%'
}))

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  marginTop: '1rem',
  overflow: 'hidden',
  flex: 1
}))

interface Column {
  id: keyof Api.Spend | 'button'
  label: string
  minWidth?: number
  format?: Formatter
}

type Formatter = (id: number | string | null) => string

function buildDateFormatter(): Formatter {
  return (isoDate: string | number | null) => {
    if (!isoDate) throw new Error(`ISO date is null`)

    if (typeof isoDate === 'number') throw new Error(`Cannot format number ${isoDate} to string`)

    const date = new Date(isoDate)
    return dateFormatter.format(date)
  }
}

function buildListItemFormatter(list: Api.ListItem[]): Formatter {
  return (id: number | string | null) => {
    if (!id) return '-'

    const parsedId = typeof id === 'string' ? parseInt(id) : id
    const foundItem = list.find((item) => item.id == parsedId)

    if (typeof foundItem === 'undefined') {
      const stringifiedList = JSON.stringify(list)
      throw new Error(`Element ${id} not found in list ${stringifiedList}`)
    }

    return foundItem.name
  }
}

function buildColumnList(apiLists: {[name: string]: Api.ListItem[]}): Column[] {
  return [
    { id: 'id', label: 'ID', minWidth: 80 },
    {
      id: 'date',
      label: 'Date',
      minWidth: 150,
      format: buildDateFormatter()
    },
    {
      id: 'categoryId',
      label: 'Category',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.categories)
    },
    {
      id: 'subcategoryId',
      label: 'Subcategory',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.subcategories)
    },
    {
      id: 'groupId',
      label: 'Group',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.groups)
    },
    {
      id: 'accountId',
      label: 'Account',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.accounts)
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 170
    },
    {
      id: 'value',
      label: 'Value',
      minWidth: 170
    }
  ]
}

function buildColumnProps(column: Column): Mui.TableCellProps {
  return {
    style: { minWidth: column.minWidth }
  }
}

function SpendList() {
  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const apiLists = useLoaderData()

  // TODO: create a "buildKey" to optimize queries with tanstack query keys

  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['spends'],
    queryFn: getSpends,
    retry: 2
  })

  const { pushSnackBarMessage } = useSnackBar()

  const columns: readonly Column[] = buildColumnList(apiLists)

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleThreeDotsIconClick = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  useEffect(() => {
    if (isError) {
      pushSnackBarMessage({ text: error.toString(), severity: 'error' })
    }
  }, [error, isError, pushSnackBarMessage])

  const primaryActionButton = (
    <Button onClick={() => alert('Not implemented')} color="primary" autoFocus>
      APPLY
    </Button>
  )

  const secondaryActionButton = (
    <Button onClick={handleModalCancel} color="primary">
      Cancel
    </Button>
  )

  const modalBaseProps: Omit<ModalBaseProps, 'children'> = {
    title: '',
    primaryActionButton,
    secondaryActionButton,
    open: isModalOpen,
    onClose: () => alert('Not implemented')
  }

  const pageProps: Omit<UI.PageProps, 'children'> = {
    isFetching,
    mainMenu: <MainMenu />,
    onThreeDotsIconClick: handleThreeDotsIconClick
  }

  const tablePaginationProps: Mui.TablePaginationProps = {
    rowsPerPage,
    page,
    rowsPerPageOptions: [10, 25, 100],
    component: 'div',
    count: data?.length ? data?.length : 0,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage
  }

  return (
    <Page {...pageProps}>
      {isError ? (
        <></>
      ) : (
        <>
          <ModalBase {...modalBaseProps}>
            <ListControls />
          </ModalBase>
          <Paper variant="outlined">
            <TableContainer>
              <Mui.Table stickyHeader aria-label="sticky table">
                <Mui.TableHead>
                  <Mui.TableRow>
                    {columns.map((column) => (
                      <Mui.TableCell {...buildColumnProps(column)} key={column.id}>
                        {column.label}
                      </Mui.TableCell>
                    ))}
                  </Mui.TableRow>
                </Mui.TableHead>
                <Mui.TableBody>
                  {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <Mui.TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        {columns.map((column) => {
                          if (column.id !== 'button') {
                            const value = row[column.id]
                            return (
                              <Mui.TableCell key={column.id}>
                                {column.format ? column.format(value) : value}
                              </Mui.TableCell>
                            )
                          } else {
                            return (
                              <Mui.TableCell key={column.id}>
                                <Mui.Button>{`Button ${row.id}`}</Mui.Button>
                              </Mui.TableCell>
                            )
                          }
                        })}
                      </Mui.TableRow>
                    )
                  })}
                </Mui.TableBody>
              </Mui.Table>
            </TableContainer>
            <Mui.TablePagination {...tablePaginationProps} />
          </Paper>
        </>
      )}
    </Page>
  )
}

export default SpendList
