import PageModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const PAGE_MODULE = "pageModuleService"

export default Module(PAGE_MODULE, {
    service: PageModuleService,
})
