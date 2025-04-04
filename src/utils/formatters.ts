import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function formatTime(date: Date): string {
  return format(date, "HH:mm")
}

export const formatDate = () => {
  return format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })
}
