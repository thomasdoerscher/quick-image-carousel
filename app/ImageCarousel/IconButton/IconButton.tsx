import { forwardRef } from 'react'

type IconButtonProps = {
  disabled?: boolean
  expanded?: boolean
  iconPath: string
  label: string
  onClick: () => void
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ disabled = false, expanded, iconPath, label, onClick }, ref) => {
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
  },
)
