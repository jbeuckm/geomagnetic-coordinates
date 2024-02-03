"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMagneticPole = void 0;
const magnetic_north_json_1 = __importDefault(require("./magnetic_north.json"));
const findMagneticPole = (date) => {
    const year = (date || new Date()).getFullYear();
    const magNorth = magnetic_north_json_1.default.find(entry => entry.year === year);
    return magNorth || { latitude: 80.8, longitude: 287.4 }; // 2024
};
exports.findMagneticPole = findMagneticPole;
