import { useEffect, useState } from 'react'
import { carouselData } from './carouselData'
import { CarouselControls } from './CarouselControls'
import { ImageViewer } from './ImageViewer'
import { ThumbnailList } from './ThumbnailList'
import type { CarouselImage } from './types'

type ImageCarouselProps = {
  images?: CarouselImage[]
}

export const ImageCarousel = ({
  images = carouselData,
}: ImageCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const total = images.length

  const showPrevious = () =>
    setSelectedIndex((index) => (index - 1 + total) % total)
  const showNext = () => setSelectedIndex((index) => (index + 1) % total)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') showPrevious()
      if (event.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [total])

  if (total === 0) {
    return <p className="p-4 text-gray-600">No images to display.</p>
  }

  return (
    <main className="flex flex-col">
      <ThumbnailList
        images={images}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
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
