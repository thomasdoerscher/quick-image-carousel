import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('offers dark mode when the light theme is active', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />)

    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    ).toBeInTheDocument()
  })

  it('offers light mode when the dark theme is active', () => {
    render(<ThemeToggle theme="dark" onToggle={() => {}} />)

    expect(
      screen.getByRole('button', { name: 'Switch to light mode' }),
    ).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const onToggle = jest.fn()
    render(<ThemeToggle theme="light" onToggle={onToggle} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Switch to dark mode' }),
    )

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
