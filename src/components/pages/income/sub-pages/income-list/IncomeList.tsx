import { useQuery } from '@tanstack/react-query'
import { useNotifications } from '@toolpad/core/useNotifications'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { getIncomes } from '../../../../../api/mis-gastos'
import { buildDateFormatter, buildListItemFormatter } from '../../../../../utils'
import Page from '../../../../Page'
import Table from '../../../../Table'
import MainMenu from '../../MainMenu'

interface Income {
  id: number
  date: string
  incomeTypeId: number
  accountId: number
  description?: string
  spendId?: number
  spendDate?: string
  spendCategoryId?: number | null
  spendSubcategoryId?: number | null
  spendGroupId?: number | null
  spendAccountId?: number
  spendDescription?: string
  spendValue?: number
  value: number
}

function buildTableRows(incomes: Api.Income[] | undefined): UI.Table.BaseRow<Income, void>[] {
  return typeof incomes == 'undefined'
    ? []
    : incomes.map((income) => ({
        id: income.id,
        data: {
          id: income.id,
          date: income.date,
          incomeTypeId: income.incomeTypeId,
          accountId: income.accountId,
          description: income.description,
          value: income.value,
          spendId: income.spend?.id,
          spendDate: income.spend?.date,
          spendCategoryId: income.spend?.categoryId,
          spendSubcategoryId: income.spend?.subcategoryId,
          spendGroupId: income.spend?.groupId,
          spendDescription: income.spend?.description,
          spendAccountId: income.spend?.accountId,
          spendValue: income.spend?.value
        }
      }))
}

function buildColumnList(apiLists: {
  [name: string]: Api.ListItem[]
}): UI.Table.Column<Income, void>[] {
  return [
    { id: 'id', label: 'ID', minWidth: 100 },
    {
      id: 'date',
      label: 'Date',
      minWidth: 150,
      format: buildDateFormatter()
    },
    {
      id: 'incomeTypeId',
      label: 'Type',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.incomeTypes)
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
      id: 'spendCategoryId',
      label: 'Spend category',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.categories)
    },
    {
      id: 'spendSubcategoryId',
      label: 'Spend subcategory',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.subcategories)
    },
    {
      id: 'spendGroupId',
      label: 'Spend group',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.groups)
    },
    {
      id: 'spendAccountId',
      label: 'Spend account',
      minWidth: 170,
      format: buildListItemFormatter(apiLists.accounts)
    },
    {
      id: 'spendDescription',
      label: 'Spend description',
      minWidth: 170
    },
    {
      id: 'spendValue',
      label: 'Spend value',
      minWidth: 170
    }
  ]
}

function IncomeList() {
  const apiLists = useLoaderData()

  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['incomes'],
    queryFn: getIncomes,
    retry: 2
  })

  const notifications = useNotifications()

  const rows = buildTableRows(data)

  const columns = buildColumnList(apiLists)

  useEffect(() => {
    if (isError) {
      notifications.show(error.toString(), {
        severity: 'error'
      })
    }
  }, [error, isError, notifications])

  return (
    <Page isFetching={isFetching} mainMenu={<MainMenu />}>
      <Table rows={rows} columns={columns} />
    </Page>
  )
}

export default IncomeList
