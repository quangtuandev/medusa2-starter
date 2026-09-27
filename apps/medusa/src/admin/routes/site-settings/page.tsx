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
  Textarea,
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
    stories_title_top_en: "",
    stories_title_top_vi: "",
    stories_title_bottom_en: "",
    stories_title_bottom_vi: "",
    stories_story_label_en: "",
    stories_story_label_vi: "",
    stories_mission_label_en: "",
    stories_mission_label_vi: "",
    stories_packaging_label_en: "",
    stories_packaging_label_vi: "",
    stories_story_text_en: "",
    stories_story_text_vi: "",
    stories_mission_text_en: "",
    stories_mission_text_vi: "",
    stories_packaging_text_en: "",
    stories_packaging_text_vi: "",
  })

  useEffect(() => {
    if (data?.settings) {
      setForm({
        menu_this_is_en: data.settings.menu_this_is_en || "THIS IS",
        menu_this_is_vi: data.settings.menu_this_is_vi || "ĐÂY LÀ",
        menu_our_en: data.settings.menu_our_en || "OUR",
        menu_our_vi: data.settings.menu_our_vi || "CỦA CHÚNG TÔI",
        stories_title_top_en: data.settings.stories_title_top_en || "",
        stories_title_top_vi: data.settings.stories_title_top_vi || "",
        stories_title_bottom_en: data.settings.stories_title_bottom_en || "",
        stories_title_bottom_vi: data.settings.stories_title_bottom_vi || "",
        stories_story_label_en: data.settings.stories_story_label_en || "",
        stories_story_label_vi: data.settings.stories_story_label_vi || "",
        stories_mission_label_en: data.settings.stories_mission_label_en || "",
        stories_mission_label_vi: data.settings.stories_mission_label_vi || "",
        stories_packaging_label_en: data.settings.stories_packaging_label_en || "",
        stories_packaging_label_vi: data.settings.stories_packaging_label_vi || "",
        stories_story_text_en: data.settings.stories_story_text_en || "",
        stories_story_text_vi: data.settings.stories_story_text_vi || "",
        stories_mission_text_en: data.settings.stories_mission_text_en || "",
        stories_mission_text_vi: data.settings.stories_mission_text_vi || "",
        stories_packaging_text_en: data.settings.stories_packaging_text_en || "",
        stories_packaging_text_vi: data.settings.stories_packaging_text_vi || "",
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

        {/* Stories Page Settings */}
        <div className="bg-ui-bg-subtle p-6 rounded-xl border border-ui-border-base space-y-6">
          <div>
            <Heading level="h2" className="text-base font-semibold">
              Stories Page Settings ("/stories")
            </Heading>
            <Text className="text-ui-fg-muted text-xs mt-0.5">
              Tùy chỉnh tiêu đề, tên các tab và toàn bộ văn bản giới thiệu cho trang Stories. Nếu để trống, hệ thống sẽ sử dụng giá trị mặc định.
            </Text>
          </div>

          {/* Title & Tabs */}
          <div className="space-y-4">
            <Text className="text-ui-fg-subtle text-xs font-semibold uppercase tracking-wider">
              1. Tiêu đề & Danh mục Menu (Sidebar)
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stories_title_top_en" className="text-xs font-semibold">
                  Tiêu đề dòng 1 (English)
                </Label>
                <Input
                  id="stories_title_top_en"
                  value={form.stories_title_top_en}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_title_top_en: e.target.value }))
                  }
                  placeholder="Mặc định: THIS"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_title_top_vi" className="text-xs font-semibold">
                  Tiêu đề dòng 1 (Tiếng Việt)
                </Label>
                <Input
                  id="stories_title_top_vi"
                  value={form.stories_title_top_vi}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_title_top_vi: e.target.value }))
                  }
                  placeholder="Mặc định: ĐÂY LÀ"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_title_bottom_en" className="text-xs font-semibold">
                  Tiêu đề dòng 2 (English)
                </Label>
                <Input
                  id="stories_title_bottom_en"
                  value={form.stories_title_bottom_en}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_title_bottom_en: e.target.value }))
                  }
                  placeholder="Mặc định: IS Our"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_title_bottom_vi" className="text-xs font-semibold">
                  Tiêu đề dòng 2 (Tiếng Việt)
                </Label>
                <Input
                  id="stories_title_bottom_vi"
                  value={form.stories_title_bottom_vi}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_title_bottom_vi: e.target.value }))
                  }
                  placeholder="Mặc định: LÀ CỦA CHÚNG TÔI"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_story_label_en" className="text-xs font-semibold">
                  Tab 1 Label (English)
                </Label>
                <Input
                  id="stories_story_label_en"
                  value={form.stories_story_label_en}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_story_label_en: e.target.value }))
                  }
                  placeholder="Mặc định: STORY"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_story_label_vi" className="text-xs font-semibold">
                  Tab 1 Label (Tiếng Việt)
                </Label>
                <Input
                  id="stories_story_label_vi"
                  value={form.stories_story_label_vi}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_story_label_vi: e.target.value }))
                  }
                  placeholder="Mặc định: CÂU CHUYỆN"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_mission_label_en" className="text-xs font-semibold">
                  Tab 2 Label (English)
                </Label>
                <Input
                  id="stories_mission_label_en"
                  value={form.stories_mission_label_en}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_mission_label_en: e.target.value }))
                  }
                  placeholder="Mặc định: MISSION"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_mission_label_vi" className="text-xs font-semibold">
                  Tab 2 Label (Tiếng Việt)
                </Label>
                <Input
                  id="stories_mission_label_vi"
                  value={form.stories_mission_label_vi}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_mission_label_vi: e.target.value }))
                  }
                  placeholder="Mặc định: SỨ MỆNH"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_packaging_label_en" className="text-xs font-semibold">
                  Tab 3 Label (English)
                </Label>
                <Input
                  id="stories_packaging_label_en"
                  value={form.stories_packaging_label_en}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_packaging_label_en: e.target.value }))
                  }
                  placeholder="Mặc định: PACKAGING"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stories_packaging_label_vi" className="text-xs font-semibold">
                  Tab 3 Label (Tiếng Việt)
                </Label>
                <Input
                  id="stories_packaging_label_vi"
                  value={form.stories_packaging_label_vi}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, stories_packaging_label_vi: e.target.value }))
                  }
                  placeholder="Mặc định: BAO BÌ"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-ui-border-base pt-4 space-y-4">
            <Text className="text-ui-fg-subtle text-xs font-semibold uppercase tracking-wider">
              2. Nội dung giới thiệu (Phần giới thiệu)
            </Text>

            {/* Story text */}
            <div className="space-y-3 pt-1">
              <Heading level="h3" className="text-sm font-semibold">
                Phần giới thiệu "Story"
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stories_story_text_en" className="text-xs font-semibold">
                    Nội dung Story (English)
                  </Label>
                  <Textarea
                    id="stories_story_text_en"
                    rows={4}
                    value={form.stories_story_text_en}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stories_story_text_en: e.target.value }))
                    }
                    placeholder="Mặc định: Kira was born as a joyful sparkling fragrance, capturing the very essence of sunshine and laughter in every delicate spritz..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stories_story_text_vi" className="text-xs font-semibold">
                    Nội dung Story (Tiếng Việt)
                  </Label>
                  <Textarea
                    id="stories_story_text_vi"
                    rows={4}
                    value={form.stories_story_text_vi}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stories_story_text_vi: e.target.value }))
                    }
                    placeholder="Mặc định: Kira ra đời như một làn hương rực rỡ và tràn đầy niềm vui..."
                  />
                </div>
              </div>
            </div>

            {/* Mission text */}
            <div className="space-y-3 pt-2">
              <Heading level="h3" className="text-sm font-semibold">
                Phần giới thiệu "Mission"
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stories_mission_text_en" className="text-xs font-semibold">
                    Nội dung Mission (English)
                  </Label>
                  <Textarea
                    id="stories_mission_text_en"
                    rows={4}
                    value={form.stories_mission_text_en}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stories_mission_text_en: e.target.value }))
                    }
                    placeholder="Mặc định: Kira was born as a joyful sparkling fragrance..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stories_mission_text_vi" className="text-xs font-semibold">
                    Nội dung Mission (Tiếng Việt)
                  </Label>
                  <Textarea
                    id="stories_mission_text_vi"
                    rows={4}
                    value={form.stories_mission_text_vi}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stories_mission_text_vi: e.target.value }))
                    }
                    placeholder="Mặc định: Kira ra đời như một làn hương rực rỡ và tràn đầy niềm vui..."
                  />
                </div>
              </div>
            </div>

            {/* Packaging text */}
            <div className="space-y-3 pt-2">
              <Heading level="h3" className="text-sm font-semibold">
                Phần giới thiệu "Packaging"
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="stories_packaging_text_en" className="text-xs font-semibold">
                    Nội dung Packaging (English)
                  </Label>
                  <Textarea
                    id="stories_packaging_text_en"
                    rows={5}
                    value={form.stories_packaging_text_en}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stories_packaging_text_en: e.target.value }))
                    }
                    placeholder="Mặc định: One special aspect of Kira is that the packaging is entirely made of paper and sugarcane bagasse..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stories_packaging_text_vi" className="text-xs font-semibold">
                    Nội dung Packaging (Tiếng Việt)
                  </Label>
                  <Textarea
                    id="stories_packaging_text_vi"
                    rows={5}
                    value={form.stories_packaging_text_vi}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, stories_packaging_text_vi: e.target.value }))
                    }
                    placeholder="Mặc định: Điểm đặc biệt ở Kira là bao bì hoàn toàn từ giấy và bã mía..."
                  />
                </div>
              </div>
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
