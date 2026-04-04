interface LogoProps { size?: number }

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="#e8ff47" />
      <path d="M9 22V13l9-2.5V20" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="22" r="2.8" fill="#000" />
      <circle cx="18" cy="20" r="2.8" fill="#000" />
    </svg>
  )
}
