import * as fs from "fs"
import * as path from "path"

const STORE_FILE = path.resolve(process.cwd(), ".feature-flags.json")

/**
 * A simple runtime feature flag store that persists to a JSON file.
 * This allows admin users to toggle flags without restarting the server.
 * Falls back to the static FeatureFlag config when no runtime override exists.
 */
class RuntimeFeatureFlagStore {
  private flags: Map<string, boolean> = new Map()

  constructor() {
    this.load()
  }

  get(key: string): boolean | undefined {
    return this.flags.get(key)
  }

  set(key: string, value: boolean): void {
    this.flags.set(key, value)
    this.save()
  }

  private load(): void {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const data = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"))
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === "boolean") {
            this.flags.set(key, value)
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load runtime feature flags:", error)
    }
  }

  private save(): void {
    try {
      const data: Record<string, boolean> = {}
      for (const [key, value] of this.flags.entries()) {
        data[key] = value
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8")
    } catch (error) {
      console.error("Failed to save runtime feature flags:", error)
    }
  }
}

export const runtimeFeatureFlags = new RuntimeFeatureFlagStore()
