import { useContext } from "react"
import { ApiDataContext } from "../context/ApiDataContext"

function useApiData() {
  const {isFetching} = useContext(ApiDataContext)

  return {isFetching}
}

export default useApiData