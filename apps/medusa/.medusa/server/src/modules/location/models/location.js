"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.Location = utils_1.model.define("location", {
    id: utils_1.model.id().primaryKey(),
    name: utils_1.model.text(),
    iso_country_code: utils_1.model.text(),
    address_lines: utils_1.model.text(),
    options: utils_1.model.json().default({}),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9sb2NhdGlvbi9tb2RlbHMvbG9jYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQWlEO0FBRXBDLFFBQUEsUUFBUSxHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0lBQzdDLEVBQUUsRUFBRSxhQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFO0lBQzNCLElBQUksRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFO0lBQ2xCLGdCQUFnQixFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDOUIsYUFBYSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUU7SUFDM0IsT0FBTyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0NBQ3BDLENBQUMsQ0FBQSJ9