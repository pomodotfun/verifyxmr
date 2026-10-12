'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Layers, Loader2, ShieldCheck, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PasteField, SecretField } from '@/components/proof-fields'
import {
  isAddress,
  isProofString,
  isTxHash,
  isTxKey,
  simulateVerification,
  truncateMiddle,
} from '@/lib/monero'

type Result =
  | { status: 'valid'; amount: string; confirmations: number; blockHeight: number; timestamp: Date; txid: string }
  | { status: 'invalid'; message: string }

type Errors = Partial<Record<'txid' | 'address' | 'txKey' | 'signature', string>>

export function VerifyCard() {
  const [txid, setTxid] = useState('')
  const [address, setAddress] = useState('')
  const [txKey, setTxKey] = useState('')
  const [signature, setSignature] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  function validate(): Errors {
    const next: Errors = {}
    if (!isTxHash(txid)) next.txid = 'Transaction hash must be 64 hexadecimal characters.'
    if (!isAddress(address)) next.address = 'Enter a valid standard (4…) or subaddress (8…).'
    const hasSignature = signature.trim().length > 0
    if (!hasSignature && !isTxKey(txKey)) next.txKey = 'Provide a 64-character tx key, or a signature below.'
    if (hasSignature && !isProofString(signature)) next.signature = 'Expected an OutProofV2… or InProofV2… string.'
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setResult({ status: 'invalid', message: 'Proof could not be verified. Check the highlighted fields.' })
      return
    }
    setLoading(true)
    setResult(null)
    const data = await simulateVerification(`${txid.trim()}|${address.trim()}|${txKey.trim() || signature.trim()}`)
    await new Promise((r) => setTimeout(r, 700))
    setResult({ status: 'valid', txid: txid.trim(), ...data })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <PasteField
        id="verify-txid"
        label="Transaction Hash (TxID)"
        placeholder="e.g. 7c34a1f0e9…"
        value={txid}
        onChange={setTxid}
        error={errors.txid}
      />
      <PasteField
        id="verify-address"
        label="Recipient Address"
        hint="Standard or subaddress"
        placeholder="4… or 8…"
        value={address}
        onChange={setAddress}
        error={errors.address}
      />
      <SecretField
        id="verify-txkey"
        label="Transaction Secret Key (Tx Key)"
        hint="From get_tx_key"
        placeholder="64-character hex key"
        value={txKey}
        onChange={setTxKey}
        error={errors.txKey}
      />

      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="verify-signature">Signature / Proof String</Label>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
        <Textarea
          id="verify-signature"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Paste the full OutProofV2… string from get_tx_proof"
          spellCheck={false}
          rows={3}
          aria-invalid={Boolean(errors.signature)}
          aria-describedby={errors.signature ? 'verify-signature-error' : undefined}
          className="min-h-24 resize-y bg-background/60 font-mono text-sm break-all placeholder:font-sans placeholder:text-muted-foreground/60"
        />
        {errors.signature && (
          <p id="verify-signature-error" className="text-xs text-destructive">
            {errors.signature}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={loading} className="h-12 text-base font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Verifying…
          </>
        ) : (
          <>
            <ShieldCheck className="size-4" aria-hidden="true" />
            Verify Proof
          </>
        )}
      </Button>

      <div aria-live="polite">{result && <ResultPanel result={result} />}</div>
    </form>
  )
}

function ResultPanel({ result }: { result: Result }) {
  if (result.status === 'invalid') {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
        <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
        <p>{result.message}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-success/30 bg-success/5 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/20 px-4 py-3">
        <Badge className="gap-1 border-success/30 bg-success/15 text-success">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          Valid Proof
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">{truncateMiddle(result.txid, 10, 10)}</span>
      </div>
      <dl className="grid grid-cols-1 gap-px bg-success/10 sm:grid-cols-3">
        <Stat label="Amount Confirmed" value={`${result.amount} XMR`} highlight />
        <Stat
          label="Confirmations"
          value={result.confirmations >= 12 ? `${result.confirmations} (12+)` : String(result.confirmations)}
          icon={<Layers className="size-3.5" aria-hidden="true" />}
        />
        <Stat
          label={`Block #${result.blockHeight.toLocaleString()}`}
          value={result.timestamp.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
          icon={<Clock className="size-3.5" aria-hidden="true" />}
        />
      </dl>
      <p className="px-4 py-2 text-[11px] text-muted-foreground">
        Preview mode: values are simulated for UI demonstration and are not read from the blockchain.
      </p>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 bg-card px-4 py-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className={highlight ? 'font-mono text-lg font-semibold text-success' : 'font-mono text-sm'}>{value}</dd>
    </div>
  )
}
