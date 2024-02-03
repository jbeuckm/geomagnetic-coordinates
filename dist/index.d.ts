type Geo2MagRequest$1 = {
    longitude: number;
    latitude: number;
    date?: Date;
};
declare const geo2mag: (request: Geo2MagRequest$1) => {
    latitude: number;
    longitude: number;
};

type Geo2MagRequest = {
    longitude: number;
    latitude: number;
    date?: Date;
};
declare const mag2geo: (request: Geo2MagRequest) => {
    latitude: number;
    longitude: number;
};

export { geo2mag, mag2geo };
