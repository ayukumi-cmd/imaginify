"use client"

import { useCallback, useRef, useState } from "react"

type BeforeAfterSliderProps = {
  originalSrc: string
  transformedSrc: string
  originalAlt: string
  transformedAlt: string
  width: number
  height: number
}

const BeforeAfterSlider = ({
  originalSrc,
  transformedSrc,
  originalAlt,
  transformedAlt,
  width,
  height,
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    updatePosition(e.clientX)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }

  const handleClick = (e: React.MouseEvent) => {
    updatePosition(e.clientX)
  }

  const aspectRatio = width && height ? width / height : 16 / 9

  return (
    <div
      ref={containerRef}
      className="slider-container"
      style={{ aspectRatio }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      {/* Transformed image (background, full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={transformedSrc}
        alt={transformedAlt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Original image (foreground, clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalSrc}
          alt={originalAlt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider handle */}
      <div
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="slider-handle-line" />
        <div className="slider-handle-circle">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L2 8L5 13" stroke="#7857FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 3L14 8L11 13" stroke="#7857FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="slider-label left-3">Original</span>
      <span className="slider-label right-3">Transformed</span>
    </div>
  )
}

export default BeforeAfterSlider
