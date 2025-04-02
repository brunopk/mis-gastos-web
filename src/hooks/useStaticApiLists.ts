import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiDataContext } from '../context/ApiDataContext'

type State = {
  isFetching: boolean,
  categories: Api.Category[],
  subcategories: Api.Subcategory[],
  groups: Api.Group[],
  accounts: Api.Account[]
  filterSubcategories: (categoryId: number) => Api.Subcategory[],
  filterGroups: (subcategoryId: number) => Api.Group[]
}

function useStaticApiLists() {
  const { isFetching, categories, subcategories, groups, accounts } = useContext(ApiDataContext)

  const filterSubcategories = useCallback(
    (categoryId: number) =>
      subcategories.filter((subcategory) => subcategory.categoryId == categoryId),
    [subcategories]
  )

  const filterGroups = useCallback(
    (subcategoryId: number) => groups.filter((group) => group.subcategoryId == subcategoryId),
    [groups]
  )

  const [state, setState] = useState<State>({isFetching: false, categories: [], subcategories: [], groups: [], accounts: [], filterSubcategories, filterGroups})
  
  useEffect(() => {
    if (categories.length > 0 && subcategories.length > 0 && groups.length > 0 && accounts.length)
      setState({isFetching, categories, subcategories, groups, accounts, filterSubcategories, filterGroups})
  }, [isFetching, categories, subcategories, groups, accounts, filterSubcategories, filterGroups])

  return state
}

export default useStaticApiLists
