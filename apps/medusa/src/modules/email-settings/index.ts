import EmailSettingsService from "./service"
import { Module } from "@medusajs/framework/utils"

export const EMAIL_SETTINGS_MODULE = "emailSettings"

export default Module(EMAIL_SETTINGS_MODULE, {
    service: EmailSettingsService,
})
