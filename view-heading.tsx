export function ViewHeading({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h1 id={id} className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
        {title}
      </h1>
      <p className="mt-3 text-base text-muted-foreground sm:text-lg">{subtitle}</p>
    </div>
  )
}
