type CarouselControlsProps = {
  current: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

const buttonClassName =
  'rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'

export const CarouselControls = ({
  current,
  total,
  onPrevious,
  onNext,
}: CarouselControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous image"
        className={buttonClassName}
      >
        ← Prev
      </button>
      <span className="text-sm text-gray-600 tabular-nums dark:text-gray-400">
        {current + 1} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next image"
        className={buttonClassName}
      >
        Next →
      </button>
    </div>
  )
}
