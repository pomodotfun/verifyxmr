export type TokenInfo = {
  ca: string
  name: string | null
  symbol: string | null
  image: string | null
  marketCap: number | null
  migrated: boolean
  launchedAt: number | null
  url: string
}

type DexPair = {
  dexId?: string
  baseToken?: { address?: string; name?: string; symbol?: string }
  info?: { imageUrl?: string }
  marketCap?: number
  fdv?: number
  liquidity?: { usd?: number }
  pairCreatedAt?: number
}

const BONDING_CURVE_DEX = 'pumpfun'

export function pumpFunUrl(ca: string) {
  return `https://pump.fun/${encodeURIComponent(ca)}`
}

export async function fetchTokenInfo(ca: string): Promise<TokenInfo> {
  const fallback: TokenInfo = {
    ca,
    name: null,
    symbol: null,
    image: null,
    marketCap: null,
    migrated: false,
    launchedAt: null,
    url: pumpFunUrl(ca),
  }

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(ca)}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return fallback

    const data = (await res.json()) as { pairs?: DexPair[] | null }
    const pairs = (data.pairs ?? []).filter((p) => p.baseToken?.address === ca)
    if (pairs.length === 0) return fallback

    const main = [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]
    const image = pairs.find((p) => p.info?.imageUrl)?.info?.imageUrl ?? null
    const created = pairs.map((p) => p.pairCreatedAt).filter((t): t is number => typeof t === 'number')

    return {
      ...fallback,
      name: main.baseToken?.name ?? null,
      symbol: main.baseToken?.symbol ?? null,
      image,
      marketCap: main.marketCap ?? main.fdv ?? null,
      migrated: pairs.some((p) => p.dexId && p.dexId !== BONDING_CURVE_DEX),
      launchedAt: created.length ? Math.min(...created) : null,
    }
  } catch {
    return fallback
  }
}

export function fetchAllTokens(addresses: string[]) {
  const unique = [...new Set(addresses.map((a) => a.trim()).filter(Boolean))]
  return Promise.all(unique.map(fetchTokenInfo))
}

export function formatMarketCap(value: number | null) {
  if (value === null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
