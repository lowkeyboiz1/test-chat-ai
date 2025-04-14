type TTreatmentOption = {
  chemical: string[]
  organic: string[]
}

type TPlantDoctorData = {
  disease: string
  symptoms: string[]
  causes: string[]
  treatment: TTreatmentOption
  prevention: string[]
  recommendation: string
}

export type { TPlantDoctorData }
