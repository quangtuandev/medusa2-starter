import { MedusaService } from "@medusajs/framework/utils"
import { BankAccount } from "./models/bank-account"

class BankAccountService extends MedusaService({
    BankAccount,
}) {
    // Custom methods can be added here if needed
    // The base CRUD methods are automatically available from MedusaService
}

export default BankAccountService

