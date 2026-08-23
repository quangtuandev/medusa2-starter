import PopupModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const POPUP_MODULE = "popupModuleService"

export default Module(POPUP_MODULE, {
  service: PopupModuleService,
})
