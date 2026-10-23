import type { CarouselImage } from './types'

type ThumbnailListProps = {
  images: CarouselImage[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export const ThumbnailList = ({
  images,
  selectedIndex,
  onSelect,
}: ThumbnailListProps) => {
  return (
    <ul className="flex gap-3 overflow-x-auto p-2" aria-label="Thumbnails">
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
  )
}
