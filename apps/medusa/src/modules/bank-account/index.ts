import BankAccountService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BANK_ACCOUNT_MODULE = "bankAccount"

export default Module(BANK_ACCOUNT_MODULE, {
    service: BankAccountService,
})

