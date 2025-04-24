import * as Mui from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavigateFunction, useLoaderData, useNavigate } from 'react-router-dom'
import { getSpends } from '../../../../../api/mis-gastos'
import useSnackBar from '../../../../../hooks/useSnackBar'
import { paths } from '../../../../../Routes'
import { BUTTON_WIDTH_IN_REM } from '../../../../../style'
import { buildDateFormatter, buildListItemFormatter } from '../../../../../utils'
import ModalBase from '../../../../modal/ModalBase'
import Page from '../../../../Page'
import Table from '../../../../Table'
import MainMenu from '../../MainMenu'
import ListControls from './ListControls'

// TODO: verify if timezone is ok (in DB, after retrieving dates in backend and after retrieving them in frontend)

// TODO: remove TanStack as dependency (use just fetch)

// TODO: filter data based on filters

// TODO: remove date formatter (if it's really not necessary)

const Button = Mui.styled(Mui.Button)<Mui.ButtonProps>(() => ({
  width: `${BUTTON_WIDTH_IN_REM}rem`
}))

interface SpendButtons {
  newReimbursementBtn: unknown
}

function buildTableRows(
  spends: Api.Spend[] | undefined,
  navigate: NavigateFunction
): UI.Table.BaseRow<Api.Spend, SpendButtons>[] {
  return typeof spends == 'undefined' ? [] : spends.map((spend) => ({
    id: spend.id,
    data: spend,
    buttons: [
      {
        id: 'newReimbursementBtn',
        label: 'ADD REIMBURSEMENT',
        clickHandler: () => navigate(paths.income.new, { state: { spend } })
      }
    ]
  }))
}

function buildColumnList(apiLists: {
  [name: string]: Api.ListItem[]
}): UI.Table.Column<Api.Spend, SpendButtons>[] {
  return [
    { id: 'id', label: 'ID', minWidth: 100 },
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
    },
    {
      id: 'newReimbursementBtn',
      label: 'Reimbursements',
      minWidth: 300,
      isButton: true
    }
  ]
}

function SpendList() {
  const apiLists = useLoaderData()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  // TODO: create a "buildKey" to optimize queries with tanstack query keys

  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['spends'],
    queryFn: getSpends,
    retry: 2
  })

  const { pushSnackBarMessage } = useSnackBar()

  const columns = buildColumnList(apiLists)

  const rows = buildTableRows(data, navigate)

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

  return (
    <Page {...pageProps}>
      {isError ? (
        <></>
      ) : (
        <>
          <ModalBase {...modalBaseProps}>
            <ListControls />
          </ModalBase>
          <Table<Api.Spend, SpendButtons> rows={rows} columns={columns} />
        </>
      )}
    </Page>
  )
}

export default SpendList
