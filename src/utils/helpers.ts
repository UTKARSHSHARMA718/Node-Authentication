import fs from "fs"
import path from "path"
import logger from "./logger"

export const readHtml = async (templateName: string) => {
    try {
        if (!templateName) {
            return null
        }
        console.log({
            path: path.join(
                __dirname,
                "..",
                "..",
                "views",
                "templates",
                templateName
            ),
        })
        let htmlFile = await new Promise((res, rej) => {
            fs.readFile(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    "views",
                    "templates",
                    templateName
                ),
                "utf-8",
                (err, html) => {
                    if (err) {
                        logger.error(err)
                        rej(err)
                        return
                    }
                    res(html)
                }
            )
        })

        return htmlFile
    } catch (err) {
        console.log({err})
        return null
    }
}

/**
 * Checks if the difference between updatedAt and the current time is greater than the specified minutes.
 * @param {Date} updatedAt - The timestamp to compare against.
 * @param {number} minutes - The time in minutes to check the difference against.
 * @returns {boolean} - Returns true if the difference is greater than the specified minutes, otherwise false.
 */
export const isTimeDifferenceGreaterThan = (
    updatedAt: Date,
    minutes: number
) => {
    // Convert updatedAt to a Date object if it's not already
    const updatedAtDate = new Date(updatedAt)

    // Get the current time
    const now = new Date()

    // Convert both times to UTC timestamps
    const updatedAtUTC = Date.UTC(
        updatedAtDate.getUTCFullYear(),
        updatedAtDate.getUTCMonth(),
        updatedAtDate.getUTCDate(),
        updatedAtDate.getUTCHours(),
        updatedAtDate.getUTCMinutes(),
        updatedAtDate.getUTCSeconds()
    )
    const nowUTC = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    )

    // Calculate the difference in milliseconds
    const diffInMilliseconds = nowUTC - updatedAtUTC

    // Convert minutes to milliseconds
    const minutesInMilliseconds = minutes * 60 * 1000

    // Compare the difference
    return diffInMilliseconds <= minutesInMilliseconds
}

export const getUrlWithQuery = (
    prefix: string,
    queryArray: Array<{ query: string; value: string | number }>
) => {
    let url = `${process.env.SERVER_URL}`
    if (prefix) {
        url = `${process.env.SERVER_URL}/${prefix}`
    }
    url = url + "?"
    queryArray?.forEach((queryItem) => {
        url = url + `${queryItem?.query}=${queryItem?.value}`
    })

    return url
}
