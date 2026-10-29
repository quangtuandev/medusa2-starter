/// <reference types="react" />
import { defineRouteConfig } from '@medusajs/admin-sdk';
import { ArrowDownMini, ArrowUpMini, Photo, Plus, Trash } from '@medusajs/icons';
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Tabs,
  Text,
  Textarea,
  toast,
} from '@medusajs/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sdk } from '../../lib/sdk';

/* ── types ───────────────────────────────────────────────────────────────── */

/** One slide of the hero carousel. */
type HeroBanner = {
  id?: string;
  is_active: boolean;
  rank?: number;
  image_desktop_url: string;
  image_mobile_url?: string | null;
  title_en: string;
  title_vi: string;
  subtitle_en?: string | null;
  subtitle_vi?: string | null;
  cta_label_en: string;
  cta_label_vi: string;
  cta_href: string;
  cta_variant: 'primary' | 'outline' | 'glass';
  text_color: string;
  text_align: 'left' | 'center';
};

type BestSellerItem = {
  product_id?: string | null;
  image_url?: string;
  link?: string | null;
  alt_en?: string | null;
  alt_vi?: string | null;
  rank: number;
};

type BestSellerSection = {
  id?: string;
  is_active: boolean;
  heading_en: string;
  heading_vi: string;
  description_en?: string | null;
  description_vi?: string | null;
  items: BestSellerItem[];
};

const EMPTY_HERO: HeroBanner = {
  is_active: true,
  rank: undefined,
  image_desktop_url: '',
  image_mobile_url: '',
  title_en: 'RiCE MILK',
  title_vi: 'RiCE MILK',
  subtitle_en: 'eau de parfums | 50ML',
  subtitle_vi: 'eau de parfums | 50ML',
  cta_label_en: 'SHOP NOW',
  cta_label_vi: 'MUA NGAY',
  cta_href: '/products',
  cta_variant: 'primary',
  text_color: '#FFFFFF',
  text_align: 'left',
};

const EMPTY_BEST_SELLER: BestSellerSection = {
  is_active: true,
  heading_en: 'BEST SELLER',
  heading_vi: 'BÁN CHẠY NHẤT',
  description_en: '',
  description_vi: '',
  items: [],
};

const MAX_ITEMS = 6;

/* ── helpers ─────────────────────────────────────────────────────────────── */

const HeroPreview = ({ hero }: { hero: HeroBanner }) => (
  <div className="relative w-full overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle aspect-[16/10]">
    {hero.image_desktop_url ? (
      <img src={hero.image_desktop_url} alt="Hero preview" className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full items-center justify-center txt-compact-small text-ui-fg-muted">
        Hero image preview
      </div>
    )}
    <div
      className={`absolute inset-0 flex flex-col justify-end gap-1 p-4 ${
        hero.text_align === 'center' ? 'items-center text-center' : 'items-start text-left'
      }`}
      style={{ color: hero.text_color || '#FFFFFF' }}
    >
      <span className="text-2xl font-extrabold uppercase leading-none">{hero.title_en || 'TITLE'}</span>
      <span className="text-[10px] font-light">{hero.subtitle_en || 'subtitle'}</span>
      <span
        className={`mt-2 rounded-full px-4 py-1 text-[10px] font-bold uppercase ${
          hero.cta_variant === 'primary'
            ? 'bg-[#3B2314] text-white'
            : hero.cta_variant === 'outline'
              ? 'border border-white text-white'
              : 'bg-white/20 text-white backdrop-blur'
        }`}
      >
        {hero.cta_label_en || 'SHOP NOW'}
      </span>
    </div>
  </div>
);

const ImageField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const response = await sdk.admin.upload.create({ files: [file] });
      onChange(response.files[0].url);
      toast.success(`${label} uploaded`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to upload ${label.toLowerCase()}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label size="small">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-subtle">
          {value ? <img src={value} alt={label} className="h-full w-full object-cover" /> : null}
        </div>
        <Input
          value={value ?? ''}
          placeholder="https://… or /assets/…"
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="small"
          isLoading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

/* ── hero tab: slide manager ─────────────────────────────────────────────── */

const HeroTab = () => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<HeroBanner>(EMPTY_HERO);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ hero_banners: HeroBanner[] }>({
    queryKey: ['homepage', 'hero'],
    queryFn: () => sdk.client.fetch('/admin/homepage/hero'),
  });

  const slides = useMemo(() => data?.hero_banners ?? [], [data]);

  // Keep the editor in sync with the selected slide (and with server refreshes).
  useEffect(() => {
    if (!editingId) return;
    const slide = slides.find((item) => item.id === editingId);
    if (slide) setDraft({ ...EMPTY_HERO, ...slide });
  }, [editingId, slides]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['homepage', 'hero'] });

  const save = useMutation({
    mutationFn: (payload: HeroBanner) =>
      sdk.client.fetch<{ hero_banner: HeroBanner }>('/admin/homepage/hero', {
        method: 'PUT',
        body: payload,
      }),
    onSuccess: (response) => {
      toast.success('Hero slide saved');
      setEditingId(response?.hero_banner?.id ?? null);
      invalidate();
    },
    onError: () => toast.error('Could not save the hero slide'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => sdk.client.fetch(`/admin/homepage/hero/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Slide removed');
      setEditingId(null);
      setDraft(EMPTY_HERO);
      invalidate();
    },
    onError: () => toast.error('Could not remove the slide'),
  });

  const patch = async (slide: HeroBanner, changes: Partial<HeroBanner>) => {
    try {
      await sdk.client.fetch('/admin/homepage/hero', {
        method: 'PUT',
        body: { ...slide, ...changes },
      });
      invalidate();
    } catch {
      toast.error('Could not update the slide');
    }
  };

  const swap = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;

    const current = slides[index];
    const neighbour = slides[target];

    await Promise.all([
      sdk.client.fetch('/admin/homepage/hero', {
        method: 'PUT',
        body: { ...current, rank: target },
      }),
      sdk.client.fetch('/admin/homepage/hero', {
        method: 'PUT',
        body: { ...neighbour, rank: index },
      }),
    ]);
    invalidate();
  };

  const set = <K extends keyof HeroBanner>(key: K, value: HeroBanner[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Slide list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Heading level="h2">Slides</Heading>
          <Badge size="2xsmall">{slides.length}</Badge>
        </div>

        <div className="flex flex-col gap-2">
          {slides.map((slide, index) => {
            const isSelected = slide.id === editingId;
            return (
              <div
                key={slide.id}
                className={`flex items-center gap-3 rounded-lg border p-2 transition-colors ${
                  isSelected ? 'border-ui-border-interactive bg-ui-bg-base' : 'border-ui-border-base'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setEditingId(slide.id ?? null)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-ui-bg-subtle">
                    {slide.image_desktop_url ? (
                      <img src={slide.image_desktop_url} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <Text size="small" weight="plus" className="truncate">
                      {slide.title_en || 'Untitled slide'}
                    </Text>
                    <Text size="xsmall" className="text-ui-fg-muted">
                      #{index + 1} · {slide.is_active ? 'Visible' : 'Hidden'}
                    </Text>
                  </div>
                </button>

                <div className="flex flex-col">
                  <Button size="small" variant="transparent" onClick={() => swap(index, -1)} aria-label="Move slide up">
                    <ArrowUpMini />
                  </Button>
                  <Button
                    size="small"
                    variant="transparent"
                    onClick={() => swap(index, 1)}
                    aria-label="Move slide down"
                  >
                    <ArrowDownMini />
                  </Button>
                </div>
              </div>
            );
          })}

          {!slides.length && !isLoading && (
            <div className="rounded-lg border border-dashed border-ui-border-base p-6 text-center">
              <Text size="small" className="text-ui-fg-muted">
                No slides yet — add the first one.
              </Text>
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setEditingId(null);
            setDraft({ ...EMPTY_HERO });
          }}
        >
          <Plus /> Add slide
        </Button>

        <Text size="xsmall" className="text-ui-fg-muted">
          The hero loops through every visible slide, top to bottom.
        </Text>
      </div>

      {/* Editor */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <Heading level="h2">{editingId ? 'Edit slide' : 'New slide'}</Heading>
          <div className="flex items-center gap-2">
            <Text size="small" className="text-ui-fg-muted">
              Visible
            </Text>
            <Switch checked={draft.is_active} onCheckedChange={(checked) => set('is_active', checked)} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label size="small">Desktop image (required)</Label>
            <ImageField
              label="Desktop image"
              value={draft.image_desktop_url}
              onChange={(url) => set('image_desktop_url', url)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <ImageField
              label="Mobile image (optional)"
              value={draft.image_mobile_url}
              onChange={(url) => set('image_mobile_url', url)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label size="small">Title (EN)</Label>
            <Input value={draft.title_en} onChange={(e) => set('title_en', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label size="small">Title (VI)</Label>
            <Input value={draft.title_vi} onChange={(e) => set('title_vi', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label size="small">Subtitle (EN)</Label>
            <Input value={draft.subtitle_en ?? ''} onChange={(e) => set('subtitle_en', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label size="small">Subtitle (VI)</Label>
            <Input value={draft.subtitle_vi ?? ''} onChange={(e) => set('subtitle_vi', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label size="small">CTA label (EN)</Label>
            <Input value={draft.cta_label_en} onChange={(e) => set('cta_label_en', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label size="small">CTA label (VI)</Label>
            <Input value={draft.cta_label_vi} onChange={(e) => set('cta_label_vi', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label size="small">CTA link</Label>
            <Input
              value={draft.cta_href}
              placeholder="/products or /collections/<handle>"
              onChange={(e) => set('cta_href', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label size="small">CTA variant</Label>
            <Select
              value={draft.cta_variant}
              onValueChange={(value) => set('cta_variant', value as HeroBanner['cta_variant'])}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="primary">Primary</Select.Item>
                <Select.Item value="outline">Outline</Select.Item>
                <Select.Item value="glass">Glass</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label size="small">Text align</Label>
            <Select
              value={draft.text_align}
              onValueChange={(value) => set('text_align', value as HeroBanner['text_align'])}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="left">Left</Select.Item>
                <Select.Item value="center">Center</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label size="small">Text colour</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.text_color}
                onChange={(e) => set('text_color', e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-ui-border-base bg-transparent"
              />
              <Input value={draft.text_color} onChange={(e) => set('text_color', e.target.value)} />
            </div>
          </div>
        </div>

        <HeroPreview hero={draft} />

        <div className="flex items-center gap-2">
          <Button isLoading={save.isPending || isLoading} onClick={() => save.mutate(draft)}>
            {editingId ? 'Save slide' : 'Create slide'}
          </Button>
          {editingId && (
            <Button variant="danger" isLoading={remove.isPending} onClick={() => remove.mutate(editingId)}>
              <Trash /> Delete slide
            </Button>
          )}
          {editingId && (
            <Button variant="secondary" onClick={() => patch(draft, { is_active: !draft.is_active })}>
              {draft.is_active ? 'Hide slide' : 'Show slide'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── best seller tab ─────────────────────────────────────────────────────── */

const BestSellerTab = () => {
  const queryClient = useQueryClient();
  const [section, setSection] = useState<BestSellerSection>(EMPTY_BEST_SELLER);

  const { data, isLoading } = useQuery<{ best_seller: BestSellerSection | null }>({
    queryKey: ['homepage', 'best-seller'],
    queryFn: () => sdk.client.fetch('/admin/homepage/best-seller'),
  });

  useEffect(() => {
    if (data?.best_seller) {
      setSection({
        ...EMPTY_BEST_SELLER,
        ...data.best_seller,
        items: (data.best_seller.items || []).map((item, index) => ({
          ...item,
          rank: typeof item.rank === 'number' ? item.rank : index,
        })),
      });
    }
  }, [data]);

  const { data: productsData } = useQuery<{ products: any[] }>({
    queryKey: ['admin-products-picker'],
    queryFn: () =>
      sdk.admin.product.list({
        limit: 200,
        fields: 'id,title,handle,thumbnail',
      }) as unknown as Promise<{ products: any[] }>,
  });

  const products = productsData?.products ?? [];

  const mutation = useMutation({
    mutationFn: (payload: BestSellerSection) =>
      sdk.client.fetch('/admin/homepage/best-seller', { method: 'PUT', body: payload }),
    onSuccess: () => {
      toast.success('Best seller section saved');
      void queryClient.invalidateQueries({ queryKey: ['homepage', 'best-seller'] });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.message || 'Could not save the best seller section');
    },
  });

  const setItem = (index: number, patch: Partial<BestSellerItem>) =>
    setSection((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const move = (index: number, direction: -1 | 1) =>
    setSection((prev) => {
      const next = [...prev.items];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, items: next.map((item, i) => ({ ...item, rank: i })) };
    });

  const addItem = () =>
    setSection((prev) => ({
      ...prev,
      items: [...prev.items, { image_url: '', link: '', alt_en: '', alt_vi: '', rank: prev.items.length }],
    }));

  const removeItem = (index: number) =>
    setSection((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, rank: i })),
    }));

  const productOptions = useMemo(
    () => products.map((product) => ({ value: product.id, label: product.title })),
    [products],
  );

  const pickProduct = (index: number, productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    setItem(index, {
      product_id: product.id,
      link: product.handle ? `/products/${product.handle}` : undefined,
      image_url: (product.thumbnail as string) || undefined,
      alt_en: product.title,
      alt_vi: product.title,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label size="small">Heading (EN)</Label>
          <Input
            value={section.heading_en}
            onChange={(e) => setSection((p) => ({ ...p, heading_en: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label size="small">Heading (VI)</Label>
          <Input
            value={section.heading_vi}
            onChange={(e) => setSection((p) => ({ ...p, heading_vi: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label size="small">Description (EN)</Label>
          <Textarea
            rows={3}
            value={section.description_en ?? ''}
            onChange={(e) => setSection((p) => ({ ...p, description_en: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label size="small">Description (VI)</Label>
          <Textarea
            rows={3}
            value={section.description_vi ?? ''}
            onChange={(e) => setSection((p) => ({ ...p, description_vi: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heading level="h2">Cards</Heading>
          <Badge size="2xsmall">
            {section.items.length}/{MAX_ITEMS}
          </Badge>
        </div>
        <Button size="small" variant="secondary" disabled={section.items.length >= MAX_ITEMS} onClick={addItem}>
          <Plus /> Add card
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {section.items.map((item, index) => (
          <div key={index} className="rounded-lg border border-ui-border-base p-4">
            <div className="mb-3 flex items-center justify-between">
              <Text size="small" weight="plus">
                Card {index + 1}
              </Text>
              <div className="flex items-center gap-1">
                <Button size="small" variant="transparent" onClick={() => move(index, -1)}>
                  <ArrowUpMini />
                </Button>
                <Button size="small" variant="transparent" onClick={() => move(index, 1)}>
                  <ArrowDownMini />
                </Button>
                <Button size="small" variant="transparent" onClick={() => removeItem(index)}>
                  <Trash />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label size="small">Product (fills image, link and alt)</Label>
                <Select value={item.product_id ?? undefined} onValueChange={(value) => pickProduct(index, value)}>
                  <Select.Trigger>
                    <Select.Value placeholder="Pick a product…" />
                  </Select.Trigger>
                  <Select.Content>
                    {productOptions.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <ImageField
                  label="Card image"
                  value={item.image_url}
                  onChange={(url) => setItem(index, { image_url: url })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label size="small">Alt (EN)</Label>
                <Input value={item.alt_en ?? ''} onChange={(e) => setItem(index, { alt_en: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label size="small">Alt (VI)</Label>
                <Input value={item.alt_vi ?? ''} onChange={(e) => setItem(index, { alt_vi: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label size="small">Link</Label>
                <Input
                  value={item.link ?? ''}
                  placeholder="/products/<handle>"
                  onChange={(e) => setItem(index, { link: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        {section.items.length === 0 && (
          <div className="rounded-lg border border-dashed border-ui-border-base p-8 text-center">
            <Text size="small" className="text-ui-fg-muted">
              No cards yet — add between 1 and {MAX_ITEMS}.
            </Text>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {section.items.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[16px] border border-ui-border-base bg-ui-bg-subtle aspect-[4/5]"
          >
            {item.image_url ? (
              <img src={item.image_url} alt={item.alt_en ?? ''} className="h-full w-full object-cover" />
            ) : null}
          </div>
        ))}
      </div>

      <Button
        isLoading={mutation.isPending || isLoading}
        disabled={section.items.length === 0}
        onClick={() => mutation.mutate(section)}
      >
        Save best seller
      </Button>
    </div>
  );
};

/* ── page ────────────────────────────────────────────────────────────────── */

const HomepagePage = () => (
  <Container className="divide-y p-0">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex flex-col">
        <Heading>Homepage</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Hero banner, best seller cards and the collections deck.
        </Text>
      </div>
    </div>

    <Tabs defaultValue="hero">
      <Tabs.List className="px-6">
        <Tabs.Trigger value="hero">Hero Banner</Tabs.Trigger>
        <Tabs.Trigger value="best-seller">Best Seller</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="hero" className="px-6 py-6">
        <HeroTab />
      </Tabs.Content>
      <Tabs.Content value="best-seller" className="px-6 py-6">
        <BestSellerTab />
      </Tabs.Content>
    </Tabs>
  </Container>
);

export const config = defineRouteConfig({
  label: 'Homepage',
  icon: Photo,
});

export default HomepagePage;
