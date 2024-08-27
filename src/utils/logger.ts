import { format, createLogger, transports } from "winston"
import {
    ConsoleTransportInstance,
    FileTransportInstance,
} from "winston/lib/winston/transports"
import util from "util"
import { EApplicationEnvironment } from "../constant/const"
import path from "path"
import * as sourceMapSupport from "source-map-support"
import dotenv from 'dotenv'
dotenv.config()

//linking trace support
sourceMapSupport.install()

const consoleLogFormate = format.printf((info) => {
    const { level, message = "", timestamp, meta = {} } = info

    const customLevel = level.toUpperCase()

    const customTimeStamp = timestamp

    const customMessage = message

    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
    })

    const customLog = `${customLevel} [${customTimeStamp}] ${customMessage} \n {'META'} ${customMeta}`

    return customLog
})

const fileLogFormate = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info

    const logMeta: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack,
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta,
    }

    return JSON.stringify(logData, null, 4)
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (process.env.ENV_STATE === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: "info",
                format: format.combine(format.timestamp(), consoleLogFormate),
            }),
        ]
    }

    return []
}

const fileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(
                __dirname,
                "..",
                "..",
                "logs",
                `${process.env.ENV_STATE}.log`
            ),
            level: "info",
            format: format.combine(format.timestamp(), fileLogFormate),
        }),
    ]
}

export default createLogger({
    defaultMeta: {
        meta: {},
    },
    transports: [...fileTransport(), ...consoleTransport()],
})
