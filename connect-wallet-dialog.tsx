'use client'

import { useState } from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WALLETS, connectWallet, getProvider, shortAddress, type WalletId } from '@/lib/wallets'

export type ConnectedWallet = { id: WalletId; address: string }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: ConnectedWallet | null
  onConnect: (wallet: ConnectedWallet) => void
  onDisconnect: () => void
}

export function ConnectWalletDialog({ open, onOpenChange, wallet, onConnect, onDisconnect }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded-2xl border-border bg-card p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {wallet ? 'Wallet connected' : 'Connect a Solana wallet'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a Solana wallet to connect to VerifyXMR.
          </DialogDescription>
        </DialogHeader>
        {wallet ? (
          <ConnectedPanel wallet={wallet} onDisconnect={onDisconnect} />
        ) : (
          <WalletList onConnect={onConnect} />
        )}
        <p className="text-center text-xs leading-relaxed text-muted-foreground text-pretty">
          Connecting only shares your public address. VerifyXMR never asks for a seed phrase.
        </p>
      </DialogContent>
    </Dialog>
  )
}

function WalletList({ onConnect }: { onConnect: (wallet: ConnectedWallet) => void }) {
  const [pending, setPending] = useState<WalletId | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleConnect(id: WalletId) {
    setPending(id)
    setError(null)
    try {
      const address = await connectWallet(id)
      onConnect({ id, address })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection was rejected.')
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <ul className="flex flex-col gap-2.5">
        {WALLETS.map((option) => {
          const detected = Boolean(getProvider(option.id))
          const content = (
            <>
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-xl text-sm font-bold text-background"
                style={{ backgroundColor: option.tint }}
              >
                {option.initial}
              </span>
              <span className="flex-1 text-left text-base font-medium">{option.name}</span>
              {pending === option.id ? (
                <Loader2 className="size-4 animate-spin text-primary" aria-label="Connecting" />
              ) : detected ? (
                <span className="rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-primary">
                  DETECTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-muted-foreground">
                  INSTALL
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </span>
              )}
            </>
          )
          const className =
            'flex w-full items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-60'
          return (
            <li key={option.id}>
              {detected ? (
                <button
                  type="button"
                  className={className}
                  disabled={pending !== null}
                  onClick={() => handleConnect(option.id)}
                >
                  {content}
                </button>
              ) : (
                <a href={option.installUrl} target="_blank" rel="noopener noreferrer" className={className}>
                  {content}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </li>
          )
        })}
      </ul>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function ConnectedPanel({ wallet, onDisconnect }: { wallet: ConnectedWallet; onDisconnect: () => void }) {
  const name = WALLETS.find((w) => w.id === wallet.id)?.name
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-border bg-background/60 p-4">
        <p className="text-xs text-muted-foreground">{name}</p>
        <p className="mt-1 break-all font-mono text-sm" title={wallet.address}>
          {shortAddress(wallet.address)}
        </p>
      </div>
      <Button variant="outline" className="h-11 rounded-full" onClick={onDisconnect}>
        Disconnect
      </Button>
    </div>
  )
}
