import { useEffect, useRef, useState } from 'react'
import type { CarouselImage } from './types'

type ThumbnailListProps = {
  images: CarouselImage[]
  selectedIndex: number
  onSelect: (index: number) => void
}

type ScrollButtonProps = {
  label: string
  onClick: () => void
  disabled: boolean
  iconPath: string
}

const ScrollButton = ({
  label,
  onClick,
  disabled,
  iconPath,
}: ScrollButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm hover:bg-gray-100 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:disabled:hover:bg-gray-800"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d={iconPath} />
      </svg>
    </button>
  )
}

export const ThumbnailList = ({
  images,
  selectedIndex,
  onSelect,
}: ThumbnailListProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const updateScrollState = () => {
      const maxScrollLeft = list.scrollWidth - list.clientWidth
      setCanScrollLeft(list.scrollLeft > 0)
      setCanScrollRight(list.scrollLeft < maxScrollLeft - 1)
    }

    updateScrollState()
    list.addEventListener('scroll', updateScrollState, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(list)
    return () => {
      list.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [images.length])

  const scrollBy = (direction: -1 | 1) => {
    const list = listRef.current
    if (!list) return
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: 'smooth',
    })
  }

  const hasOverflow = canScrollLeft || canScrollRight

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-800 dark:bg-gray-900">
      {hasOverflow && (
        <ScrollButton
          label="Scroll thumbnails left"
          onClick={() => scrollBy(-1)}
          disabled={!canScrollLeft}
          iconPath="M15 18l-6-6 6-6"
        />
      )}
      <ul
        ref={listRef}
        className="flex min-w-0 flex-1 gap-3 overflow-x-auto p-2"
        aria-label="Thumbnails"
      >
        {images.map((image, index) => {
          const isSelected = index === selectedIndex
          return (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Show ${image.title}`}
                aria-current={isSelected}
                className={`block overflow-hidden rounded-md border-2 transition ${
                  isSelected
                    ? 'border-blue-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-16 w-24 object-cover"
                />
              </button>
            </li>
          )
        })}
      </ul>
      {hasOverflow && (
        <ScrollButton
          label="Scroll thumbnails right"
          onClick={() => scrollBy(1)}
          disabled={!canScrollRight}
          iconPath="M9 18l6-6-6-6"
        />
      )}
    </div>
  )
}
