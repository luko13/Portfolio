// Sello personal (hanko): monograma luko13 tallado en rojo
export function Hanko({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="luko13"
      role="img"
    >
      <rect x="1.5" y="1.5" width="45" height="45" rx="6" fill="var(--hanko)" />
      <rect
        x="5"
        y="5"
        width="38"
        height="38"
        rx="3.5"
        fill="none"
        stroke="var(--washi)"
        strokeWidth="1.6"
        opacity="0.9"
      />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="15"
        fill="var(--washi)"
        letterSpacing="1"
      >
        LU
      </text>
      <text
        x="24"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="15"
        fill="var(--washi)"
        letterSpacing="1"
      >
        KO
      </text>
    </svg>
  )
}
