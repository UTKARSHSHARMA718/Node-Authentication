import os from "os"

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
}
