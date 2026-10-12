'use client'

import { useEffect, useId, useState } from 'react'
import { CheckCircle2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ViewHeading } from '@/components/view-heading'

type Props = {
  connected: boolean
  onConnectClick: () => void
}

type Errors = Partial<Record<'name' | 'symbol' | 'devBuy', string>>

export function LaunchView({ connected, onConnectClick }: Props) {
  const imageId = useId()
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [devBuy, setDevBuy] = useState('0')
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setImageUrl(URL.createObjectURL(file))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!connected) {
      onConnectClick()
      return
    }
    const next: Errors = {}
    if (!name.trim()) next.name = 'Token name is required.'
    if (!/^\$?[A-Za-z0-9]{2,10}$/.test(symbol.trim())) next.symbol = 'Use 2–10 letters or numbers.'
    const buy = Number(devBuy)
    if (Number.isNaN(buy) || buy < 0 || buy > 1) next.devBuy = 'Developer buy must be between 0 and 1 SOL.'
    setErrors(next)
    setSubmitted(Object.keys(next).length === 0)
  }

  return (
    <section aria-labelledby="launch-heading" className="mx-auto w-full max-w-3xl px-4 pt-14 pb-20 sm:px-6">
      <ViewHeading id="launch-heading" title="Launch a token" subtitle="Every token starts on VerifyXMR" />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 rounded-3xl border border-border bg-card/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-8"
      >
        <div className="mb-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 font-mono text-sm font-semibold text-primary">
              01
            </span>
            <h2 className="text-xl font-semibold tracking-tight">Create your token</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            SOLANA
          </span>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row">
          <label
            htmlFor={imageId}
            className="relative flex aspect-square w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-input bg-background/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-within:outline-2 focus-within:outline-ring sm:w-36"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Token image preview" className="absolute inset-0 size-full object-cover" />
            ) : (
              <>
                <Plus className="size-5" aria-hidden="true" />
                <span className="text-sm font-medium">Token image</span>
              </>
            )}
            <input id={imageId} type="file" accept="image/*" className="sr-only" onChange={handleImage} />
          </label>

          <div className="flex flex-1 flex-col gap-5">
            <Field label="Token name" htmlFor="token-name" error={errors.name}>
              <Input
                id="token-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Save Mochi"
                aria-invalid={Boolean(errors.name)}
                className="h-12 rounded-xl bg-background/60"
              />
            </Field>
            <Field label="Symbol" htmlFor="token-symbol" error={errors.symbol}>
              <Input
                id="token-symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="$MOCHI"
                aria-invalid={Boolean(errors.symbol)}
                className="h-12 rounded-xl bg-background/60"
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <Field label="Description" htmlFor="token-description">
            <Textarea
              id="token-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell traders what this launch is supporting..."
              className="min-h-28 rounded-xl bg-background/60"
            />
          </Field>
          <Field label="Developer buy (maximum 1 SOL)" htmlFor="token-devbuy" error={errors.devBuy}>
            <Input
              id="token-devbuy"
              type="number"
              inputMode="decimal"
              min={0}
              max={1}
              step={0.01}
              value={devBuy}
              onChange={(e) => setDevBuy(e.target.value)}
              aria-invalid={Boolean(errors.devBuy)}
              className="h-12 rounded-xl bg-background/60"
            />
          </Field>
        </div>

        <button
          type="submit"
          className="mt-7 h-13 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {connected ? 'Launch Token' : 'Connect wallet to launch'}
        </button>

        {submitted && (
          <p role="status" className="mt-4 flex items-center justify-center gap-2 text-sm text-success">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {symbol.replace(/^\$?/, '$')} is ready — approve the transaction in your wallet to launch.
          </p>
        )}
      </form>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
