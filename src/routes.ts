import { Routes } from "react-router-dom"

type Routes = {
  [name: string]: {
    INDEX: string,
    [name: string]: string
  }
}
export default {
  SPENDS: {
    INDEX: '/spends',
    LIST: '/spends/list',
    NEW: '/spends/new'
  }
} as Routes