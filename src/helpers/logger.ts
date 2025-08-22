import fs from 'fs'
import path from 'path'
import { createLogger, transports, format } from 'winston'

// pastikan folder logs ada
const logDir = path.join(__dirname, "../../logs")
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

// winston logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console({ format: format.simple() }),
        new transports.File({ filename: path.join(logDir, "app.log") })
    ]
})

// manual log to file using fs
export function fileLogger(message: string) {
    const logFile = path.join(logDir, "manual.log")
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] - ${message}`)
}

export default logger