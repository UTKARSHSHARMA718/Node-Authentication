export type THttpResponse = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THttpError = {
    success: boolean
    statusCode: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
    trace?: object | null
}

export type TFile = {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
}

export type TValidationError = {
    errors: [
        {
            type: "field" // Indicates the type of the validation error
            value: string // Contains the invalid value or identifier for the field
            msg: string // Error message describing the validation issue
            path: string // The path to the field that caused the error
            location: "body" // The location of the error (e.g., request body)]
        }
    ]
}
