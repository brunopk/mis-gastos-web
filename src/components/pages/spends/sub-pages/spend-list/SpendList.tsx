import { useQuery } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import dayjs, { Dayjs } from 'dayjs'
import * as Api from '../../../../../api/mis-gastos/api'
import type { ApiListItem, ApiSpend } from '../../../../../api/mis-gastos/types'
import { PATHS } from '../../../../../constants'
import { buildDateFormatter, buildListItemFormatter } from '../../../../../utils'
import Page, { type PageProps } from '../../../../Page'
import Table, { type BaseRow, type Column } from '../../../../Table'
import BottomNavigation from '../../BottomNavigation'
import SpendFilters, { type SpendFilterProps } from './SpendFilters'
import { useCallback, useEffect, useState } from 'react'
import { NavigateFunction, useLoaderData, useNavigate } from 'react-router-dom'

/**************************************************************************************************/
/*                                          INTERFACES                                            */
/**************************************************************************************************/

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

/**************************************************************************************************/
/*                                            CONSTANTS                                           */
/**************************************************************************************************/

const formatDate = buildDateFormatter()

const INITIAL_SPEND_FILTERS: SpendFilters = {
  startDate: dayjs().add(-1, 'month'),
  finalDate: dayjs(),
  categoryIds: null,
  subcategoryIds: null,
  groupIds: null,
  accountIds: null
}

/**************************************************************************************************/
/*                                           FUNCTIONS                                            */
/**************************************************************************************************/

function buildTableRows(
  spends: ApiSpend[] | undefined,
  filters: SpendFilters,
  navigate: NavigateFunction
): BaseRow<ApiSpend, SpendButtons>[] {
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
  [name: string]: ApiListItem[]
}): Column<ApiSpend, SpendButtons>[] {
  const formatCategory = buildListItemFormatter(apiLists.categories)
  const formatSubcategory = buildListItemFormatter(apiLists.subcategories)
  const formatGroup = buildListItemFormatter(apiLists.groups)
  const formatAccount = buildListItemFormatter(apiLists.accounts)

  return [
    { id: 'id', label: 'ID', minWidth: 100, getValue: (s) => s.id },
    { id: 'date', label: 'Date', minWidth: 150, getValue: (s) => formatDate(s.date) },
    {
      id: 'categoryId',
      label: 'Category',
      minWidth: 170,
      getValue: (s) => formatCategory(s.categoryId)
    },
    {
      id: 'subcategoryId',
      label: 'Subcategory',
      minWidth: 170,
      getValue: (s) => formatSubcategory(s.subcategoryId)
    },
    { id: 'groupId', label: 'Group', minWidth: 170, getValue: (s) => formatGroup(s.groupId) },
    {
      id: 'accountId',
      label: 'Account',
      minWidth: 170,
      getValue: (s) => formatAccount(s.accountId)
    },
    { id: 'description', label: 'Description', minWidth: 170, getValue: (s) => s.description },
    { id: 'value', label: 'Value', minWidth: 170, getValue: (s) => s.value },
    { id: 'newReimbursementBtn', label: 'Reimbursements', minWidth: 300, isButton: true }
  ]
}

/**************************************************************************************************/
/*                                         MAIN COMPONENT                                         */
/**************************************************************************************************/

function SpendList() {
  const notifications = useNotifications()

  const apiLists = useLoaderData()

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

  const pageProps: Omit<PageProps, 'children'> = {
    isFetching,
    bottomNavigation: <BottomNavigation />,
    onThreeDotsIconClick: handleThreeDotsIconClick
  }

  const listControlsProps: SpendFilterProps = {
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
          <Table<ApiSpend, SpendButtons> data={rows} columns={columns} />
        </>
      )}
    </Page>
  )
}

/**************************************************************************************************/
/*                                           EXPORTS                                              */
/**************************************************************************************************/

export default SpendList
