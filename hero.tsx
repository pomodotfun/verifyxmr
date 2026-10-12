import { FileCheck2, KeyRound, Lock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VerifyCard } from '@/components/verify-card'
import { GenerateCard } from '@/components/generate-card'

export function Hero() {
  return (
    <section id="verify" className="relative scroll-mt-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(242,104,34,0.14),transparent)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Lock className="size-3" aria-hidden="true" />
          Runs entirely in your browser
        </span>
        <h1 className="max-w-3xl text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Cryptographic Proof of <span className="text-primary">Monero</span> Transactions
        </h1>
        <p className="mt-5 max-w-2xl text-center text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          Generate and independently verify zero-knowledge proof of payment on the Monero blockchain without
          compromising sender privacy or viewing balances.
        </p>

        <Tabs defaultValue="verify" className="mt-10 w-full max-w-2xl gap-4">
          <TabsList className="mx-auto h-11! w-full max-w-sm rounded-lg border border-border bg-card p-1">
            <TabsTrigger
              value="verify"
              className="h-full data-active:bg-primary! data-active:text-primary-foreground!"
            >
              <FileCheck2 aria-hidden="true" />
              Verify a Proof
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="h-full data-active:bg-primary! data-active:text-primary-foreground!"
            >
              <KeyRound aria-hidden="true" />
              Generate a Proof
            </TabsTrigger>
          </TabsList>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/40 sm:p-8">
            <TabsContent value="verify">
              <VerifyCard />
            </TabsContent>
            <TabsContent value="generate">
              <GenerateCard />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  )
}
