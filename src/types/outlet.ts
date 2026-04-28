export interface Outlet {
  id: string
  name: string
  doctorName: string | null
  address: string | null
  zone: string
  lat: number | null
  lng: number | null
  createdAt: string
}

export interface CreateOutletInput {
  name: string
  doctorName?: string
  address?: string
  zone: string
  lat?: number
  lng?: number
}
