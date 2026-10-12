import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const faqs = [
  {
    q: 'What is an XMR transaction proof?',
    a: 'A transaction proof is cryptographic evidence that a specific Monero transaction sent funds to a given address. It is created with the sender’s transaction secret key (or a signed OutProof) and lets a third party confirm the payment and amount without seeing anything else in either wallet.',
  },
  {
    q: 'Is it safe to share my transaction key?',
    a: 'A tx key only proves outputs of that single transaction to a specific address. It cannot be used to spend funds or reveal other transactions. For extra assurance, share a signed proof string from get_tx_proof instead, which never exposes the raw key.',
  },
  {
    q: 'Can this reveal my total wallet balance?',
    a: 'No. Proofs are scoped to one transaction and one recipient address. Your view key, spend key, balance, and remaining history stay private.',
  },
  {
    q: 'Does VerifyXMR store anything I enter?',
    a: 'No. Inputs are processed in your browser session and are discarded when you close or refresh the page. Nothing is logged or sent to our servers.',
  },
  {
    q: 'Why do I need a Solana wallet?',
    a: 'Only for launching tokens. Connecting a wallet shares your public address so you can sign the launch transaction. VerifyXMR never asks for your seed phrase.',
  },
  {
    q: 'Where do launched tokens trade?',
    a: 'Every token launched through VerifyXMR is listed in the Coins directory. Selecting a token opens its Pump.fun page in a new tab.',
  },
]

export function FaqDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-4 overflow-hidden rounded-2xl border-border bg-card p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Frequently asked questions</DialogTitle>
          <DialogDescription>Everything you need to know about proofs, wallets and launches.</DialogDescription>
        </DialogHeader>
        <Accordion className="-mx-1 overflow-y-auto px-1">
          {faqs.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-border">
              <AccordionTrigger className="py-4 text-base hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  )
}
