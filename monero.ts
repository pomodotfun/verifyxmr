const HEX_64 = /^[0-9a-fA-F]{64}$/
const BASE58 = /^[1-9A-HJ-NP-Za-km-z]+$/
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export function isTxHash(value: string) {
  return HEX_64.test(value.trim())
}

export function isTxKey(value: string) {
  const v = value.trim()
  return v.length > 0 && v.length % 64 === 0 && /^[0-9a-fA-F]+$/.test(v)
}

export function isAddress(value: string) {
  const v = value.trim()
  return (v.startsWith('4') || v.startsWith('8')) && (v.length === 95 || v.length === 106) && BASE58.test(v)
}

export function isProofString(value: string) {
  const v = value.trim()
  return /^(OutProofV[12]|InProofV[12])[1-9A-HJ-NP-Za-km-z]{20,}$/.test(v)
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input)
  return new Uint8Array(await crypto.subtle.digest('SHA-256', data))
}

export async function simulateVerification(seed: string) {
  const bytes = await sha256(seed)
  const piconero = ((bytes[0] << 16) | (bytes[1] << 8) | bytes[2]) * 1000
  const amount = (piconero / 1e12 + 0.05).toFixed(4)
  const confirmations = 12 + (bytes[3] % 240)
  const blockHeight = 3_250_000 + ((bytes[4] << 8) | bytes[5])
  const timestamp = new Date(Date.now() - confirmations * 2 * 60 * 1000)
  return { amount, confirmations, blockHeight, timestamp }
}

export async function simulateProof(seed: string) {
  const a = await sha256(seed)
  const b = await sha256(seed + ':sig')
  const bytes = [...a, ...b, ...(await sha256(seed + ':r'))]
  const encoded = bytes.map((n) => BASE58_ALPHABET[n % 58]).join('')
  return `OutProofV2${encoded}`
}

export function truncateMiddle(value: string, head = 8, tail = 8) {
  if (value.length <= head + tail + 3) return value
  return `${value.slice(0, head)}…${value.slice(-tail)}`
}
