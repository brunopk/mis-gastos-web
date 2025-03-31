const API_MIS_GASTOS_HOST = import.meta.env.VITE_API_MIS_GASTOS_HOST;

export async function getCategories(): Promise<Api.Category[]>  {
  const response = await fetch(
    `${API_MIS_GASTOS_HOST}/categories`
  )

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json()
}