import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('is labelled for assistive technology and shows a tooltip', () => {
    render(
      <IconButton label="Scroll left" iconPath="M0 0" onClick={() => {}} />,
    )

    const button = screen.getByRole('button', { name: 'Scroll left' })
    expect(button).toHaveAttribute('title', 'Scroll left')
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    render(<IconButton label="Scroll left" iconPath="M0 0" onClick={onClick} />)

    await userEvent.click(screen.getByRole('button', { name: 'Scroll left' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = jest.fn()
    render(
      <IconButton
        label="Scroll left"
        iconPath="M0 0"
        onClick={onClick}
        disabled
      />,
    )

    const button = screen.getByRole('button', { name: 'Scroll left' })
    await userEvent.click(button)

    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('reports its expanded state', () => {
    render(
      <IconButton
        label="Show all"
        iconPath="M0 0"
        onClick={() => {}}
        expanded={false}
      />,
    )

    expect(screen.getByRole('button', { name: 'Show all' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('forwards its ref to the button', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <IconButton
        ref={ref}
        label="Show all"
        iconPath="M0 0"
        onClick={() => {}}
      />,
    )

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Show all' }))
  })
})
