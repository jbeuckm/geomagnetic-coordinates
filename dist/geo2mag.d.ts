type Geo2MagRequest = {
    longitude: number;
    latitude: number;
    date?: Date;
};
export declare const geo2mag: (request: Geo2MagRequest) => {
    latitude: number;
    longitude: number;
};
export {};
