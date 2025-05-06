import { useQuery } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import { useCallback, useEffect, useState } from 'react'
import { NavigateFunction, useLoaderData, useNavigate } from 'react-router-dom'
import { getSpends } from '../../../../../api/mis-gastos'
import { paths } from '../../../../../Routes'
import { buildDateFormatter, buildListItemFormatter } from '../../../../../utils'
import Page from '../../../../Page'
import Table from '../../../../Table'
import MainMenu from '../../MainMenu'
import ListControls from './ListControls'

// TODO: verify if timezone is ok (in DB, after retrieving dates in backend and after retrieving them in frontend)

// TODO: filter data based on filters

// TODO: remove date formatter (if it's really not necessary)

// TODO: set new spend page as default page for spends (and new income page as default for incomes)

const INITIAL_SPEND_FILTERS: SpendFilters = {
  categoryIds: null,
  subcategoryIds: null,
  groupIds: null,
  accountIds: null
}

interface SpendFilters {
  categoryIds: number[] | null
  subcategoryIds: number[] | null
  groupIds: number[] | null
  accountIds: number[] | null
}

interface SpendButtons {
  newReimbursementBtn: unknown
}

function buildTableRows(
  spends: Api.Spend[] | undefined,
  filters: SpendFilters,
  navigate: NavigateFunction
): UI.Table.BaseRow<Api.Spend, SpendButtons>[] {
  return typeof spends == 'undefined'
    ? []
    : spends
        .filter(
          (spend) =>
            (!filters.groupIds ||
              filters.groupIds.length == 0 ||
              !spend.groupId ||
              filters.groupIds.includes(spend.groupId)) &&
            (!filters.categoryIds ||
              filters.categoryIds.length == 0 ||
              filters.categoryIds.includes(spend.categoryId)) &&
            (!filters.accountIds ||
              filters.accountIds.length == 0 ||
              filters.accountIds.includes(spend.accountId)) &&
            (!filters.subcategoryIds ||
              filters.subcategoryIds.length == 0 ||
              !spend.subcategoryId ||
              filters.subcategoryIds.includes(spend.subcategoryId))
        )
        .map((spend) => ({
          id: spend.id!,
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
  const notifications = useNotifications()

  const apiLists = useLoaderData()

  const [filters, setFilters] = useState<SpendFilters>(INITIAL_SPEND_FILTERS)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['spends'],
    queryFn: getSpends,
    retry: 2
  })

  const columns = buildColumnList(apiLists)

  const rows = buildTableRows(data, filters, navigate)

  const handleThreeDotsIconClick = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  const handleSetFilters = useCallback(
    (categoryIds: number[], subcategoryIds: number[], groupIds: number[], accountIds: number[]) => {
      setIsModalOpen(false)
      setFilters({
        categoryIds,
        subcategoryIds,
        groupIds,
        accountIds
      })
    },
    [setFilters]
  )

  useEffect(() => {
    if (isError) {
      notifications.show(error.toString(), {
        severity: 'error'
      })
    }
  }, [error, isError, notifications])

  const pageProps: Omit<UI.PageProps, 'children'> = {
    isFetching,
    mainMenu: <MainMenu />,
    onThreeDotsIconClick: handleThreeDotsIconClick
  }

  const listControlsProps: UI.SpendFilterProps = {
    filters,
    isModalOpen,
    onModalClose: handleModalClose,
    onFiltersSet: handleSetFilters
  }

  return (
    <Page {...pageProps}>
      {!isError && (
        <>
          <ListControls {...listControlsProps} />
          <Table<Api.Spend, SpendButtons> rows={rows} columns={columns} />
        </>
      )}
    </Page>
  )
}

export default SpendList
