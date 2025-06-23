import { useQuery } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { NavigateFunction, useLoaderData, useNavigate } from 'react-router-dom'
import * as Api from '../../../../../api/mis-gastos/api'
import { PATHS } from '../../../../../constants'
import { buildDateFormatter, buildListItemFormatter } from '../../../../../utils'
import Page from '../../../../Page'
import Table from '../../../../Table'
import BottomNavigation from '../../BottomNavigation'
import SpendFilters from './SpendFilters'

// TODO: set new spend page as default page for spends (and new income page as default for incomes)

// TODO: show "-" when description == null

const INITIAL_SPEND_FILTERS: SpendFilters = {
  startDate: dayjs().add(-1, 'month'),
  finalDate: dayjs(),
  categoryIds: null,
  subcategoryIds: null,
  groupIds: null,
  accountIds: null
}

interface SpendFilters {
  startDate: Dayjs
  finalDate: Dayjs
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
            filters.startDate.isBefore(spend.date) &&
            filters.finalDate.isAfter(spend.date) &&
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
              clickHandler: () =>
                navigate(PATHS.INCOME.INDEX + PATHS.INCOME.NEW, { state: { spend } })
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

  // Initially, as filters are set with null values, all spends will be shown (no filtering when null values are set)
  const [filters, setFilters] = useState<SpendFilters>(INITIAL_SPEND_FILTERS)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  // For more information about staleTime and gcTime see :
  // - https://dev.to/delisrey/react-query-staletime-vs-cachetime-hml
  // - https://www.codemzy.com/blog/react-query-cachetime-staletime

  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['spends'],
    queryFn: Api.getSpends,
    staleTime: Infinity,
    gcTime: Infinity,
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
    (
      startDate: Dayjs,
      finalDate: Dayjs,
      categoryIds: number[],
      subcategoryIds: number[],
      groupIds: number[],
      accountIds: number[]
    ) => {
      setIsModalOpen(false)
      setFilters({
        startDate,
        finalDate,
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
    bottomNavigation: <BottomNavigation />,
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
          <SpendFilters {...listControlsProps} />
          <Table<Api.Spend, SpendButtons> rows={rows} columns={columns} />
        </>
      )}
    </Page>
  )
}

export default SpendList
