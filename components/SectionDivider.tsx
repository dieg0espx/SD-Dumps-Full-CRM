import React from 'react'

type DividerType = 'wave' | 'wave-reverse' | 'angle' | 'curve' | 'tilt'

interface SectionDividerProps {
  type?: DividerType
  fromColor?: string
  toColor?: string
  className?: string
}

export default function SectionDivider({
  type = 'wave',
  fromColor = 'white',
  toColor = '#f9fafb',
  className = ''
}: SectionDividerProps) {
  const dividers = {
    wave: (
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z"
          fill={toColor}
        />
      </svg>
    ),
    'wave-reverse': (
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block rotate-180"
        preserveAspectRatio="none"
      >
        <path
          d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z"
          fill={fromColor}
        />
      </svg>
    ),
    angle: (
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 1440,60 0,60" fill={toColor} />
      </svg>
    ),
    curve: (
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80C360 0 1080 0 1440 80V80H0V80Z"
          fill={toColor}
        />
        <ellipse cx="720" cy="80" rx="720" ry="40" fill={toColor} />
      </svg>
    ),
    tilt: (
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <polygon points="0,80 1440,0 1440,80" fill={toColor} />
      </svg>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${className}`} style={{ backgroundColor: fromColor }}>
      {dividers[type]}
    </div>
  )
}
