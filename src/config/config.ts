import dotenv from "dotenv"
dotenv.config()

export const SwaggeroOptions = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Express Js Authentication",
            version: "1.0.0",
            description:
                "Complete authentication for express js backend application.",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            servers: [
                {
                    url: process.env.SERVER_URL,
                },
            ],
        },
    },
    apis: ["./routers/*.ts"],
}
