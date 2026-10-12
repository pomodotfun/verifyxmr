import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { shortAddress } from '@/lib/wallets'

export type View = 'verify' | 'launch' | 'coins'
export type Panel = 'docs' | 'faq'

const views: { id: View; label: string }[] = [
  { id: 'verify', label: 'Verify' },
  { id: 'launch', label: 'Launch' },
  { id: 'coins', label: 'Coins' },
]

const panels: { id: Panel; label: string }[] = [
  { id: 'docs', label: 'API Docs' },
  { id: 'faq', label: 'FAQ' },
]

type Props = {
  view: View
  onViewChange: (view: View) => void
  onOpenPanel: (panel: Panel) => void
  onWalletClick: () => void
  walletAddress: string | null
}

export function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2" aria-label="VerifyXMR home">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
        <ShieldCheck className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Verify<span className="text-primary">XMR</span>
      </span>
    </button>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function NavPill({ view, onViewChange, onOpenPanel }: Pick<Props, 'view' | 'onViewChange' | 'onOpenPanel'>) {
  const base =
    'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring'
  return (
    <nav aria-label="Main" className="max-w-full overflow-x-auto">
      <ul className="flex w-max items-center gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur-md">
        {views.map((item) => {
          const active = item.id === view
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  base,
                  active
                    ? 'bg-background text-foreground ring-2 ring-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            </li>
          )
        })}
        {panels.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => onOpenPanel(item.id)}
              className={cn(base, 'text-muted-foreground hover:text-foreground')}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteHeader({ view, onViewChange, onOpenPanel, onWalletClick, walletAddress }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="flex items-center justify-between gap-3">
          <Logo onClick={() => onViewChange('verify')} />
          <div className="flex items-center gap-2 lg:hidden">
            <HeaderActions onWalletClick={onWalletClick} walletAddress={walletAddress} />
          </div>
        </div>
        <div className="flex justify-center">
          <NavPill view={view} onViewChange={onViewChange} onOpenPanel={onOpenPanel} />
        </div>
        <div className="hidden items-center justify-end gap-2 lg:flex">
          <HeaderActions onWalletClick={onWalletClick} walletAddress={walletAddress} />
        </div>
      </div>
    </header>
  )
}

function HeaderActions({ onWalletClick, walletAddress }: Pick<Props, 'onWalletClick' | 'walletAddress'>) {
  return (
    <>
      <a
        href="https://x.com/VerifyXMR"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="VerifyXMR on X (opens in a new tab)"
        className="flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground transition-colors hover:text-foreground"
      >
        <XIcon />
      </a>
      <button
        type="button"
        onClick={onWalletClick}
        className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {walletAddress ? <span className="font-mono">{shortAddress(walletAddress)}</span> : 'Connect wallet'}
      </button>
    </>
  )
}
