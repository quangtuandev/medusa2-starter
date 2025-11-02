"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validationLoader;
const utils_1 = require("@medusajs/framework/utils");
const service_1 = require("../service");
async function validationLoader({ options, }) {
    const result = service_1.modduleOptionsSchema.safeParse(options);
    if (!result.success) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, `Product Review Module. Invalid options: ${JSON.stringify(result.error.flatten().fieldErrors)}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXJldmlldy9sb2FkZXJzL3ZhbGlkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsbUNBV0M7QUFkRCxxREFBdUQ7QUFDdkQsd0NBQWdFO0FBRWpELEtBQUssVUFBVSxnQkFBZ0IsQ0FBQyxFQUM3QyxPQUFPLEdBQ3NCO0lBQzdCLE1BQU0sTUFBTSxHQUFHLDhCQUFvQixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLE1BQU0sSUFBSSxtQkFBVyxDQUNuQixtQkFBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQzlCLDJDQUEyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FDaEcsQ0FBQTtJQUNILENBQUM7QUFDSCxDQUFDIn0=