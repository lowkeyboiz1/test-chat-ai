import { instance } from '@/services/instance'

export const apiServices = {
  requestOtp: async ({ phone_number, device_id }: { phone_number: string; device_id: string }) =>
    await instance.post('/api/auth/request-otp', { phone_number, device_id })
}
