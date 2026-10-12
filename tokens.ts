export type LaunchedToken = {
  ca: string
  name: string
  symbol: string
  image: string
  marketCap: string
  migrated?: boolean
  launchedAt?: string
}

/**
 * Add launched tokens here. Each card links to https://pump.fun/{ca}.
 * Example:
 * { ca: '<mint address>', name: 'Save Mochi', symbol: 'MOCHI', image: '/images/mochi.png', marketCap: '$42.5K', launchedAt: '2026-10-01' }
 */
export const LAUNCHED_TOKENS: LaunchedToken[] = []

export function pumpFunUrl(ca: string) {
  return `https://pump.fun/${encodeURIComponent(ca)}`
}

export function findToken(ca: string) {
  return LAUNCHED_TOKENS.find((token) => token.ca === ca)
}
