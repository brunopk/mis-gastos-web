import { useContext } from "react"
import { ApiDataContext } from "../context/ApiDataContext"

function useStaticApiLists() {
  const {isFetching, categories } = useContext(ApiDataContext)

  return {isFetching, categories}
}

export default useStaticApiLists