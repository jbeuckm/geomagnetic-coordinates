"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  geo2mag: () => geo2mag,
  mag2geo: () => mag2geo
});
module.exports = __toCommonJS(src_exports);

// src/magnetic_north.json
var magnetic_north_default = [
  { year: 1900, latitude: 78.7, longitude: 291.2 },
  { year: 1905, latitude: 78.7, longitude: 291.3 },
  { year: 1910, latitude: 78.7, longitude: 291.3 },
  { year: 1915, latitude: 78.6, longitude: 291.4 },
  { year: 1920, latitude: 78.6, longitude: 291.6 },
  { year: 1925, latitude: 78.6, longitude: 291.7 },
  { year: 1930, latitude: 78.6, longitude: 291.7 },
  { year: 1935, latitude: 78.6, longitude: 291.6 },
  { year: 1940, latitude: 78.5, longitude: 291.5 },
  { year: 1945, latitude: 78.5, longitude: 291.5 },
  { year: 1950, latitude: 78.5, longitude: 291.2 },
  { year: 1955, latitude: 78.5, longitude: 290.8 },
  { year: 1960, latitude: 78.6, longitude: 290.5 },
  { year: 1965, latitude: 78.6, longitude: 290.1 },
  { year: 1970, latitude: 78.7, longitude: 289.8 },
  { year: 1975, latitude: 78.8, longitude: 289.5 },
  { year: 1980, latitude: 78.9, longitude: 289.2 },
  { year: 1985, latitude: 79, longitude: 289.1 },
  { year: 1990, latitude: 79.2, longitude: 288.9 },
  { year: 1995, latitude: 79.4, longitude: 288.6 },
  { year: 2e3, latitude: 79.6, longitude: 288.4 },
  { year: 2005, latitude: 79.8, longitude: 288.2 },
  { year: 2010, latitude: 80.1, longitude: 287.8 },
  { year: 2015, latitude: 80.4, longitude: 287.4 },
  { year: 2016, latitude: 80.4, longitude: 287.4 },
  { year: 2017, latitude: 80.5, longitude: 287.4 },
  { year: 2018, latitude: 80.5, longitude: 287.3 },
  { year: 2019, latitude: 80.6, longitude: 287.3 },
  { year: 2020, latitude: 80.7, longitude: 287.3 },
  { year: 2021, latitude: 80.7, longitude: 287.3 },
  { year: 2022, latitude: 80.7, longitude: 287.3 },
  { year: 2023, latitude: 80.8, longitude: 287.3 },
  { year: 2024, latitude: 80.8, longitude: 287.4 },
  { year: 2025, latitude: 80.9, longitude: 287.4 }
];

// src/findMagneticPole.ts
var findMagneticPole = (date) => {
  const year = (date || /* @__PURE__ */ new Date()).getFullYear();
  const magNorth = magnetic_north_default.find(
    (entry) => entry.year === year
  );
  return magNorth || { latitude: 80.8, longitude: 287.4 };
};

// src/multiplyVectorByMatrix.ts
function multiplyVectorByMatrix(vector, matrix) {
  if (vector.length !== matrix[0].length) {
    throw new Error("Incompatible dimensions for multiplication");
  }
  let result = Array(matrix.length).fill(0);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < vector.length; j++) {
      result[i] += matrix[i][j] * vector[j];
    }
  }
  return result;
}

// src/geo2mag.ts
var HALF_PI = Math.PI / 2;
var TO_RADIANS = Math.PI / 180;
var TO_DEGREES = 180 / Math.PI;
var geo2mag = (request) => {
  const magNorth = findMagneticPole(request.date);
  let Dlong = magNorth.longitude;
  let Dlat = magNorth.latitude;
  const R = 1;
  Dlong = Dlong * TO_RADIANS;
  Dlat = Dlat * TO_RADIANS;
  let glat = request.latitude * TO_RADIANS;
  let glon = request.longitude * TO_RADIANS;
  let galt = R;
  let coord = [glat, glon, galt];
  let x = coord[2] * Math.cos(coord[0]) * Math.cos(coord[1]);
  let y = coord[2] * Math.cos(coord[0]) * Math.sin(coord[1]);
  let z = coord[2] * Math.sin(coord[0]);
  const geolong2maglong = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  geolong2maglong[0][0] = Math.cos(Dlong);
  geolong2maglong[0][1] = Math.sin(Dlong);
  geolong2maglong[1][0] = -Math.sin(Dlong);
  geolong2maglong[1][1] = Math.cos(Dlong);
  geolong2maglong[2][2] = 1;
  let out = multiplyVectorByMatrix([x, y, z], geolong2maglong);
  const tomaglat = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  tomaglat[0][0] = Math.cos(HALF_PI - Dlat);
  tomaglat[0][2] = -Math.sin(HALF_PI - Dlat);
  tomaglat[2][0] = Math.sin(HALF_PI - Dlat);
  tomaglat[2][2] = Math.cos(HALF_PI - Dlat);
  tomaglat[1][1] = 1;
  out = multiplyVectorByMatrix(out, tomaglat);
  let mlat = Math.atan2(out[2], Math.sqrt(Math.pow(out[0], 2) + Math.pow(out[1], 2)));
  mlat = mlat * TO_DEGREES;
  let mlon = Math.atan2(out[1], out[0]);
  mlon = mlon * TO_DEGREES;
  return { latitude: mlat, longitude: mlon };
};

// src/mag2geo.ts
var HALF_PI2 = Math.PI / 2;
var TO_RADIANS2 = Math.PI / 180;
var TO_DEGREES2 = 180 / Math.PI;
var mag2geo = (request) => {
  const magNorth = findMagneticPole(request.date);
  let Dlong = magNorth.longitude;
  let Dlat = magNorth.latitude;
  const R = 1;
  Dlong = Dlong * TO_RADIANS2;
  Dlat = Dlat * TO_RADIANS2;
  let mlat = request.latitude * TO_RADIANS2;
  let mlon = request.longitude * TO_RADIANS2;
  let malt = R;
  const coord = [mlat, mlon, malt];
  let x = coord[2] * Math.cos(coord[0]) * Math.cos(coord[1]);
  let y = coord[2] * Math.cos(coord[0]) * Math.sin(coord[1]);
  let z = coord[2] * Math.sin(coord[0]);
  const togeolat = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  togeolat[0][0] = Math.cos(HALF_PI2 - Dlat);
  togeolat[0][2] = Math.sin(HALF_PI2 - Dlat);
  togeolat[2][0] = -Math.sin(HALF_PI2 - Dlat);
  togeolat[2][2] = Math.cos(HALF_PI2 - Dlat);
  togeolat[1][1] = 1;
  let out = multiplyVectorByMatrix([x, y, z], togeolat);
  const maglong2geolong = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  maglong2geolong[0][0] = Math.cos(Dlong);
  maglong2geolong[0][1] = -Math.sin(Dlong);
  maglong2geolong[1][0] = Math.sin(Dlong);
  maglong2geolong[1][1] = Math.cos(Dlong);
  maglong2geolong[2][2] = 1;
  out = multiplyVectorByMatrix(out, maglong2geolong);
  let glat = Math.atan2(out[2], Math.sqrt(Math.pow(out[0], 2) + Math.pow(out[1], 2)));
  glat = glat * TO_DEGREES2;
  let glon = Math.atan2(out[1], out[0]);
  glon = glon * TO_DEGREES2;
  return { latitude: glat, longitude: glon };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  geo2mag,
  mag2geo
});
//# sourceMappingURL=index.js.map