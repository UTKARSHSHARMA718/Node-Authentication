import { getTimezonesForCountry } from "countries-and-timezones"
import { parsePhoneNumber } from "libphonenumber-js"
import os from "os"
import bcrypt from "bcrypt"
import { v4 } from "uuid"
import { randomInt } from "crypto"
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

/**
 * Initializing dayjs with utc timezone
 */
dayjs?.extend(utc);

export default {
    getSystemHealth: () => {
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
        }
    },
    getApplicationHealth: () => {
        return {
            environment: process.env.ENV_STATE,
            uptime: `${process.uptime().toFixed(2)} Second`,
            memoryUsage: {
                heapTotal: `${(
                    process.memoryUsage().heapTotal /
                    1024 /
                    1024
                ).toFixed(2)} MB`,
                heapUsed: `${(
                    process.memoryUsage().heapUsed /
                    1024 /
                    1024
                ).toFixed(2)} MB`,
            },
        }
    },
    parsePhoneNumber: (phoneNumber: string) => {
        try {
            const parsedPhoneNumber = parsePhoneNumber(phoneNumber)
            if (parsedPhoneNumber) {
                return {
                    countryCode: parsedPhoneNumber.countryCallingCode,
                    isoCode: parsedPhoneNumber.country || null,
                    internationalNumber:
                        parsedPhoneNumber.formatInternational(),
                }
            }

            return {
                countryCode: null,
                isoCode: null,
                internationalNumber: null,
            }
        } catch (err) {
            return {
                countryCode: null,
                isoCode: null,
                internationalNumber: null,
            }
        }
    },
    timezone: (isoCode: string) => {
        return getTimezonesForCountry(isoCode)
    },
    encryptString: (originalString: string) => {
        return bcrypt.hash(originalString, 5)
    },
    generatedRandomeID: () => v4(),
    generateOTP: (length: number) => {
        const min = Math.pow(10, length - 1)
        const max = Math.pow(10, length) - 1
        return randomInt(min, max)
    },
    getUTCTimezone: ()=>{
        return dayjs()?.utc()?.toDate();
    }   
}
