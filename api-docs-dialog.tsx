'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Endpoint = {
  id: string
  method: 'GET' | 'POST'
  path: string
  summary: string
  params: { name: string; type: string; description: string }[]
  curl: string
  request?: string
  response: string
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'verify',
    method: 'POST',
    path: '/api/verify',
    summary:
      'Verify that a Monero transaction paid a given address. Provide either the transaction secret key or a signed OutProof string.',
    params: [
      { name: 'txid', type: 'string', description: '64-character transaction hash.' },
      { name: 'address', type: 'string', description: 'Recipient standard (4…) or subaddress (8…).' },
      { name: 'txKey', type: 'string?', description: 'Transaction secret key (hex). Required if no signature.' },
      { name: 'signature', type: 'string?', description: 'OutProofV2… / InProofV2… string.' },
    ],
    curl: `curl -X POST https://verifyxmr.app/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{"txid":"7c34…4b5c","address":"44AF…EP3A","txKey":"a1b2…8f90"}'`,
    request: `{
  "txid": "7c34a1f0e9b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c",
  "address": "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
  "txKey": "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90"
}`,
    response: `{
  "valid": true,
  "amount": "1.2345",
  "confirmations": 128,
  "blockHeight": 3271044,
  "timestamp": "2026-10-12T14:02:11.000Z"
}`,
  },
  {
    id: 'proof',
    method: 'GET',
    path: '/api/proof',
    summary: 'Generate an OutProofV2 signature string for a transaction and recipient address.',
    params: [
      { name: 'txid', type: 'query', description: '64-character transaction hash.' },
      { name: 'address', type: 'query', description: 'Recipient address the proof is scoped to.' },
      { name: 'message', type: 'query?', description: 'Optional message bound into the signature.' },
    ],
    curl: `curl "https://verifyxmr.app/api/proof?txid=7c34…4b5c&address=44AF…EP3A&message=invoice-42"`,
    response: `{
  "txid": "7c34a1f0e9b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c",
  "address": "44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A",
  "proof": "OutProofV2Lx7…qA9"
}`,
  },
  {
    id: 'tokens',
    method: 'GET',
    path: '/api/tokens/:ca',
    summary: 'Look up a token launched through VerifyXMR by its Solana contract (mint) address.',
    params: [{ name: 'ca', type: 'path', description: 'Solana mint address of the token.' }],
    curl: `curl https://verifyxmr.app/api/tokens/9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin`,
    response: `{
  "ca": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
  "name": "Save Mochi",
  "symbol": "MOCHI",
  "image": "https://verifyxmr.app/images/mochi.png",
  "marketCap": "$42.5K",
  "url": "https://pump.fun/9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
}`,
  },
]

export function ApiDocsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeId, setActiveId] = useState(ENDPOINTS[0].id)
  const active = ENDPOINTS.find((e) => e.id === activeId) ?? ENDPOINTS[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden rounded-2xl border-border bg-card p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold">API Documentation</DialogTitle>
          <DialogDescription>
            JSON over HTTPS. No authentication required for public endpoints.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <nav aria-label="Endpoints" className="shrink-0 border-b border-border p-3 md:w-64 md:border-r md:border-b-0">
            <p className="px-2 pb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">Endpoints</p>
            <ul className="flex gap-1 overflow-x-auto md:flex-col">
              {ENDPOINTS.map((e) => (
                <li key={e.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={e.id === activeId ? 'true' : undefined}
                    onClick={() => setActiveId(e.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-mono text-xs transition-colors',
                      e.id === activeId ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <MethodBadge method={e.method} />
                    {e.path}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <article className="min-h-0 flex-1 overflow-y-auto p-6">
            <h3 className="flex flex-wrap items-center gap-2 font-mono text-base font-semibold">
              <MethodBadge method={active.method} />
              {active.path}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{active.summary}</p>

            <h4 className="mt-6 text-sm font-semibold">Parameters</h4>
            <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
              {active.params.map((p) => (
                <div key={p.name} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[140px_80px_1fr]">
                  <dt className="font-mono text-foreground">{p.name}</dt>
                  <dd className="font-mono text-xs text-primary sm:pt-0.5">{p.type}</dd>
                  <dd className="text-muted-foreground">{p.description}</dd>
                </div>
              ))}
            </dl>

            <CodeBlock title="cURL" code={active.curl} />
            {active.request && <CodeBlock title="Request body" code={active.request} />}
            <CodeBlock title="Response · 200" code={active.response} />
          </article>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MethodBadge({ method }: { method: Endpoint['method'] }) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold',
        method === 'POST' ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success',
      )}
    >
      {method}
    </span>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-success" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}
