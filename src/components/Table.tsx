import * as Mui from '@mui/material'
import { memo, useState, type MouseEventHandler } from 'react'
import type { Formatter } from '../utils'

/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/

interface BaseRow<R, B> {
  id: number
  data: R
  buttons?: TableButton<B>[]
}

interface Column<R, B> {
  id: keyof R | keyof B
  label: string
  isButton?: boolean
  minWidth?: number
  format?: Formatter
}

interface TableButton<B> {
  id: keyof B
  label: string
  clickHandler: MouseEventHandler<HTMLButtonElement>
}

interface TableProps<R, B> {
  rows: BaseRow<R, B>[]
  columns: Column<R, B>[]
}

/**************************************************************************************************/
/*                                           CONSTANTS                                            */
/**************************************************************************************************/

const Paper = Mui.styled(Mui.Paper)<Mui.PaperProps>(() => ({
  marginTop: '1rem',
  overflow: 'hidden',
  flex: 0.9
}))

const TableContainer = Mui.styled(Mui.TableContainer)(() => ({
  maxHeight: '90%'
}))

/**************************************************************************************************/
/*                                           FUNCTIONS                                            */
/**************************************************************************************************/

function buildTableCellProps<R, B>(column: Column<R, B>): Mui.TableCellProps {
  return {
    style: { minWidth: column.minWidth }
  }
}

function findButton<B>(buttonId: string, buttons: TableButton<B>[]): TableButton<B> {
  const button = buttons.find((button) => button.id == buttonId)
  if (typeof button == 'undefined') throw Error(`Cannot find button "${buttonId}"`)
  return button
}

/**************************************************************************************************/
/*                                         MAIN COMPONENT                                         */
/**************************************************************************************************/

function Table<R, B>({rows, columns }: TableProps<R, B>) {
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
                      const value = row.data[column.id as keyof R] as unknown
                      return (
                        <Mui.TableCell key={column.id.toString()}>
                          {column.format ? column.format(value as Parameters<Formatter>[0]) : value as React.ReactNode}
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

/**************************************************************************************************/
/*                                            EXPORTS                                             */
/**************************************************************************************************/

export type { BaseRow, Column, TableButton, TableProps }

export default memo(Table) as <R, B>(
  props: TableProps<R, B>
) => React.ReactElement;;
