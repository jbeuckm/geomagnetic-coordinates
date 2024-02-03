import MAGNETIC_NORTH from "./magnetic_north.json";
export const findMagneticPole = (date) => {
    const year = (date || new Date()).getFullYear();
    const magNorth = MAGNETIC_NORTH.find((entry) => entry.year === year);
    return magNorth || { latitude: 80.8, longitude: 287.4 }; // 2024
};
