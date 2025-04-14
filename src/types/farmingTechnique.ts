interface IStep {
  title: string
  description: string
}

interface IFarmingTechniqueData {
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
  steps: IStep[]
  tips: string[]
}

export type { IFarmingTechniqueData }
