'use client'

import { useState } from 'react'
import { SiteHeader, type Panel, type View } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { LaunchView } from '@/components/launch-view'
import { CoinsView } from '@/components/coins-view'
import { ApiDocsDialog } from '@/components/api-docs-dialog'
import { FaqDialog } from '@/components/faq'
import { ConnectWalletDialog, type ConnectedWallet } from '@/components/connect-wallet-dialog'
import { disconnectWallet } from '@/lib/wallets'

export function AppShell() {
  const [view, setView] = useState<View>('verify')
  const [panel, setPanel] = useState<Panel | null>(null)
  const [walletOpen, setWalletOpen] = useState(false)
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)

  function changeView(next: View) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDisconnect() {
    if (wallet) await disconnectWallet(wallet.id).catch(() => undefined)
    setWallet(null)
    setWalletOpen(false)
  }

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-[url('/images/space-bg.png')] bg-cover bg-right opacity-70"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/20"
      />

      <SiteHeader
        view={view}
        onViewChange={changeView}
        onOpenPanel={setPanel}
        onWalletClick={() => setWalletOpen(true)}
        walletAddress={wallet?.address ?? null}
      />

      <main className="flex-1">
        {view === 'verify' && (
          <>
            <Hero />
            <Features />
          </>
        )}
        {view === 'launch' && <LaunchView connected={Boolean(wallet)} onConnectClick={() => setWalletOpen(true)} />}
        {view === 'coins' && <CoinsView />}
      </main>

      <SiteFooter onOpenPanel={setPanel} />

      <ApiDocsDialog open={panel === 'docs'} onOpenChange={(open) => setPanel(open ? 'docs' : null)} />
      <FaqDialog open={panel === 'faq'} onOpenChange={(open) => setPanel(open ? 'faq' : null)} />
      <ConnectWalletDialog
        open={walletOpen}
        onOpenChange={setWalletOpen}
        wallet={wallet}
        onConnect={(next) => {
          setWallet(next)
          setWalletOpen(false)
        }}
        onDisconnect={handleDisconnect}
      />
    </div>
  )
}
