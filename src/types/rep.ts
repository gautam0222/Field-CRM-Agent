export interface Rep {
  id:        string
  name:      string
  phone:     string
  email:     string | null
  zone:      string
  managerId: string | null
  createdAt: string
  _count?: {
    visits: number
  }
}

export interface CreateRepInput {
  name:      string
  phone:     string
  email?:    string
  zone:      string
  managerId?: string
}