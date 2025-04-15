import { TArgiNewsData, TMessage } from '@/types'
import { TPlantDoctorData } from './plantDoctorTemplate'

export type TForecastDay = {
  day: string
  temperature: number
  condition: string
}

export type WeatherData = {
  location: string
  date: string
  time: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: TForecastDay[]
}

export type PriceItem = {
  product: string
  currentPrice: number
  previousPrice: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  location?: string
}

export type AgriPriceData = {
  title: string
  date: string
  region: string
  market: string
  items: PriceItem[]
  priceSummary?: string
  recommendation?: string
}

export type FarmingTechniqueData = {
  title: string
  crop: string
  imageUrl?: string
  description: string
  suitableRegions: string[]
  growingDuration: string
  idealConditions: {
    soil: string
    temperature: string
    water: string
    sunlight: string
  }
  steps: {
    title: string
    description: string
  }[]
  tips: string[]
}

// Status data for showing processing state
export type StatusData = {
  state: 'searching' | 'processing' | 'completed' | 'error'
  message: string
}

export type TemplateData = {
  weather: WeatherData | null
  agriPrice: AgriPriceData | null
  farmingTechnique: FarmingTechniqueData | null
  plantDoctor: TPlantDoctorData | null
  argiNews: TArgiNewsData | null
  status: StatusData | null
}

export type MessageClasses = {
  container: string
  innerContainer: string
  bubble: string
  timestamp: string
}

export type MessageBubbleProps = {
  message: TMessage
}

// Template component props
export type WeatherTemplateProps = {
  weatherData?: WeatherData
  isLoading?: boolean
}

export type AgriPriceTemplateProps = {
  priceData: AgriPriceData
}

export type FarmingTechniqueTemplateProps = {
  techniqueData: FarmingTechniqueData | import('@/types/farmingTechnique').IFarmingTechniqueData
  isLoading?: boolean
}

export type StatusTemplateProps = {
  statusData: StatusData
}
