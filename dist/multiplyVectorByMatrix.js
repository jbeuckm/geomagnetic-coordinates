"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyVectorByMatrix = void 0;
function multiplyVectorByMatrix(vector, matrix) {
    // Check if the vector and matrix are compatible for multiplication
    if (vector.length !== matrix[0].length) {
        throw new Error("Incompatible dimensions for multiplication");
    }
    // Initialize the result vector with zeros
    let result = Array(matrix.length).fill(0);
    // Perform the multiplication
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < vector.length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}
exports.multiplyVectorByMatrix = multiplyVectorByMatrix;
