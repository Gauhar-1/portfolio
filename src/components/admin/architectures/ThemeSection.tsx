'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ArchitectureFormValues } from '@/validations/architectureSchema';

interface ThemeSectionProps {
  form: UseFormReturn<ArchitectureFormValues>;
}

export function ThemeSection({ form }: ThemeSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const name = watch('name');
  const primaryHex = watch('theme.primaryHex') || '#10b981';
  const backgroundHex = watch('theme.backgroundHex') || '#0a0a0c';
  const textHex = watch('theme.textHex') || '#f8fafc';

  // Helper to slugify the name
  const handleAutoSlug = () => {
    if (name) {
      const slugified = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', slugified, { shouldValidate: true });
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <Palette className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Section 01</span>
        </div>
        <CardTitle className="text-xl font-bold">Basic Info &amp; Visual Theme</CardTitle>
        <CardDescription>
          Define the case study route identifier and the dynamic CSS variables that drive its palette.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Name & Slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Case Study Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., QuickbiteQR, CloudScale IO"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="slug" className="text-sm font-semibold">
                Route Slug <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAutoSlug}
                className="h-6 text-xs text-muted-foreground hover:text-primary gap-1 px-1.5"
              >
                <Sparkles className="h-3 w-3" />
                Auto-generate
              </Button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-mono select-none">
                /architecture/
              </span>
              <Input
                id="slug"
                placeholder="quickbiteqr"
                {...register('slug')}
                className={`pl-[6.5rem] font-mono text-sm ${
                  errors.slug ? 'border-destructive' : ''
                }`}
              />
            </div>
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* ── Theme Color Pickers ─────────────────────────────────────── */}
        <div className="pt-2 border-t border-border/60">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Dynamic Theme Palette (Injected as CSS Variables)
          </h4>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Primary Accent Color */}
            <div className="space-y-2 rounded-xl border border-border p-3.5 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor="primaryHex" className="text-xs font-semibold">
                  Primary Accent
                </Label>
                {/* Live Circle Swatch with hidden native color input */}
                <label
                  htmlFor="primaryColorPicker"
                  className="relative h-7 w-7 rounded-full border border-border shadow-xs cursor-pointer overflow-hidden transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: primaryHex }}
                  title="Click to pick color"
                >
                  <input
                    id="primaryColorPicker"
                    type="color"
                    value={primaryHex.startsWith('#') ? primaryHex.slice(0, 7) : '#10b981'}
                    onChange={(e) => setValue('theme.primaryHex', e.target.value, { shouldValidate: true })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
              <Input
                id="primaryHex"
                placeholder="#10b981"
                {...register('theme.primaryHex')}
                className="font-mono text-xs uppercase"
              />
              <p className="text-[11px] text-muted-foreground">
                Drives glowing spotlights, charts &amp; badges.
              </p>
              {errors.theme?.primaryHex && (
                <p className="text-xs text-destructive">{errors.theme.primaryHex.message}</p>
              )}
            </div>

            {/* Background Base Color */}
            <div className="space-y-2 rounded-xl border border-border p-3.5 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor="backgroundHex" className="text-xs font-semibold">
                  Canvas Background
                </Label>
                <label
                  htmlFor="bgColorPicker"
                  className="relative h-7 w-7 rounded-full border border-border shadow-xs cursor-pointer overflow-hidden transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: backgroundHex }}
                  title="Click to pick color"
                >
                  <input
                    id="bgColorPicker"
                    type="color"
                    value={backgroundHex.startsWith('#') ? backgroundHex.slice(0, 7) : '#0a0a0c'}
                    onChange={(e) => setValue('theme.backgroundHex', e.target.value, { shouldValidate: true })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
              <Input
                id="backgroundHex"
                placeholder="#0a0a0c"
                {...register('theme.backgroundHex')}
                className="font-mono text-xs uppercase"
              />
              <p className="text-[11px] text-muted-foreground">
                Base obsidian or light canvas shade.
              </p>
              {errors.theme?.backgroundHex && (
                <p className="text-xs text-destructive">{errors.theme.backgroundHex.message}</p>
              )}
            </div>

            {/* Text Color */}
            <div className="space-y-2 rounded-xl border border-border p-3.5 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor="textHex" className="text-xs font-semibold">
                  Foreground Text
                </Label>
                <label
                  htmlFor="textColorPicker"
                  className="relative h-7 w-7 rounded-full border border-border shadow-xs cursor-pointer overflow-hidden transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: textHex }}
                  title="Click to pick color"
                >
                  <input
                    id="textColorPicker"
                    type="color"
                    value={textHex.startsWith('#') ? textHex.slice(0, 7) : '#f8fafc'}
                    onChange={(e) => setValue('theme.textHex', e.target.value, { shouldValidate: true })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
              <Input
                id="textHex"
                placeholder="#f8fafc"
                {...register('theme.textHex')}
                className="font-mono text-xs uppercase"
              />
              <p className="text-[11px] text-muted-foreground">
                Primary body and title typography color.
              </p>
              {errors.theme?.textHex && (
                <p className="text-xs text-destructive">{errors.theme.textHex.message}</p>
              )}
            </div>
          </div>

          {/* ── Live Visual Theme Preview Strip ───────────────────────── */}
          <div
            className="mt-4 rounded-xl p-4 border transition-colors flex items-center justify-between shadow-xs"
            style={{
              backgroundColor: backgroundHex,
              borderColor: `${primaryHex}40`,
              color: textHex,
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full animate-ping"
                style={{ backgroundColor: primaryHex }}
              />
              <span className="text-xs font-mono font-semibold" style={{ color: primaryHex }}>
                LIVE PREVIEW: OPERATIONAL
              </span>
            </div>
            <span className="text-xs font-semibold" style={{ color: textHex }}>
              {name || 'Case Study Title'} &bull; <span style={{ color: primaryHex }}>{primaryHex}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
