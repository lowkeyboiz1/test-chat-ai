export interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export interface WeatherData {
  temp: number
  condition: string
  icon: string
}

export interface CropData {
  name: string
  progress: number
  nextAction: string
  daysRemaining: number
}

export interface LandPlot {
  id: string
  name: string
  area: string
  location: string
  crops: CropData[]
}
