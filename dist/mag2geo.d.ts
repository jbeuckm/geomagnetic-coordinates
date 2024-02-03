type Geo2MagRequest = {
    longitude: number;
    latitude: number;
    date?: Date;
};
export declare const mag2geo: (request: Geo2MagRequest) => {
    latitude: number;
    longitude: number;
};
export {};
