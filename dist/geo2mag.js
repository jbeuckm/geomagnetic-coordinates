"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geo2mag = void 0;
const findMagneticPole_1 = require("./findMagneticPole");
const multiplyVectorByMatrix_1 = require("./multiplyVectorByMatrix");
const HALF_PI = Math.PI / 2;
const TO_RADIANS = Math.PI / 180;
const TO_DEGREES = 180 / Math.PI;
// based on https://idlastro.gsfc.nasa.gov/ftp/pro/astro/geo2mag.pro
// FUNCTION geo2mag,incoord
// ; INPUT:
// ;       gcoord = a 2-element array of geographic [latitude,longitude], or an
// ;                array [2,n] of n such coordinates.
const geo2mag = (request) => {
    const magNorth = (0, findMagneticPole_1.findMagneticPole)(request.date);
    //   ; SOME 'constants'...
    //   Dlong=288.59D   ; longitude (in degrees) of Earth's magnetic south pole
    //                   ;(which is near the geographic north pole!) (1995)
    let Dlong = magNorth.longitude;
    //   Dlat=79.30D     ; latitude (in degrees) of same (1995)
    let Dlat = magNorth.latitude;
    //   R = 1D          ; distance from planet center (value unimportant --
    //            ;just need a length for conversion to rectangular coordinates)
    const R = 1;
    //   ; convert first to radians
    //   Dlong=Dlong*!DPI/180.
    Dlong = Dlong * TO_RADIANS;
    //   Dlat=Dlat*!DPI/180.
    Dlat = Dlat * TO_RADIANS;
    //   glat=DOUBLE(incoord[0,*])*!DPI/180.
    let glat = request.latitude * TO_RADIANS;
    //   glon=DOUBLE(incoord[1,*])*!DPI/180.
    let glon = request.longitude * TO_RADIANS;
    //   galt=glat * 0. + R
    let galt = R;
    //   coord=[glat,glon,galt]
    let coord = [glat, glon, galt];
    //   ;convert to rectangular coordinates
    //   ;       X-axis: defined by the vector going from Earth's center towards
    //   ;            the intersection of the equator and Greenwitch's meridian.
    //   ;       Z-axis: axis of the geographic poles
    //   ;       Y-axis: defined by Y=Z^X
    //   x=coord[2,*]*cos(coord[0,*])*cos(coord[1,*])
    let x = coord[2] * Math.cos(coord[0]) * Math.cos(coord[1]);
    //   y=coord[2,*]*cos(coord[0,*])*sin(coord[1,*])
    let y = coord[2] * Math.cos(coord[0]) * Math.sin(coord[1]);
    //   z=coord[2,*]*sin(coord[0,*])
    let z = coord[2] * Math.sin(coord[0]);
    //   ;Compute 1st rotation matrix : rotation around plane of the equator,
    //   ;from the Greenwich meridian to the meridian containing the magnetic
    //   ;dipole pole.
    //   geolong2maglong=dblarr(3,3)
    const geolong2maglong = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    //   geolong2maglong[0,0]=cos(Dlong)
    geolong2maglong[0][0] = Math.cos(Dlong);
    //   geolong2maglong[0,1]=sin(Dlong)
    geolong2maglong[0][1] = Math.sin(Dlong);
    //   geolong2maglong[1,0]=-sin(Dlong)
    geolong2maglong[1][0] = -Math.sin(Dlong);
    //   geolong2maglong[1,1]=cos(Dlong)
    geolong2maglong[1][1] = Math.cos(Dlong);
    //   geolong2maglong[2,2]=1.
    geolong2maglong[2][2] = 1;
    //   out=geolong2maglong # [x,y,z]
    let out = (0, multiplyVectorByMatrix_1.multiplyVectorByMatrix)([x, y, z], geolong2maglong);
    //   ;Second rotation : in the plane of the current meridian from geographic
    //   ;                  pole to magnetic dipole pole.
    //   tomaglat=dblarr(3,3)
    const tomaglat = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    //   tomaglat[0,0]=cos(!DPI/2-Dlat)
    tomaglat[0][0] = Math.cos(HALF_PI - Dlat);
    //   tomaglat[0,2]=-sin(!DPI/2-Dlat)
    tomaglat[0][2] = -Math.sin(HALF_PI - Dlat);
    //   tomaglat[2,0]=sin(!DPI/2-Dlat)
    tomaglat[2][0] = Math.sin(HALF_PI - Dlat);
    //   tomaglat[2,2]=cos(!DPI/2-Dlat)
    tomaglat[2][2] = Math.cos(HALF_PI - Dlat);
    //   tomaglat[1,1]=1.
    tomaglat[1][1] = 1;
    //   out= tomaglat # out
    out = (0, multiplyVectorByMatrix_1.multiplyVectorByMatrix)(out, tomaglat);
    //   ;convert back to latitude, longitude and altitude
    //   mlat=atan(out[2,*],sqrt(out[0,*]^2+out[1,*]^2))
    let mlat = Math.atan2(out[2], Math.sqrt(Math.pow(out[0], 2) + Math.pow(out[1], 2)));
    //   mlat=mlat*180./!DPI
    mlat = mlat * TO_DEGREES;
    //   mlon=atan(out[1,*],out[0,*])
    let mlon = Math.atan2(out[1], out[0]);
    //   mlon=mlon*180./!DPI
    mlon = mlon * TO_DEGREES;
    //   ;malt=sqrt(out[0,*]^2+out[1,*]^2+out[2,*]^2)-R
    // ;  I don't care about that one...just put it there for completeness' sake
    //   RETURN,[mlat,mlon]
    return { latitude: mlat, longitude: mlon };
};
exports.geo2mag = geo2mag;
