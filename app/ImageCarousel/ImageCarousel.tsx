import { useEffect, useState } from 'react'
import { carouselData } from './carouselData'
import { CarouselControls } from './CarouselControls'
import { ImageViewer } from './ImageViewer'
import { ThumbnailList } from './ThumbnailList'
import type { CarouselImage } from './types'

type ImageCarouselProps = {
  images?: CarouselImage[]
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = carouselData,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isThumbnailsExpanded, setIsThumbnailsExpanded] = useState(false)
  const total = images.length

  const showPrevious = () =>
    setSelectedIndex((index) => (index - 1 + total) % total)
  const showNext = () => setSelectedIndex((index) => (index + 1) % total)

  useEffect(() => {
    // The expanded thumbnail grid handles its own keyboard navigation
    if (isThumbnailsExpanded) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setIsThumbnailsExpanded(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [total, isThumbnailsExpanded])

  if (total === 0) {
    return (
      <p className="p-4 text-gray-600 dark:text-gray-400">
        No images to display.
      </p>
    )
  }

  return (
    <main className="flex flex-col">
      <ThumbnailList
        images={images}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        isExpanded={isThumbnailsExpanded}
        onExpandedChange={setIsThumbnailsExpanded}
      />
      <div className="mx-auto w-full max-w-5xl p-4 pt-6">
        <CarouselControls
          current={selectedIndex}
          total={total}
          onPrevious={showPrevious}
          onNext={showNext}
        >
          <ImageViewer image={images[selectedIndex]} />
        </CarouselControls>
      </div>
    </main>
  )
}
