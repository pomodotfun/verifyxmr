type SolanaProvider = {
  connect: () => Promise<unknown>
  disconnect?: () => Promise<void>
  publicKey?: { toString: () => string } | null
}

type WalletWindow = Window & {
  phantom?: { solana?: SolanaProvider & { isPhantom?: boolean } }
  solflare?: SolanaProvider & { isSolflare?: boolean }
  backpack?: SolanaProvider & { isBackpack?: boolean }
}

export type WalletId = 'phantom' | 'solflare' | 'backpack'

export type WalletOption = {
  id: WalletId
  name: string
  installUrl: string
  initial: string
  tint: string
}

export const WALLETS: WalletOption[] = [
  { id: 'phantom', name: 'Phantom', installUrl: 'https://phantom.com/download', initial: 'P', tint: '#ab9ff2' },
  { id: 'solflare', name: 'Solflare', installUrl: 'https://solflare.com/download', initial: 'S', tint: '#fc7227' },
  { id: 'backpack', name: 'Backpack', installUrl: 'https://backpack.app/download', initial: 'B', tint: '#e33e3f' },
]

export function getProvider(id: WalletId): SolanaProvider | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as WalletWindow
  if (id === 'phantom') return w.phantom?.solana?.isPhantom ? w.phantom.solana : undefined
  if (id === 'solflare') return w.solflare?.isSolflare ? w.solflare : undefined
  return w.backpack
}

export async function connectWallet(id: WalletId) {
  const provider = getProvider(id)
  if (!provider) throw new Error('Wallet not detected')
  const result = (await provider.connect()) as { publicKey?: { toString: () => string } } | undefined
  const key = result?.publicKey ?? provider.publicKey
  if (!key) throw new Error('Wallet did not return a public key')
  return key.toString()
}

export async function disconnectWallet(id: WalletId) {
  await getProvider(id)?.disconnect?.()
}

export function shortAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`
}
