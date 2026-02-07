"use client"

import { transformationTypes } from "@/constants"
import { IImage } from "@/lib/database/models/image.model"
import { formUrlQuery } from "@/lib/utils"
import { CldImage } from "next-cloudinary"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

type TimelineProps = {
  images: IImage[]
  totalPages: number
  page: number
}

const Timeline = ({ images, totalPages, page }: TimelineProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1
    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    })
    router.push(newUrl, { scroll: false })
  }

  // Group images by date
  const groupedImages = images.reduce((groups, image) => {
    const date = new Date(image.createdAt as unknown as string).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(image)
    return groups
  }, {} as Record<string, IImage[]>)

  if (images.length === 0) {
    return (
      <div className="collection-empty">
        <p className="p-20-semibold">No transformations yet</p>
      </div>
    )
  }

  return (
    <>
      <div className="timeline-container">
        <div className="timeline-line" />

        {Object.entries(groupedImages).map(([date, dateImages], groupIdx) => (
          <div key={date}>
            <div className={`timeline-date-badge ${groupIdx === 0 ? "mt-0" : ""}`}>
              {date}
            </div>

            {dateImages.map((image, idx) => {
              const transformation = transformationTypes[
                image.transformationType as TransformationTypeKey
              ]

              return (
                <div
                  key={image._id.toString()}
                  className="timeline-item animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="timeline-dot" />
                  <Link
                    href={`/transformations/${image._id}`}
                    className="timeline-card"
                  >
                    <CldImage
                      src={image.publicId}
                      alt={image.title}
                      width={image.width || 200}
                      height={image.height || 200}
                      {...(image.config as object)}
                      className="w-16 h-16 rounded-[8px] object-cover flex-shrink-0"
                      sizes="64px"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="p-16-semibold text-dark-600 line-clamp-1">
                        {image.title}
                      </p>
                      <div className="timeline-type-badge w-fit">
                        <Image
                          src={`/assets/icons/${transformation.icon}`}
                          alt={transformation.title}
                          width={12}
                          height={12}
                        />
                        {transformation.title}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="collection-btn"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>
            <p className="flex-center p-16-medium w-fit flex-1">
              {page} / {totalPages}
            </p>
            <Button
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

export default Timeline
