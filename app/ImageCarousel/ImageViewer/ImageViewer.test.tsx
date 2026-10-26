import { render, screen } from '@testing-library/react'
import { testImages } from '../testImages'
import { ImageViewer } from './ImageViewer'

const [imageWithCamera, imageWithoutCamera] = testImages

describe('ImageViewer', () => {
  it('shows the image with its title as alt text', () => {
    render(<ImageViewer image={imageWithCamera} />)

    expect(screen.getByRole('img', { name: 'Forest' })).toHaveAttribute(
      'src',
      imageWithCamera.src,
    )
  })

  it('shows the title and author', () => {
    render(<ImageViewer image={imageWithCamera} />)

    expect(screen.getByRole('heading', { name: 'Forest' })).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  })

  it('shows a human-readable date and the camera', () => {
    render(<ImageViewer image={imageWithCamera} />)

    const date = screen.getByText('June 9, 2013')
    expect(date).toHaveAttribute('dateTime', '2013-06-09')
    expect(screen.getByText(/Canon, EOS R5/)).toBeInTheDocument()
  })

  it('omits the camera when it is unknown', () => {
    render(<ImageViewer image={imageWithoutCamera} />)

    expect(
      screen.getByText('January 15, 2014').parentElement,
    ).toHaveTextContent(/^January 15, 2014$/)
  })
})
