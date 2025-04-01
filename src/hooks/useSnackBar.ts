import { useContext } from "react"
import { SnackBarContext } from "../context/SnackBarContext"


function useSnackBar() {
  const {pushSnackBarMessage, currentSnackBarMessage} = useContext(SnackBarContext)
  return {currentSnackBarMessage, pushSnackBarMessage}
}

export default useSnackBar