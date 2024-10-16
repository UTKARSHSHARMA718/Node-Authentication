import { EROLE } from "../constant/const"

export interface IRegisterRequestBody {
    name: string
    email: string
    password: string
    mobile: string
    image?: string
    consent: boolean
}

export interface IUser {
    name: string
    email: string
    image: string
    mobile: {
        isoCode: string
        countryCode: string
        internationalNumber: string
    }
    pdf: {
        filename: string
        contentType: string
        data: Buffer
    }
    timezone: string
    password: string
    role: EROLE
    accountConfirmation: {
        status: boolean
        token: string
        code: string
        timestamp: Date | null
    }
    passwordReset: {
        token: string | null
        expiry: number | null
        lastResetAt: Date | null
    }
    lastLoginAt: Date | null
    consent: boolean
}
