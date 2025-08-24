// Phone number formatting utility
export function formatPhoneNumber(value: string): string {
  if (!value) return ""
  
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, "")
  
  // Format based on length
  if (phoneNumber.length === 0) return ""
  if (phoneNumber.length <= 3) return `(${phoneNumber}`
  if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  if (phoneNumber.length <= 10) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
  
  // For longer numbers (with extension), format as (XXX) XXX-XXXX ext XXXX
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)} ext ${phoneNumber.slice(10)}`
}
