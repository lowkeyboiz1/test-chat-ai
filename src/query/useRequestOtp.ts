import { apiServices } from '@/services/apiServices'
import { useMutation } from '@tanstack/react-query'
import { get } from 'lodash'

const REQUESTOTP = 'REQUESTOTP'
export const useRequestOtp = ({ phone_number, device_id }: { phone_number: string; device_id: string }) => {
  return useMutation({
    mutationKey: [REQUESTOTP],
    mutationFn: async () => await apiServices.requestOtp({ phone_number, device_id }),
    onSuccess: async (res) => {
      const data = get(res, 'data.data', {})
      if (!data?.wallets) {
      }
      console.log({ data })
    }
  })
}
