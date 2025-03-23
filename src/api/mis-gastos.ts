const API_MIS_GASTOS_HOST = import.meta.env.VITE_API_MIS_GASTOS_HOST;

export async function getCategories(): Promise<Api.Category[]>  {
  const response = await fetch(
    `${API_MIS_GASTOS_HOST}/category`,
  )
  return await response.json()
}