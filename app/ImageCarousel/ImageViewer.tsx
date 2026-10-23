import { format, parseISO } from 'date-fns'
import type { CarouselImage } from './types'

type ImageViewerProps = {
  image: CarouselImage
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image }) => {
  return (
    <figure className="flex flex-col items-center gap-3">
      <img
        src={image.src}
        alt={image.title}
        className="max-h-[70vh] w-full rounded-lg object-contain"
      />
      <figcaption className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {image.title}
        </h2>
        <p className="text-base font-medium text-gray-600 dark:text-gray-200">
          {image.author}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={image.date}>
            {format(parseISO(image.date), 'MMMM d, yyyy')}
          </time>
          {image.camera && ` · ${image.camera}`}
        </p>
      </figcaption>
    </figure>
  )
}
