import type { CarouselImage } from './types'

type ImageViewerProps = {
  image: CarouselImage
}

export const ImageViewer = ({ image }: ImageViewerProps) => {
  return (
    <figure className="flex flex-col items-center gap-3">
      <img
        src={image.src}
        alt={image.title}
        className="max-h-[70vh] w-full rounded-lg object-contain"
      />
      <figcaption className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {image.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {image.author} · {image.date}
          {image.camera && ` · ${image.camera}`}
        </p>
      </figcaption>
    </figure>
  )
}
