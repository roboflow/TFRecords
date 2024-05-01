"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Guard {
    /**
     * Validates the string express is not null or empty, otherwise throws an exception
     * @param value - The value to validate
     * @param paramName - The name of the parameter to validate
     * @param message - The error message to return on invalid value
     */
    static empty(value, paramName, message) {
        if (value === null || !value || value.trim().length === 0) {
            message = message || (`'${paramName || "value"}' cannot be null or empty`);
            throw new Error(message);
        }
    }
    /**
     * Validates the value is not null, otherwise throw an exception
     * @param value - The value to validate
     * @param paramName - The name of the parameter to validate
     * @param message - The error message to return on invalid value
     */
    static null(value, paramName, message) {
        if (!value) {
            message = message || (`'${paramName || "value"}' cannot be null or undefined`);
            throw new Error(message);
        }
    }
    /**
     * Validates the value meets the specified expectation, otherwise throws an exception
     * @param value - The value to validate
     * @param predicate - The predicate used for validation
     * @param paramName - The name of the parameter to validate
     * @param message - The error message to return on invalid value
     */
    static expression(value, predicate, paramName, message) {
        if (!value || !predicate(value)) {
            message = message || (`'${paramName || "value"}' is not a valid value`);
            throw new Error(message);
        }
    }
}
exports.default = Guard;
