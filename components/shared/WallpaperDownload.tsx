"use client"

import { wallpaperSizes } from "@/constants"
import { download } from "@/lib/utils"
import { getCldImageUrl } from "next-cloudinary"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type WallpaperDownloadProps = {
  image: {
    publicId: string
    width: number
    height: number
  }
  title: string
  transformationConfig: object
}

const WallpaperDownload = ({ image, title, transformationConfig }: WallpaperDownloadProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDownload = async (size: typeof wallpaperSizes[number]) => {
    setDownloading(size.suffix)

    const isOriginal = size.width === 0
    const url = getCldImageUrl({
      src: image.publicId,
      width: isOriginal ? image.width : image.width,
      height: isOriginal ? image.height : image.height,
      ...transformationConfig,
      ...(isOriginal ? {} : {
        rawTransformations: [`c_fill,w_${size.width},h_${size.height},g_auto`]
      }),
    })

    download(url, `${title}_${size.suffix}`)
    setTimeout(() => {
      setDownloading(null)
      setIsOpen(false)
    }, 1000)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="download-btn flex items-center gap-2 rounded-full border-2 border-purple-200/20 px-4 py-2 transition-all hover:bg-purple-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/assets/icons/download.svg"
          alt="Download"
          width={20}
          height={20}
        />
        <span className="p-14-medium text-dark-600">Download</span>
      </button>

      {isOpen && (
        <div className="wallpaper-dropdown">
          {wallpaperSizes.map((size) => (
            <button
              key={size.suffix}
              className="wallpaper-dropdown-item"
              onClick={() => handleDownload(size)}
              disabled={downloading === size.suffix}
            >
              {size.suffix === "phone" && "📱"}
              {size.suffix === "desktop" && "🖥️"}
              {size.suffix === "tablet" && "📋"}
              {size.suffix === "original" && "📐"}
              <span>
                {downloading === size.suffix ? "Downloading..." : size.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WallpaperDownload
