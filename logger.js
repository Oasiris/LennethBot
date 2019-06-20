const { createLogger, format, transports } = require('winston')

module.exports.createLogger = function() {
    const logger = createLogger({
        level: 'info'
    })

    // Shouldn't print colors to production
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));

    return logger
}