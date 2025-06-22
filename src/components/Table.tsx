import * as Mui from '@mui/material'
import { memo, useState } from 'react'

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  marginTop: '1rem',
  overflow: 'hidden',
  flex: 0.9
}))

const TableContainer = Mui.styled(Mui.TableContainer)(() => ({
  maxHeight: '90%'
}))

function buildTableCellProps<R, B>(column: UI.Table.Column<R, B>): Mui.TableCellProps {
  return {
    style: { minWidth: column.minWidth }
  }
}

function findButton<R>(buttonId: string, buttons: UI.Table.Button<R>[]): UI.Table.Button<R> {
  const button = buttons.find((button) => button.id == buttonId)
  if (typeof button == 'undefined') throw Error(`Cannot find button "${buttonId}"`)
  return button
}

function Table<R, B>({rows, columns }: UI.Table.TableProps<R, B>) {
  const [page, setPage] = useState(0)

  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const tablePaginationProps: Mui.TablePaginationProps = {
    rowsPerPage,
    page,
    rowsPerPageOptions: [10, 25, 100],
    component: 'div',
    count: rows?.length ? rows?.length : 0,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage
  }

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Mui.Table stickyHeader aria-label="sticky table">
          <Mui.TableHead>
            <Mui.TableRow>
              {columns.map((column) => (
                <Mui.TableCell {...buildTableCellProps(column)} key={column.id.toString()}>
                  {column.label}
                </Mui.TableCell>
              ))}
            </Mui.TableRow>
          </Mui.TableHead>
          <Mui.TableBody>
            {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <Mui.TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    if (typeof column.isButton !== 'undefined' && column.isButton) {
                      const button = findButton(column.id.toString(), row.buttons!)
                      return (
                        <Mui.TableCell key={column.id.toString()}>
                          <Mui.Button onClick={button.clickHandler}>
                            {button.label}
                          </Mui.Button>
                        </Mui.TableCell>
                      )
                    } else {
                      const value = row.data[column.id as keyof R]
                      return (
                        <Mui.TableCell key={column.id.toString()}>
                          {column.format ? column.format(value) : value}
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
  )
}

export default memo(Table) as <R, B>(
  props: UI.Table.TableProps<R, B>
) => React.ReactElement;;