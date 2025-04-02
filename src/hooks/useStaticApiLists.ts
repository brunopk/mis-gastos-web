import { useContext } from "react"
import { ApiDataContext } from "../context/ApiDataContext"

function useStaticApiLists() {
  const {isFetching} = useContext(ApiDataContext)

  return {isFetching}
}

export default useStaticApiLists