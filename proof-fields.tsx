'use client'

import { useState } from 'react'
import { ClipboardPaste, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FieldProps = {
  id: string
  label: string
  hint?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: Pick<FieldProps, 'id' | 'label' | 'hint' | 'error'> & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'h-11 bg-background/60 pr-11 font-mono text-sm placeholder:font-sans placeholder:text-muted-foreground/60'

export function PasteField(props: FieldProps) {
  const { id, placeholder, value, onChange, error } = props

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      onChange(text.trim())
    } catch {
      document.getElementById(id)?.focus()
    }
  }

  return (
    <FieldShell {...props}>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />
        <button
          type="button"
          onClick={handlePaste}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
        >
          <ClipboardPaste className="size-4" aria-hidden="true" />
          <span className="sr-only">Paste {props.label}</span>
        </button>
      </div>
    </FieldShell>
  )
}

export function SecretField(props: FieldProps) {
  const { id, placeholder, value, onChange, error } = props
  const [visible, setVisible] = useState(false)

  return (
    <FieldShell {...props}>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary"
        >
          {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          <span className="sr-only">{visible ? 'Hide' : 'Show'} {props.label}</span>
        </button>
      </div>
    </FieldShell>
  )
}
