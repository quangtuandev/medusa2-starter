import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
    baseUrl: (process.env as any).VITE_BACKEND_URL || "/",
    debug: (process.env as any).DEV,
    auth: {
        type: "session",
    },
})  