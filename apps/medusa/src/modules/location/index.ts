import LocationService from "./service"
import { Module } from "@medusajs/framework/utils"

export const LOCATION_MODULE = "location"

export default Module(LOCATION_MODULE, {
    service: LocationService,
})

