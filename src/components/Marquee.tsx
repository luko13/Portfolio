// Cinta infinita de dos filas en direcciones opuestas (CSS puro)
export function Marquee({ items }: { items: string[] }) {
  const row = items.join(' · ') + ' · '
  return (
    <div className="marquee" aria-label={items.join(', ')}>
      <div className="marquee-row">
        <span>{row}</span>
        <span aria-hidden="true">{row}</span>
      </div>
      <div className="marquee-row reverse" aria-hidden="true">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  )
}
