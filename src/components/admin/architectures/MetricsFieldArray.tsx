'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Plus, Trash2 } from 'lucide-react';
import type { ArchitectureFormValues } from '@/validations/architectureSchema';

interface MetricsFieldArrayProps {
  form: UseFormReturn<ArchitectureFormValues>;
}

export function MetricsFieldArray({ form }: MetricsFieldArrayProps) {
  const { register, control, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hero.metrics',
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <Layers className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Section 02</span>
        </div>
        <CardTitle className="text-xl font-bold">Hero Section &amp; Key Metrics</CardTitle>
        <CardDescription>
          Configure the dynamic headline reveal and the key engineering numbers displayed in the HUD.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hero Title & Subtitle */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle" className="text-sm font-semibold">
              Hero Headline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="heroTitle"
              placeholder="e.g., Building QuickbiteQR: Architecting a Zero-Commission POS from 0 to 1."
              {...register('hero.title')}
              className={errors.hero?.title ? 'border-destructive' : ''}
            />
            {errors.hero?.title && (
              <p className="text-xs text-destructive">{errors.hero.title.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Tip: Use a colon (": ") to split the headline into a cinematic staggered dual-line reveal.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle" className="text-sm font-semibold">
              Hero Subtitle <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="heroSubtitle"
              rows={2}
              placeholder="e.g., How I built a serverless architecture to handle Friday night restaurant rushes with 98% compute margins."
              {...register('hero.subtitle')}
              className={errors.hero?.subtitle ? 'border-destructive' : ''}
            />
            {errors.hero?.subtitle && (
              <p className="text-xs text-destructive">{errors.hero.subtitle.message}</p>
            )}
          </div>
        </div>

        {/* ── Dynamic Field Array: Hero Metrics ──────────────────────── */}
        <div className="pt-4 border-t border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold">Hero Metrics Cards (HUD)</h4>
              <p className="text-xs text-muted-foreground">
                Typically 4 metrics displayed in a 2x2 mobile grid and 4-column desktop HUD.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', value: '', ariaLabel: '' })}
              disabled={fields.length >= 6}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Metric
            </Button>
          </div>

          {errors.hero?.metrics?.root && (
            <p className="text-xs text-destructive">{errors.hero.metrics.root.message}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-xl border border-border bg-muted/20 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                      Metric #{index + 1}
                    </span>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Title</Label>
                      <Input
                        placeholder="e.g. Compute Margin"
                        {...register(`hero.metrics.${index}.title` as const)}
                        className={errors.hero?.metrics?.[index]?.title ? 'border-destructive' : ''}
                      />
                      {errors.hero?.metrics?.[index]?.title && (
                        <p className="text-[10px] text-destructive">
                          {errors.hero.metrics[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <Input
                        placeholder="e.g. 98.9%, ₹15 / mo"
                        {...register(`hero.metrics.${index}.value` as const)}
                        className={errors.hero?.metrics?.[index]?.value ? 'border-destructive' : ''}
                      />
                      {errors.hero?.metrics?.[index]?.value && (
                        <p className="text-[10px] text-destructive">
                          {errors.hero.metrics[index]?.value?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Accessibility Label (Optional)</Label>
                    <Input
                      placeholder="e.g. Compute margin: 98.9 percent"
                      {...register(`hero.metrics.${index}.ariaLabel` as const)}
                      className="text-xs"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
