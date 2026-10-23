import { forwardRef, useEffect, useRef, useState, type KeyboardEventHandler, type Ref } from 'react'
import type { CarouselImage } from './types'

type ThumbnailListProps = {
  images: CarouselImage[]
  selectedIndex: number
  onSelect: (index: number) => void
  isExpanded: boolean
  onExpandedChange: (isExpanded: boolean) => void
}

type IconButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
  expanded?: boolean
  iconPath: string
  ref?: Ref<HTMLButtonElement>
}

const EXPAND_PATH = 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'
const COLLAPSE_PATH = 'M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  label,
  onClick,
  disabled = false,
  expanded,
  iconPath,
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-expanded={expanded}
      title={label}
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
})

export const ThumbnailList = ({
  images,
  selectedIndex,
  onSelect,
  isExpanded,
  onExpandedChange,
}: ThumbnailListProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  // Thumbnail highlighted by keyboard navigation while the grid is open
  const [activeIndex, setActiveIndex] = useState(selectedIndex)

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

  useEffect(() => {
    if (!isExpanded) {
      // Bring the selected thumbnail into view after leaving the grid
      listRef.current
        ?.querySelector('[aria-current="true"]')
        ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      return
    }

    setActiveIndex(selectedIndex)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isExpanded])

  useEffect(() => {
    if (!isExpanded) return
    listRef.current?.querySelectorAll('button')[activeIndex]?.focus()
  }, [isExpanded, activeIndex])

  const handleSelect = (index: number) => {
    onSelect(index)
    onExpandedChange(false)
  }

  // Finds the thumbnail in the adjacent row closest horizontally to `index`
  const getIndexInAdjacentRow = (index: number, direction: -1 | 1) => {
    const items = Array.from(listRef.current?.children ?? []) as HTMLElement[]
    const current = items[index]
    if (!current) return index

    const rowTops = [...new Set(items.map((item) => item.offsetTop))].sort(
      (a, b) => a - b,
    )
    const targetTop = rowTops[rowTops.indexOf(current.offsetTop) + direction]
    if (targetTop === undefined) return index

    const center = (item: HTMLElement) => item.offsetLeft + item.offsetWidth / 2
    let closestIndex = index
    let closestDistance = Infinity
    items.forEach((item, itemIndex) => {
      if (item.offsetTop !== targetTop) return
      const distance = Math.abs(center(item) - center(current))
      if (distance < closestDistance) {
        closestIndex = itemIndex
        closestDistance = distance
      }
    })
    return closestIndex
  }

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()

    const total = images.length
    if (event.key === 'Tab' && !event.shiftKey) {
      toggleButtonRef.current?.focus()
    }

    if (!isExpanded) return

    switch (event.key) {
      case 'ArrowLeft':
        setActiveIndex((index) => (index - 1 + total) % total)
        break
      case 'ArrowRight':
        setActiveIndex((index) => (index + 1) % total)
        break
      case 'ArrowUp':
        setActiveIndex((index) => getIndexInAdjacentRow(index, -1))
        break
      case 'ArrowDown':
        setActiveIndex((index) => getIndexInAdjacentRow(index, 1))
        break
      case 'Enter':
        // Let the collapse button handle its own activation
        if (document.activeElement === toggleButtonRef.current) return
        handleSelect(activeIndex)
        break
      case 'Escape':
        onExpandedChange(false)
        break
      default:
        return
    }
  }

  const scrollBy = (direction: -1 | 1) => {
    const list = listRef.current
    if (!list) return
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: 'smooth',
    })
  }

  const hasOverflow = !isExpanded && (canScrollLeft || canScrollRight)

  return (
    <div
      className={`flex bg-gray-50 dark:bg-gray-900 ${
        isExpanded
          ? 'fixed inset-0 z-40 flex-col'
          : 'items-center gap-2 border-b border-gray-200 px-2 py-1 dark:border-gray-800'
      }`}
    >
      {isExpanded && (
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            All images ({images.length})
          </h2>
          <IconButton
            ref={toggleButtonRef}
            label="Collapse thumbnails"
            onClick={() => onExpandedChange(false)}
            expanded
            iconPath={COLLAPSE_PATH}
          />
        </div>
      )}
      {hasOverflow && (
        <IconButton
          label="Scroll thumbnails left"
          onClick={() => scrollBy(-1)}
          disabled={!canScrollLeft}
          iconPath="M15 18l-6-6 6-6"
        />
      )}
      <ul
        ref={listRef}
        className={`flex min-w-0 flex-1 gap-3 ${
          isExpanded
            ? 'flex-wrap content-start justify-center overflow-y-auto p-4'
            : 'overflow-x-auto p-2'
        }`}
        aria-label="Thumbnails"
      >
        {images.map((image, index) => {
          const isSelected = index === selectedIndex
          const isActive = isExpanded && index === activeIndex
          return (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                tabIndex={isSelected ? 1 : 0}
                onClick={() => handleSelect(index)}
                onKeyDown={handleKeyDown}
                aria-label={`Show ${image.title}`}
                aria-current={isSelected}
                className={`block overflow-hidden rounded-md border-2 transition focus:outline-none ${
                  isSelected
                    ? 'border-blue-500'
                    : 'border-transparent opacity-60 hover:opacity-100'
                } ${
                  isActive
                    ? 'opacity-100 ring-2 ring-blue-300 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900'
                    : ''
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
        <IconButton
          label="Scroll thumbnails right"
          onClick={() => scrollBy(1)}
          disabled={!canScrollRight}
          iconPath="M9 18l6-6-6-6"
        />
      )}
      {!isExpanded && (
        <IconButton
          ref={toggleButtonRef}
          label="Show all thumbnails"
          onClick={() => onExpandedChange(true)}
          expanded={false}
          iconPath={EXPAND_PATH}
        />
      )}
    </div>
  )
}
