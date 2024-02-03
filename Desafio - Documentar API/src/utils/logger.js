import winston from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        info: 'blue',
        debug: 'white',
        http: 'green'
    }
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.File({
            filename: './errors.html',
            level: 'fatal',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.html',
            level: 'error',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.html',
            level: 'http',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.html',
            level: 'warning',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.html',
            level: 'info',
            format: winston.format.combine(
                winston.format.simple()
            )
        }),
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})


export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.debug(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}