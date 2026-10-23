import type { ReactNode } from 'react'

type CarouselControlsProps = {
  children: ReactNode
  current: number
  onNext: () => void
  onPrevious: () => void
  total: number
}

type NavButtonProps = {
  iconPath: string
  label: string
  onClick: () => void
  tooltip: string
}

const NavButton: React.FC<NavButtonProps> = ({
  iconPath,
  label,
  onClick,
  tooltip,
}) => {
  return (
    <div className="group relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d={iconPath} />
        </svg>
      </button>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900"
      >
        {tooltip}
      </span>
    </div>
  )
}

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  children,
  current,
  onNext,
  onPrevious,
  total,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <NavButton
          label="Previous image"
          tooltip="Prev"
          onClick={onPrevious}
          iconPath="M15 18l-6-6 6-6"
        />
        <div className="min-w-0 flex-1">{children}</div>
        <NavButton
          label="Next image"
          tooltip="Next"
          onClick={onNext}
          iconPath="M9 18l6-6-6-6"
        />
      </div>
      <span className="text-center text-sm text-gray-600 tabular-nums dark:text-gray-400">
        {current + 1} / {total}
      </span>
    </div>
  )
}
