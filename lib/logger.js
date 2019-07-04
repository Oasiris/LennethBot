"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
function instantiateLogger() {
    const logger = winston_1.createLogger({
        level: 'info'
    });
    // Shouldn't print colors to production
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
    }));
    return logger;
}
exports.instantiateLogger = instantiateLogger;
