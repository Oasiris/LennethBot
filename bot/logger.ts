import { createLogger, format, transports } from 'winston'

function instantiateLogger() {
    const logger = createLogger({
        level: 'info'
    })

    // Shouldn't print colors to production
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
        level: 'verbose'
    }));

    return logger
}

export { instantiateLogger }