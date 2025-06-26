"use client"

import { useState, useRef } from "react"

export interface WheelItem {
  name: string
  priority: number
  backgroundImage: string
}

interface SpinningWheelProps {
  items: WheelItem[]
  onItemSelected?: (item: WheelItem) => void
  onReset?: () => void
  size?: number
}

export function SpinningWheel({ items, onItemSelected, onReset, size = 320 }: SpinningWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Calculate slice sizes based on priority
  const totalWeight = items.reduce((sum, item) => sum + item.priority, 0)
  const slices = items.map((item) => {
    const percentage = (item.priority / totalWeight) * 100
    return {
      item,
      percentage,
      startAngle: 0, // Will be calculated below
      endAngle: 0, // Will be calculated below
    }
  })

  // Calculate angles for each slice
  let currentAngle = 0
  slices.forEach((slice) => {
    slice.startAngle = currentAngle
    slice.endAngle = currentAngle + (slice.percentage / 100) * 360
    currentAngle = slice.endAngle
  })

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)

    // Generate random spin (3-5 full rotations + random angle)
    const spins = 3 + Math.random() * 2
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + spins * 360 + randomAngle

    setRotation(totalRotation)

    // Calculate which slice the wheel lands on
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360)) % 360
      const selectedSlice = slices.find(
        (slice) => normalizedAngle >= slice.startAngle && normalizedAngle < slice.endAngle,
      )

      if (selectedSlice && onItemSelected) {
        onItemSelected(selectedSlice.item)
      }
      setIsSpinning(false)
    }, 3000)
  }

  const resetWheel = () => {
    setRotation(0)
    setIsSpinning(false)
    if (onReset) {
      onReset()
    }
  }

  const radius = size / 2
  const centerX = radius
  const centerY = radius

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="relative rounded-full border-4 border-white shadow-2xl overflow-hidden"
          style={{
            width: size,
            height: size,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 3s cubic-bezier(0.23, 1, 0.32, 1)" : "none",
          }}
        >
          <svg width={size} height={size} className="absolute inset-0">
            <defs>
              {/* Create patterns for background images */}
              {slices.map((slice) => (
                <pattern
                  key={`pattern-${slice.item.name}`}
                  id={`pattern-${slice.item.name}`}
                  patternUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <image
                    href={slice.item.backgroundImage}
                    x="0"
                    y="0"
                    width="1"
                    height="1"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              ))}
            </defs>

            {slices.map((slice) => {
              const { startAngle, endAngle, item } = slice

              // Convert angles to radians
              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180

              // Calculate arc path
              const x1 = centerX + radius * Math.cos(startRad)
              const y1 = centerY + radius * Math.sin(startRad)
              const x2 = centerX + radius * Math.cos(endRad)
              const y2 = centerY + radius * Math.sin(endRad)

              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
              ].join(" ")

              // Calculate text position
              const midAngle = (startAngle + endAngle) / 2
              const textRadius = radius * 0.7
              const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180)
              const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180)

              return (
                <g key={item.name}>
                  {/* Background image slice */}
                  <path d={pathData} fill={`url(#pattern-${item.name})`} stroke="white" strokeWidth="2" />
                  {/* Semi-transparent overlay for better text readability */}
                  <path d={pathData} fill="rgba(0, 0, 0, 0.4)" stroke="white" strokeWidth="2" />
                  {/* Text */}
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize={Math.max(8, size / 40)}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                      filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.8))",
                    }}
                  >
                    <tspan x={textX} dy="0">
                      {item.name.length > 15 ? item.name.substring(0, 12) + "..." : item.name}
                    </tspan>
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isSpinning ? "Spinning..." : "Spin the Wheel!"}
        </button>
        <button
          onClick={resetWheel}
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
