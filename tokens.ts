export const TOKEN_ADDRESSES: string[] = [
  "USDCr7QqshWobMtH9JdgVoyR5mFY8egohfvVhxTQBvf",
  "2_COIN_CA_BURAYA",
  "3_COIN_CA_BURAYA",
  "4_COIN_CA_BURAYA",
  "5_COIN_CA_BURAYA",
]

export type LaunchedToken = {
  ca: string
  name: string
  symbol: string
  image: string
  marketCap: string
  migrated?: boolean
  launchedAt?: string
}

export function pumpFunUrl(ca: string) {
  return `https://pump.fun/${encodeURIComponent(ca)}`
}
