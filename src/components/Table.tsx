import * as Mui from '@mui/material'
import { type MouseEventHandler, memo, useState } from 'react'

/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/

interface BaseRow<R, B> {
  id: number
  data: R
  buttons?: TableButton<B>[]
}

interface DataColumn<R> {
  id: string
  label: string
  isButton?: false
  minWidth?: number
  getValue: (data: R) => React.ReactNode
}

interface ButtonColumn<B> {
  id: keyof B
  label: string
  isButton: true
  minWidth?: number
}

interface TableButton<B> {
  id: keyof B
  label: string
  clickHandler: MouseEventHandler<HTMLButtonElement>
}

interface TableProps<R, B> {
  data: BaseRow<R, B>[]
  columns: Column<R, B>[]
}

/**************************************************************************************************/
/*                                              TYPES                                             */
/**************************************************************************************************/

type Column<R, B> = DataColumn<R> | ButtonColumn<B>

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

/**
 * Generic paginated table.
 * A row in `data` can contain data (`R`) and buttons (`TableButton<B>`).
 * @typeParam R - Shape of each row's data object. `DataColumn.getValue` receives it to extract display values.
 * @typeParam B - Object whose keys name the available buttons. `ButtonColumn.id` references these keys; the actual handlers live in `BaseRow.buttons`.
 * @param data - Data to be displayed (list of `BaseRow<R, B>`) where each row contains a data object (`R`) and optionally a list of buttons (`TableButton<B>`).
 * @param columns - Column definitions used to render the table header and extract display values from each row's data. Can be of two types:
 * - `DataColumn<R>`: Regular column that displays a value extracted from the row's data object (`R`) using `getValue`.
 * - `ButtonColumn<B>`: Column that displays a button. The button's label is defined in the column, but its click handler is defined in the row's buttons (`TableButton<B>`).
 */
function Table<R, B>({ data, columns }: TableProps<R, B>) {
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
    count: data?.length ? data?.length : 0,
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
            {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <Mui.TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    if (column.isButton) {
                      const button = findButton(column.id.toString(), row.buttons!)
                      return (
                        <Mui.TableCell key={column.id.toString()}>
                          <Mui.Button onClick={button.clickHandler}>{button.label}</Mui.Button>
                        </Mui.TableCell>
                      )
                    } else {
                      return (
                        <Mui.TableCell key={column.id}>{column.getValue(row.data)}</Mui.TableCell>
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

export type { BaseRow, ButtonColumn, Column, DataColumn, TableButton, TableProps }

export default memo(Table) as <R, B>(props: TableProps<R, B>) => React.ReactElement
