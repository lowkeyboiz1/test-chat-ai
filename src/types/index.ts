export type TMessage = {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  weatherData?: any
}

export type TWeatherData = {
  temp: number
  condition: string
  icon: string
}

export type TArgiNewsItem = {
  title: string
  date: string
  source: string
  content: string
  category: string
  impact: string
  relatedProducts: string[]
  recommendations: string[]
}

export type TArgiNewsData = {
  news: TArgiNewsItem[]
}

export type TArgiNewsTemplateProps = {
  newsData?: TArgiNewsData
  isLoading?: boolean
}

export type TCropData = {
  name: string
  progress: number
  nextAction: string
  daysRemaining: number
}

export type TLandPlot = {
  id: string
  name: string
  area: string
  location: string
  crops: TCropData[]
}
