export interface School {
  schoolId: string
  schoolName: string
  type: 'all' | 'area' | 'both'
  district: string[]
  plan2025: number
  apply2025: number
  rate2025: number
  plan2024: number
  rate2024: number
  plan2023: number
  rate2023: number
  level: number
  score: string
  address: string
  tag: string[]
}

export interface District {
  id: string
  name: string
}
