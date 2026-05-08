"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeFeatureFlags = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const STORE_FILE = path.resolve(process.cwd(), ".feature-flags.json");
/**
 * A simple runtime feature flag store that persists to a JSON file.
 * This allows admin users to toggle flags without restarting the server.
 * Falls back to the static FeatureFlag config when no runtime override exists.
 */
class RuntimeFeatureFlagStore {
    flags = new Map();
    constructor() {
        this.load();
    }
    get(key) {
        return this.flags.get(key);
    }
    set(key, value) {
        this.flags.set(key, value);
        this.save();
    }
    load() {
        try {
            if (fs.existsSync(STORE_FILE)) {
                const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === "boolean") {
                        this.flags.set(key, value);
                    }
                }
            }
        }
        catch (error) {
            console.warn("Failed to load runtime feature flags:", error);
        }
    }
    save() {
        try {
            const data = {};
            for (const [key, value] of this.flags.entries()) {
                data[key] = value;
            }
            fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
        }
        catch (error) {
            console.error("Failed to save runtime feature flags:", error);
        }
    }
}
exports.runtimeFeatureFlags = new RuntimeFeatureFlagStore();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvYWRtaW4vZmVhdHVyZS1mbGFncy9ydW50aW1lLXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUF3QjtBQUN4QiwyQ0FBNEI7QUFFNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtBQUVyRTs7OztHQUlHO0FBQ0gsTUFBTSx1QkFBdUI7SUFDbkIsS0FBSyxHQUF5QixJQUFJLEdBQUcsRUFBRSxDQUFBO0lBRS9DO1FBQ0UsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2IsQ0FBQztJQUVELEdBQUcsQ0FBQyxHQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFjO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDYixDQUFDO0lBRU8sSUFBSTtRQUNWLElBQUksQ0FBQztZQUNILElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7Z0JBQzdELEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ2hELElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7d0JBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtvQkFDNUIsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM5RCxDQUFDO0lBQ0gsQ0FBQztJQUVPLElBQUk7UUFDVixJQUFJLENBQUM7WUFDSCxNQUFNLElBQUksR0FBNEIsRUFBRSxDQUFBO1lBQ3hDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUE7WUFDbkIsQ0FBQztZQUNELEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN0RSxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDL0QsQ0FBQztJQUNILENBQUM7Q0FDRjtBQUVZLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSx1QkFBdUIsRUFBRSxDQUFBIn0=