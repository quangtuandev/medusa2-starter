import StoreService from "./service"
import { Module } from "@medusajs/framework/utils"

export const STORE_MODULE = "store"

export default Module(STORE_MODULE, {
    service: StoreService,
})
