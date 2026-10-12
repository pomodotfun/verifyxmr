'use client'

import { useState } from 'react'
import { Check, Copy, KeyRound, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PasteField, SecretField } from '@/components/proof-fields'
import { isAddress, isTxHash, isTxKey, simulateProof } from '@/lib/monero'

type Errors = Partial<Record<'txKey' | 'txid' | 'address', string>>

export function GenerateCard() {
  const [txKey, setTxKey] = useState('')
  const [txid, setTxid] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [proof, setProof] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!isTxKey(txKey)) next.txKey = 'Tx private key must be 64 hexadecimal characters.'
    if (!isTxHash(txid)) next.txid = 'Transaction hash must be 64 hexadecimal characters.'
    if (!isAddress(address)) next.address = 'Enter a valid standard (4…) or subaddress (8…).'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    setCopied(false)
    const value = await simulateProof(`${txKey.trim()}|${txid.trim()}|${address.trim()}`)
    await new Promise((r) => setTimeout(r, 500))
    setProof(value)
    setLoading(false)
  }

  async function handleCopy() {
    if (!proof) return
    await navigator.clipboard.writeText(proof)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <SecretField
        id="gen-txkey"
        label="Tx Private Key"
        hint="Never leaves your browser"
        placeholder="64-character hex key"
        value={txKey}
        onChange={setTxKey}
        error={errors.txKey}
      />
      <PasteField
        id="gen-txid"
        label="Transaction Hash (TxID)"
        placeholder="e.g. 7c34a1f0e9…"
        value={txid}
        onChange={setTxid}
        error={errors.txid}
      />
      <PasteField
        id="gen-address"
        label="Recipient Address"
        hint="Standard or subaddress"
        placeholder="4… or 8…"
        value={address}
        onChange={setAddress}
        error={errors.address}
      />

      <Button type="submit" size="lg" disabled={loading} className="h-12 text-base font-semibold">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <KeyRound className="size-4" aria-hidden="true" />
        )}
        Generate Proof String
      </Button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="gen-output">Proof Output</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!proof}
            className="border-border bg-transparent"
          >
            {copied ? (
              <Check className="size-3.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy Proof'}
          </Button>
        </div>
        <Textarea
          id="gen-output"
          readOnly
          value={proof}
          placeholder="Your OutProofV2… string will appear here."
          rows={4}
          className="min-h-28 resize-none bg-background/60 font-mono text-xs leading-relaxed break-all text-primary placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/60"
        />
        <p className="text-[11px] text-muted-foreground">
          Preview mode: the output is a simulated string for UI demonstration only.
        </p>
      </div>
    </form>
  )
}
