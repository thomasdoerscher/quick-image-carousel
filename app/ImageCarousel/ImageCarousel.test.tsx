import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageCarousel } from './ImageCarousel'
import { testImages } from './testImages'

const getCurrentImageTitle = () =>
  screen.getByRole('figure').querySelector('h2')?.textContent

describe('ImageCarousel', () => {
  it('shows the first image and its position', () => {
    render(<ImageCarousel images={testImages} />)

    expect(getCurrentImageTitle()).toBe('Forest')
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows the next image when "Next" is clicked', async () => {
    render(<ImageCarousel images={testImages} />)

    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))

    expect(getCurrentImageTitle()).toBe('Lake')
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })

  it('wraps to the last image when "Previous" is clicked on the first', async () => {
    render(<ImageCarousel images={testImages} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Previous image' }),
    )

    expect(getCurrentImageTitle()).toBe('Mountain')
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('wraps to the first image when "Next" is clicked on the last', async () => {
    render(<ImageCarousel images={testImages} />)
    const next = screen.getByRole('button', { name: 'Next image' })

    await userEvent.click(next)
    await userEvent.click(next)
    await userEvent.click(next)

    expect(getCurrentImageTitle()).toBe('Forest')
  })

  it('shows an image when its thumbnail is clicked', async () => {
    render(<ImageCarousel images={testImages} />)

    await userEvent.click(screen.getByRole('button', { name: 'Show Mountain' }))

    expect(getCurrentImageTitle()).toBe('Mountain')
    expect(
      screen.getByRole('button', { name: 'Show Mountain' }),
    ).toHaveAttribute('aria-current', 'true')
  })

  it('navigates with the left and right arrow keys', async () => {
    render(<ImageCarousel images={testImages} />)

    await userEvent.keyboard('{ArrowRight}')
    expect(getCurrentImageTitle()).toBe('Lake')

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(getCurrentImageTitle()).toBe('Mountain')
  })

  it('opens the thumbnail grid with the down arrow key and selects from it', async () => {
    render(<ImageCarousel images={testImages} />)

    await userEvent.keyboard('{ArrowDown}')
    expect(
      screen.getByRole('heading', { name: 'All images (3)' }),
    ).toBeInTheDocument()

    await userEvent.keyboard('{ArrowRight}{Enter}')

    expect(
      screen.queryByRole('heading', { name: 'All images (3)' }),
    ).not.toBeInTheDocument()
    expect(getCurrentImageTitle()).toBe('Lake')
  })

  it('shows a message when there are no images', () => {
    render(<ImageCarousel images={[]} />)

    expect(screen.getByText('No images to display.')).toBeInTheDocument()
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })
})
