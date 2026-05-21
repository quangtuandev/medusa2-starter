import { MedusaService } from "@medusajs/framework/utils"
import { EmailSetting } from "./models/email-setting"

class EmailSettingsService extends MedusaService({
    EmailSetting,
}) {
    // Base CRUD methods (createEmailSettings, updateEmailSettings, etc.)
    // are automatically available from MedusaService
}

export default EmailSettingsService
