import { QueryClient } from '@tanstack/react-query'
import { LoaderFunction } from 'react-router-dom'
import * as ApiQuery from './mis-gastos'

export const apiListLoader: (queryClient: QueryClient) => LoaderFunction =
  (queryClient) => async () => {
    const queryCommonAttributes = {
      staleTime: Infinity,
      retry: 2
    }

    const categoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['categories'],
      queryFn: ApiQuery.getCategories
    })

    const subcategoriesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['subcategories'],
      queryFn: ApiQuery.getSubcategories
    })

    const groupsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['groups'],
      queryFn: ApiQuery.getGroups
    })

    const accountsPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['accounts'],
      queryFn: ApiQuery.getAccounts
    })

    const incomeSourcesPromise = queryClient.fetchQuery({
      ...queryCommonAttributes,
      queryKey: ['income-sources'],
      queryFn: ApiQuery.getIncomeSources
    })



    const lists = await Promise.all([
      categoriesPromise,
      subcategoriesPromise,
      groupsPromise,
      accountsPromise,
      incomeSourcesPromise
    ])

    const result = {
      categories: lists[0],
      subcategories: lists[1],
      groups: lists[2],
      accounts: lists[3],
      incomeSources: lists[4]
    }

    return result
  }
