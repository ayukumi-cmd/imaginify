"use client"

import { transformationTypes } from "@/constants"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SurpriseMe = () => {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleSurprise = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const types = Object.keys(transformationTypes) as TransformationTypeKey[]
    const randomType = types[Math.floor(Math.random() * types.length)]

    setTimeout(() => {
      router.push(`/transformations/add/${randomType}`)
      setIsAnimating(false)
    }, 600)
  }

  return (
    <div className="surprise-me-section">
      <p className="p-14-medium text-dark-400 mb-2">Feeling adventurous?</p>
      <button
        onClick={handleSurprise}
        className="surprise-me-btn"
        disabled={isAnimating}
      >
        <Image
          src="/assets/icons/stars.svg"
          alt="surprise"
          width={24}
          height={24}
          className={isAnimating ? "animate-spin-once brightness-200" : "brightness-200"}
        />
        <span>{isAnimating ? "Rolling..." : "Surprise Me!"}</span>
      </button>
    </div>
  )
}

export default SurpriseMe
