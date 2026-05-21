import {
    AbstractNotificationProviderService,
} from "@medusajs/framework/utils"
import {
    ProviderSendNotificationDTO,
    ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import * as nodemailer from "nodemailer"

type NodemailerOptions = {
    host: string
    port: number
    secure?: boolean
    auth_user: string
    auth_pass: string
    from: string
}

class NodemailerNotificationService extends AbstractNotificationProviderService {
    static identifier = "nodemailer"
    protected transporter: nodemailer.Transporter
    protected from: string

    constructor(container: any, options: NodemailerOptions) {
        super()

        const port = Number(options.port) || 587
        this.from = options.from || options.auth_user

        this.transporter = nodemailer.createTransport({
            host: options.host,
            port,
            secure: port === 465,
            auth: {
                user: options.auth_user,
                pass: options.auth_pass,
            },
        })
    }

    async send(
        notification: ProviderSendNotificationDTO
    ): Promise<ProviderSendNotificationResultsDTO> {
        const { to, template, data } = notification

        // data should contain subject, html for our custom usage
        const subject = (data?.subject as string) || template || "Notification"
        let html = (data?.html as string) || ""

        // Replace template variables in html
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === "string" || typeof value === "number") {
                    html = html.replace(
                        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
                        String(value)
                    )
                }
            }
        }

        const info = await this.transporter.sendMail({
            from: this.from,
            to,
            subject,
            html: html || `<p>${subject}</p>`,
        })

        return { id: info.messageId }
    }
}

export default NodemailerNotificationService
