'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LAUNCHED_TOKENS, pumpFunUrl, type LaunchedToken } from '@/lib/tokens'
import { ViewHeading } from '@/components/view-heading'

type Filter = 'all' | 'new' | 'migrated'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'migrated', label: 'Migrated' },
]

export function CoinsView() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (e.key === '/' && !typing) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const tokens = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LAUNCHED_TOKENS.filter((t) => {
      if (filter === 'new' && t.migrated) return false
      if (filter === 'migrated' && !t.migrated) return false
      if (!q) return true
      return [t.name, t.symbol, t.ca].some((v) => v.toLowerCase().includes(q))
    }).sort((a, b) => (filter === 'new' ? (b.launchedAt ?? '').localeCompare(a.launchedAt ?? '') : 0))
  }, [query, filter])

  return (
    <section aria-labelledby="coins-heading" className="mx-auto w-full max-w-7xl px-4 pt-14 pb-20 sm:px-6">
      <ViewHeading id="coins-heading" title="Every token launched" subtitle="Every token launched through VerifyXMR" />

      <div className="mx-auto mt-8 max-w-xl">
        <label htmlFor="coin-search" className="sr-only">
          Search tokens
        </label>
        <div className="flex h-12 items-center gap-3 rounded-full border border-border bg-card/80 px-4 backdrop-blur-md focus-within:ring-2 focus-within:ring-ring/60">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <input
            ref={searchRef}
            id="coin-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ticker or address"
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground">
            /
          </kbd>
        </div>
      </div>

      <div role="group" aria-label="Filter tokens" className="mt-6 flex justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              filter === f.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tokens.length === 0 ? (
          <EmptyState searching={query.trim().length > 0 || LAUNCHED_TOKENS.length > 0} />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tokens.map((token) => (
              <li key={token.ca}>
                <TokenCard token={token} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function TokenCard({ token }: { token: LaunchedToken }) {
  return (
    <a
      href={pumpFunUrl(token.ca)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-md transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <img
        src={token.image || '/placeholder.svg'}
        alt=""
        className="size-14 shrink-0 rounded-xl bg-muted object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{token.name}</p>
        <p className="font-mono text-xs text-muted-foreground">${token.symbol}</p>
        <p className="mt-1 text-sm">
          <span className="text-muted-foreground">MC </span>
          <span className="font-medium text-success">{token.marketCap}</span>
        </p>
      </div>
      <ArrowUpRight
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
        aria-hidden="true"
      />
      <span className="sr-only">View {token.name} on Pump.fun (opens in a new tab)</span>
    </a>
  )
}

function EmptyState({ searching }: { searching: boolean }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 text-center backdrop-blur-sm">
      <p className="font-mono text-xs text-muted-foreground">$XMR</p>
      <p className="mt-3 text-lg font-semibold">{searching ? 'No matching tokens' : 'No tokens launched yet'}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {searching ? 'Try a different name, ticker or address.' : 'Tokens launched through VerifyXMR will appear here.'}
      </p>
    </div>
  )
}
