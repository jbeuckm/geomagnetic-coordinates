import { findMagneticPole } from './findMagneticPole'
import { multiplyVectorByMatrix } from './multiplyVectorByMatrix'

type Geo2MagRequest = {
  longitude: number
  latitude: number
  date?: Date
}

const HALF_PI = Math.PI / 2
const TO_RADIANS = Math.PI / 180
const TO_DEGREES = 180 / Math.PI

// based on https://idlastro.gsfc.nasa.gov/ftp/pro/astro/mag2geo.pro
// FUNCTION mag2geo,incoord
export const mag2geo = (request: Geo2MagRequest) => {
  const magNorth = findMagneticPole(request.date)

  //         ; SOME 'constants'...
  //         Dlong=288.59D   ; longitude (in degrees) of Earth's magnetic south pole
  let Dlong = magNorth.longitude
  //   Dlat=79.30D     ; latitude (in degrees) of same (1995)
  let Dlat = magNorth.latitude
  //   R = 1D          ; distance from planet center (value unimportant --
  //            ;just need a length for conversion to rectangular coordinates)
  const R = 1

  //   ; convert first to radians
  //   Dlong=Dlong*!DPI/180.
  Dlong = Dlong * TO_RADIANS
  //   Dlat=Dlat*!DPI/180.
  Dlat = Dlat * TO_RADIANS

  //         mlat=DOUBLE(incoord[0,*])*!DPI/180.
  let mlat = request.latitude * TO_RADIANS
  //         mlon=DOUBLE(incoord[1,*])*!DPI/180.
  let mlon = request.longitude * TO_RADIANS
  //         malt=mlat * 0. + R
  let malt = R

  //         coord=[mlat,mlon,malt]
  const coord = [mlat, mlon, malt]

  //         ;convert to rectangular coordinates
  //         ;       X-axis: defined by the vector going from Earth's center towards
  //         ;            the intersection of the equator and Greenwich's meridian.
  //         ;       Z-axis: axis of the geographic poles
  //         ;       Y-axis: defined by Y=Z^X
  //         x=coord[2,*]*cos(coord[0,*])*cos(coord[1,*])
  let x = coord[2] * Math.cos(coord[0]) * Math.cos(coord[1])
  //         y=coord[2,*]*cos(coord[0,*])*sin(coord[1,*])
  let y = coord[2] * Math.cos(coord[0]) * Math.sin(coord[1])
  //         z=coord[2,*]*sin(coord[0,*])
  let z = coord[2] * Math.sin(coord[0])

  //         ;First rotation : in the plane of the current meridian from magnetic
  //         ;pole to geographic pole.
  //         togeolat=dblarr(3,3)
  const togeolat = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  //         togeolat[0,0]=cos(!DPI/2-Dlat)
  togeolat[0][0] = Math.cos(HALF_PI - Dlat)
  //         togeolat[0,2]=sin(!DPI/2-Dlat)
  togeolat[0][2] = Math.sin(HALF_PI - Dlat)
  //         togeolat[2,0]=-sin(!DPI/2-Dlat)
  togeolat[2][0] = -Math.sin(HALF_PI - Dlat)
  //         togeolat[2,2]=cos(!DPI/2-Dlat)
  togeolat[2][2] = Math.cos(HALF_PI - Dlat)
  //         togeolat[1,1]=1.
  togeolat[1][1] = 1

  //         out= togeolat # [x,y,z]
  let out = multiplyVectorByMatrix([x, y, z], togeolat)

  //         ;Second rotation matrix : rotation around plane of the equator, from
  //         ;the meridian containing the magnetic poles to the Greenwich meridian.
  //         maglong2geolong=dblarr(3,3)
  const maglong2geolong = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  //         maglong2geolong[0,0]=cos(Dlong)
  maglong2geolong[0][0] = Math.cos(Dlong)
  //         maglong2geolong[0,1]=-sin(Dlong)
  maglong2geolong[0][1] = -Math.sin(Dlong)
  //         maglong2geolong[1,0]=sin(Dlong)
  maglong2geolong[1][0] = Math.sin(Dlong)
  //         maglong2geolong[1,1]=cos(Dlong)
  maglong2geolong[1][1] = Math.cos(Dlong)
  //         maglong2geolong[2,2]=1.
  maglong2geolong[2][2] = 1
  //         out=maglong2geolong # out
  out = multiplyVectorByMatrix(out, maglong2geolong)

  //         ;convert back to latitude, longitude and altitude
  //         glat=atan(out[2,*],sqrt(out[0,*]^2+out[1,*]^2))
  let glat = Math.atan2(out[2], Math.sqrt(Math.pow(out[0], 2) + Math.pow(out[1], 2)))
  //         glat=glat*180./!DPI
  glat = glat * TO_DEGREES
  //         glon=atan(out[1,*],out[0,*])
  let glon = Math.atan2(out[1], out[0])
  //         glon=glon*180./!DPI
  glon = glon * TO_DEGREES
  //         ;galt=sqrt(out[0,*]^2+out[1,*]^2+out[2,*]^2)-R  ; I don't care about that one...just put it there for completeness' sake

  //         RETURN,[glat,glon]
  return { latitude: glat, longitude: glon }
}
