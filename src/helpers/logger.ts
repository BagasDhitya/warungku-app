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
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] - ${message}\n`)
}

// =======================
// HTML Report Generator
// =======================
export function generateHtmlReport(filename: "app.log" | "manual.log" = "app.log") {
    const logFile = path.join(logDir, filename)
    if (!fs.existsSync(logFile)) {
        console.warn("Log file not found:", logFile)
        return
    }

    const logs = fs.readFileSync(logFile, "utf-8")
        .split("\n")
        .filter(line => line.trim() !== "")

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Log Report - ${filename}</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #007BFF; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .timestamp { font-weight: bold; color: #555; }
            .message { color: #222; }
        </style>
    </head>
    <body>
        <h1>Log Report - ${filename}</h1>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Timestamp</th>
                    <th>Message / Data</th>
                </tr>
            </thead>
            <tbody>
    `

    logs.forEach((line, index) => {
        let timestamp = "", message = ""
        try {
            // parsing JSON logs (winston)
            const obj = JSON.parse(line)
            timestamp = obj.timestamp || ""
            message = obj.message || JSON.stringify(obj)
        } catch {
            // fallback manual log
            const match = line.match(/^\[(.*?)\] - (.*)$/)
            if (match) {
                timestamp = match[1]
                message = match[2]
            } else {
                message = line
            }
        }

        htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td class="timestamp">${timestamp}</td>
                <td class="message">${message}</td>
            </tr>
        `
    })

    htmlContent += `
            </tbody>
        </table>
    </body>
    </html>
    `

    const htmlFile = path.join(logDir, `${filename}.html`)
    fs.writeFileSync(htmlFile, htmlContent)
    console.log("HTML report generated:", htmlFile)
}

export default logger
