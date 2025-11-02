"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const core_flows_1 = require("@medusajs/medusa/core-flows");
const utils_1 = require("@medusajs/framework/utils");
const POST = async (req, res) => {
    const access = 'public';
    const input = req.files;
    if (!input?.length) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, 'No files were uploaded');
    }
    const { result } = await (0, core_flows_1.uploadFilesWorkflow)(req.scope).run({
        input: {
            files: input?.map((f) => ({
                filename: f.originalname,
                mimeType: f.mimetype,
                content: f.buffer.toString('binary'),
                access,
            })),
        },
    });
    res.status(200).json({ files: result });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Byb2R1Y3QtcmV2aWV3cy91cGxvYWRzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDREQUFrRTtBQUNsRSxxREFBd0Q7QUFJakQsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQW1DLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ3JGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztJQUN4QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBOEIsQ0FBQztJQUVqRCxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxtQkFBVyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxJQUFBLGdDQUFtQixFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDMUQsS0FBSyxFQUFFO1lBQ0wsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxDQUFDLENBQUMsWUFBWTtnQkFDeEIsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRO2dCQUNwQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUNwQyxNQUFNO2FBQ1AsQ0FBQyxDQUFDO1NBQ0o7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQXBCVyxRQUFBLElBQUksUUFvQmYifQ==