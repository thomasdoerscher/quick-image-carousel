import type { CarouselImage } from './types'

export const testImages: CarouselImage[] = [
  {
    id: '1',
    src: 'https://example.com/forest.jpg',
    thumbnail: 'https://example.com/forest-thumb.jpg',
    title: 'Forest',
    author: 'Ada Lovelace',
    camera: 'Canon, EOS R5',
    date: '2013-06-09',
  },
  {
    id: '2',
    src: 'https://example.com/lake.jpg',
    thumbnail: 'https://example.com/lake-thumb.jpg',
    title: 'Lake',
    author: 'Grace Hopper',
    camera: null,
    date: '2014-01-15',
  },
  {
    id: '3',
    src: 'https://example.com/mountain.jpg',
    thumbnail: 'https://example.com/mountain-thumb.jpg',
    title: 'Mountain',
    author: 'Alan Turing',
    camera: 'FUJIFILM, X-E1',
    date: '2015-12-31',
  },
]
