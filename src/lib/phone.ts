// Formats any input as +7 (XXX) XXX-XX-XX while the user types
export function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (!digits.startsWith('7')) digits = `7${digits}`
  const rest = digits.slice(1, 11)
  let result = '+7'
  if (rest.length > 0) result += ` (${rest.slice(0, 3)}`
  if (rest.length > 3) result += `) ${rest.slice(3, 6)}`
  if (rest.length > 6) result += `-${rest.slice(6, 8)}`
  if (rest.length > 8) result += `-${rest.slice(8, 10)}`
  return result
}

export const isPhoneComplete = (value: string) => value.replace(/\D/g, '').length === 11
