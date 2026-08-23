/// <reference types="react" />
import React, { useState, useEffect } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Adjustments } from "@medusajs/icons"
import {
  Heading,
  Container,
  Button,
  Input,
  Label,
  toast,
  Text,
} from "@medusajs/ui"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk.js"

const SiteSettingsPage = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      return (await sdk.client.fetch("/admin/site-settings")) as {
        settings: Record<string, any>
        store: { id: string; name: string } | null
      }
    },
  })

  const [form, setForm] = useState({
    menu_this_is_en: "THIS IS",
    menu_this_is_vi: "ĐÂY LÀ",
    menu_our_en: "OUR",
    menu_our_vi: "CỦA CHÚNG TÔI",
  })

  useEffect(() => {
    if (data?.settings) {
      setForm({
        menu_this_is_en: data.settings.menu_this_is_en || "THIS IS",
        menu_this_is_vi: data.settings.menu_this_is_vi || "ĐÂY LÀ",
        menu_our_en: data.settings.menu_our_en || "OUR",
        menu_our_vi: data.settings.menu_our_vi || "CỦA CHÚNG TÔI",
      })
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      return await sdk.client.fetch("/admin/site-settings", {
        method: "POST",
        body: payload,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] })
      toast.success("Settings saved successfully!")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save settings")
    },
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  if (isLoading) {
    return (
      <Container className="p-8">
        <Text>Loading site settings...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-ui-border-base">
        <div>
          <Heading level="h1" className="text-2xl font-bold">
            Site & Menu Settings
          </Heading>
          <Text className="text-ui-fg-muted mt-1 text-sm">
            Configure dynamic texts, multilingual menu headings, and general store settings.
          </Text>
        </div>
        <Button
          type="button"
          variant="primary"
          isLoading={mutation.isPending}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-ui-bg-subtle p-6 rounded-xl border border-ui-border-base space-y-4">
          <Heading level="h2" className="text-base font-semibold">
            Main Menu Headings ("THIS IS OUR")
          </Heading>
          <Text className="text-ui-fg-muted text-xs">
            Customise the large animated menu text displayed at the bottom of the main navigation screen.
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="menu_this_is_en" className="text-xs font-semibold">
                "THIS IS" (English)
              </Label>
              <Input
                id="menu_this_is_en"
                value={form.menu_this_is_en}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, menu_this_is_en: e.target.value }))
                }
                placeholder="e.g. THIS IS"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="menu_this_is_vi" className="text-xs font-semibold">
                "THIS IS" (Tiếng Việt)
              </Label>
              <Input
                id="menu_this_is_vi"
                value={form.menu_this_is_vi}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, menu_this_is_vi: e.target.value }))
                }
                placeholder="e.g. ĐÂY LÀ"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="menu_our_en" className="text-xs font-semibold">
                "OUR" (English)
              </Label>
              <Input
                id="menu_our_en"
                value={form.menu_our_en}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, menu_our_en: e.target.value }))
                }
                placeholder="e.g. OUR"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="menu_our_vi" className="text-xs font-semibold">
                "OUR" (Tiếng Việt)
              </Label>
              <Input
                id="menu_our_vi"
                value={form.menu_our_vi}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, menu_our_vi: e.target.value }))
                }
                placeholder="e.g. CỦA CHÚNG TÔI"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={mutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Site Settings",
  icon: Adjustments,
})

export default SiteSettingsPage
