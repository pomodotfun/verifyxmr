import type { Panel } from '@/components/site-header'

export function SiteFooter({ onOpenPanel }: { onOpenPanel: (panel: Panel) => void }) {
  const linkClass = 'transition-colors hover:text-foreground'
  return (
    <footer className="border-t border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          <span className="font-medium text-foreground">
            Verify<span className="text-primary">XMR</span>
          </span>{' '}
          — Open source Monero verification tool
        </p>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-6">
            <li>
              <button type="button" className={linkClass} onClick={() => onOpenPanel('docs')}>
                API Docs
              </button>
            </li>
            <li>
              <button type="button" className={linkClass} onClick={() => onOpenPanel('faq')}>
                FAQ
              </button>
            </li>
            <li>
              <a href="https://github.com/monero-project" target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
