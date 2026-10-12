import { EyeOff, ServerOff, Terminal } from 'lucide-react'

const features = [
  {
    icon: ServerOff,
    title: '100% Client-Side Privacy',
    body: 'All cryptographic checks happen locally in your browser. Transaction keys and signatures never touch an external server.',
  },
  {
    icon: EyeOff,
    title: 'Zero Metadata Leakage',
    body: 'Verify settlements for merchants and escrow without exposing wallet balances, view keys, or unrelated transaction history.',
  },
  {
    icon: Terminal,
    title: 'Standards Compliant',
    body: 'Compatible with standard Monero CLI and GUI outputs.',
    code: ['check_tx_key', 'get_tx_proof'],
  },
]

export function Features() {
  return (
    <section id="how-it-works" aria-labelledby="features-heading" className="scroll-mt-16 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-medium text-primary">How it works</p>
          <h2 id="features-heading" className="text-3xl font-semibold tracking-tight text-balance">
            Prove a payment. Reveal nothing else.
          </h2>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body, code }) => (
            <li
              key={title}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              {code && (
                <div className="mt-auto flex flex-wrap gap-2">
                  {code.map((c) => (
                    <code
                      key={c}
                      className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
