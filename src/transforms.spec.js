import { geo2mag } from './geo2mag'
import { mag2geo } from './mag2geo'

describe('transforms', () => {
  test('geo2mag', () => {
    const result = geo2mag({ longitude: -93, latitude: 45 })

    expect(result.latitude).toBeCloseTo(53.511)
    expect(result.longitude).toBeCloseTo(-24.486)
  })

  test('mag2geo', () => {
    const date = new Date()
    date.setFullYear(1995)

    const result = mag2geo({ longitude: 0, latitude: 90, date })

    expect(result.latitude).toBeCloseTo(79.4)
    expect(result.longitude).toBeCloseTo(-71.4)
  })
})
