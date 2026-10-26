import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CarouselControls } from './CarouselControls'

const renderControls = (props = {}) => {
  const onNext = jest.fn()
  const onPrevious = jest.fn()
  render(
    <CarouselControls
      current={1}
      total={5}
      onNext={onNext}
      onPrevious={onPrevious}
      {...props}
    >
      <p>Slide content</p>
    </CarouselControls>,
  )
  return { onNext, onPrevious }
}

describe('CarouselControls', () => {
  it('renders the current slide content', () => {
    renderControls()

    expect(screen.getByText('Slide content')).toBeInTheDocument()
  })

  it('shows the current position out of the total', () => {
    renderControls({ current: 1, total: 5 })

    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('calls onNext when the next button is clicked', async () => {
    const { onNext, onPrevious } = renderControls()

    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onPrevious).not.toHaveBeenCalled()
  })

  it('calls onPrevious when the previous button is clicked', async () => {
    const { onNext, onPrevious } = renderControls()

    await userEvent.click(
      screen.getByRole('button', { name: 'Previous image' }),
    )

    expect(onPrevious).toHaveBeenCalledTimes(1)
    expect(onNext).not.toHaveBeenCalled()
  })
})
