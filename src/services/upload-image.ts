import { instance } from './instance'

export const uploadImageServices = {
  uploadImage: async (data: FormData) => {
    const response = await instance.post(`/api/upload/upload-image`, data)
    return response.data
  }
}
