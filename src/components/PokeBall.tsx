interface PokeBallProps {
  variant?: 'branding' | 'favorite' | 'empty' | 'error';
  active?: boolean;
  className?: string;
  size?: number;
}

export function PokeBall({
  variant = 'branding',
  active = false,
  className = '',
  size = 24,
}: PokeBallProps) {
  // Compute color palettes based on variant and active state
  let strokeColor = '#0F172A'; // Slate 900
  let topFill = '#E63946';     // Pokémon Red
  let bottomFill = '#FFFFFF';
  let centerOuterFill = '#0F172A';
  let centerButtonFill = '#FFFFFF';

  if (variant === 'favorite') {
    if (active) {
      // Activated state: Rich Red & Gold colors
      strokeColor = '#78350F';       // Dark amber
      topFill = '#E63946';           // Pokémon Red
      bottomFill = '#FBBF24';        // Golden amber
      centerOuterFill = '#78350F';
      centerButtonFill = '#FEF3C7';  // Light amber sheen
    } else {
      // Inactive/resting favorite state: subtle outlines, transparent insides
      strokeColor = 'currentColor';
      topFill = 'transparent';
      bottomFill = 'transparent';
      centerOuterFill = 'currentColor';
      centerButtonFill = 'transparent';
    }
  } else if (variant === 'empty') {
    // Monochromatic, sleeping grey tones for empty layouts
    strokeColor = '#94A3B8'; // Slate 400
    topFill = '#E2E8F0';     // Slate 200
    bottomFill = '#F8FAFC';  // Slate 50
    centerOuterFill = '#94A3B8';
    centerButtonFill = '#FFFFFF';
  } else if (variant === 'error') {
    // Cracked/damaged visual for error layouts
    strokeColor = '#475569'; // Slate 600
    topFill = '#F87171';     // Red 400 (dimmer, soft)
    bottomFill = '#E2E8F0';  // Slate 200
    centerOuterFill = '#475569';
    centerButtonFill = '#FFFFFF';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`select-none ${className}`}
      aria-hidden="true"
    >
      {/* Outer Shell Ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={variant === 'favorite' && !active ? 'transparent' : '#FFFFFF'}
        stroke={strokeColor}
        strokeWidth="6"
      />

      {/* Top Red Half */}
      <path
        d="M 7 50 A 43 43 0 0 1 93 50 Z"
        fill={topFill}
        stroke={variant === 'favorite' && !active ? 'transparent' : strokeColor}
        strokeWidth="4"
      />

      {/* Bottom Half (only if filled) */}
      {variant !== 'favorite' || active ? (
        <path
          d="M 7 50 A 43 43 0 0 0 93 50 Z"
          fill={bottomFill}
          stroke={strokeColor}
          strokeWidth="4"
        />
      ) : null}

      {/* Horizontal Middle Band Divider */}
      <line
        x1="6"
        y1="50"
        x2="94"
        y2="50"
        stroke={strokeColor}
        strokeWidth="8"
      />

      {/* Center Button Button Outer Ring */}
      <circle
        cx="50"
        cy="50"
        r="16"
        fill={centerOuterFill}
        stroke={strokeColor}
        strokeWidth="2"
      />

      {/* Center Button Inner White */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill={centerButtonFill}
        stroke={strokeColor}
        strokeWidth="2"
      />

      {/* Special Crack Lines (Only Error Variant) */}
      {variant === 'error' && (
        <path
          d="M 50 15 L 47 30 L 53 38 M 50 68 L 54 82 L 48 90"
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
