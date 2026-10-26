import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { testImages } from '../testImages'
import { ThumbnailList } from './ThumbnailList'

const renderThumbnails = (props = {}) => {
  const onSelect = jest.fn()
  const onExpandedChange = jest.fn()
  render(
    <ThumbnailList
      images={testImages}
      selectedIndex={0}
      isExpanded={false}
      onSelect={onSelect}
      onExpandedChange={onExpandedChange}
      {...props}
    />,
  )
  return { onSelect, onExpandedChange }
}

const getThumbnail = (title: string) =>
  screen.getByRole('button', { name: `Show ${title}` })

describe('ThumbnailList', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows a thumbnail for every image', () => {
    renderThumbnails()

    const list = screen.getByRole('list', { name: 'Thumbnails' })
    expect(within(list).getAllByRole('button')).toHaveLength(testImages.length)
  })

  it('marks the selected thumbnail as current', () => {
    renderThumbnails({ selectedIndex: 1 })

    expect(getThumbnail('Lake')).toHaveAttribute('aria-current', 'true')
    expect(getThumbnail('Forest')).toHaveAttribute('aria-current', 'false')
  })

  it('selects an image when its thumbnail is clicked', async () => {
    const { onSelect, onExpandedChange } = renderThumbnails()

    await userEvent.click(getThumbnail('Mountain'))

    expect(onSelect).toHaveBeenCalledWith(2)
    expect(onExpandedChange).toHaveBeenCalledWith(false)
  })

  it('expands into a grid when "Show all thumbnails" is clicked', async () => {
    const { onExpandedChange } = renderThumbnails()

    await userEvent.click(
      screen.getByRole('button', { name: 'Show all thumbnails' }),
    )

    expect(onExpandedChange).toHaveBeenCalledWith(true)
  })

  describe('when the thumbnail strip overflows', () => {
    beforeEach(() => {
      jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(1000)
      jest.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(500)
    })

    it('shows scroll buttons, disabling the one at the edge', () => {
      renderThumbnails()

      expect(
        screen.getByRole('button', { name: 'Scroll thumbnails left' }),
      ).toBeDisabled()
      expect(
        screen.getByRole('button', { name: 'Scroll thumbnails right' }),
      ).toBeEnabled()
    })

    it('scrolls the strip when a scroll button is clicked', async () => {
      const scrollBy = jest.spyOn(Element.prototype, 'scrollBy')
      renderThumbnails()

      await userEvent.click(
        screen.getByRole('button', { name: 'Scroll thumbnails right' }),
      )

      expect(scrollBy).toHaveBeenCalledWith(
        expect.objectContaining({ left: 400 }),
      )
    })
  })

  describe('when expanded', () => {
    it('shows a heading with the image count and a collapse button', async () => {
      const { onExpandedChange } = renderThumbnails({ isExpanded: true })

      expect(
        screen.getByRole('heading', { name: 'All images (3)' }),
      ).toBeInTheDocument()
      await userEvent.click(
        screen.getByRole('button', { name: 'Collapse thumbnails' }),
      )

      expect(onExpandedChange).toHaveBeenCalledWith(false)
    })

    it('prevents the page behind it from scrolling', () => {
      renderThumbnails({ isExpanded: true })

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('focuses the selected thumbnail', () => {
      renderThumbnails({ isExpanded: true, selectedIndex: 1 })

      expect(getThumbnail('Lake')).toHaveFocus()
    })

    it('moves between thumbnails with the arrow keys and selects with Enter', async () => {
      const { onSelect, onExpandedChange } = renderThumbnails({
        isExpanded: true,
      })

      await userEvent.keyboard('{ArrowRight}{ArrowRight}')
      expect(getThumbnail('Mountain')).toHaveFocus()

      await userEvent.keyboard('{Enter}')
      expect(onSelect).toHaveBeenCalledWith(2)
      expect(onExpandedChange).toHaveBeenCalledWith(false)
    })

    it('wraps around when moving past the first thumbnail', async () => {
      renderThumbnails({ isExpanded: true })

      await userEvent.keyboard('{ArrowLeft}')

      expect(getThumbnail('Mountain')).toHaveFocus()
    })

    it('collapses when Escape is pressed', async () => {
      const { onSelect, onExpandedChange } = renderThumbnails({
        isExpanded: true,
      })

      await userEvent.keyboard('{Escape}')

      expect(onExpandedChange).toHaveBeenCalledWith(false)
      expect(onSelect).not.toHaveBeenCalled()
    })
  })
})
